import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI, paymentAPI } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard } from 'lucide-react';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_type: 'pickup',
    delivery_address: '',
    special_instructions: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Load Razorpay SDK script dynamically ──────────────────────────────────
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // If already loaded, resolve immediately
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ── Full payment + order creation flow ────────────────────────────────────
  // CORRECT ORDER:
  //   1. Validate form
  //   2. Load Razorpay SDK
  //   3. Create Razorpay payment order (gets razorpay_order_id)
  //   4. Open Razorpay checkout popup
  //   5. On payment SUCCESS → create order in our DB → verify payment → navigate
  //   6. On payment FAILURE → show error, nothing saved in DB
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.customer_name.trim()) { toast.error('Please enter your name'); return; }
    if (!formData.customer_email.trim()) { toast.error('Please enter your email'); return; }
    if (!formData.customer_phone.trim()) { toast.error('Please enter your phone'); return; }
    if (formData.delivery_type === 'delivery' && !formData.delivery_address.trim()) {
      toast.error('Please enter your delivery address'); return;
    }

    setLoading(true);

    try {
      // Step 1: Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        toast.error('Failed to load payment gateway. Check your internet connection.');
        setLoading(false);
        return;
      }

      // Step 2: Create Razorpay payment order on backend
      // This does NOT create an order in our DB yet
      const totalPaise = Math.round(getCartTotal() * 100); // ₹ to paise
      let paymentOrderRes;
      try {
        paymentOrderRes = await paymentAPI.createOrder({
          amount: totalPaise,
          currency: 'INR',
          order_id: `temp_${Date.now()}` // temporary ID, real order created after payment
        });
      } catch (err) {
        const msg = err?.response?.data?.detail || err.message;
        toast.error(`Payment setup failed: ${msg}`);
        setLoading(false);
        return;
      }

      const { order_id: razorpayOrderId, amount, currency, key_id } = paymentOrderRes.data;

      if (!key_id) {
        toast.error('Razorpay key not configured. Check backend .env file.');
        setLoading(false);
        return;
      }

      // Step 3: Open Razorpay checkout popup
      const options = {
        key: key_id,
        amount,
        currency,
        name: 'Indian Spices Restaurant',
        description: 'Food Order Payment',
        order_id: razorpayOrderId,

        // Step 4: On payment SUCCESS
        handler: async function (response) {
          try {
            toast.loading('Confirming your order...');

            // 4a. Create order in DB ONLY after payment succeeds
            // Send ONLY fields defined in OrderCreate Pydantic model
            const items = cart.map(item => ({
              item_id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              subtotal: item.price * item.quantity
            }));

            const orderRes = await orderAPI.create({
              customer_name: formData.customer_name,
              customer_email: formData.customer_email,
              customer_phone: formData.customer_phone,
              delivery_type: formData.delivery_type,
              delivery_address: formData.delivery_address || null,
              special_instructions: formData.special_instructions || null,
              items,
              total_amount: getCartTotal(),
            });

            const { order_id: dbOrderId, order_number: orderNumber } = orderRes.data;

            // 4b. Verify payment signature with backend
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            toast.dismiss();
            toast.success('Payment successful! Your order has been placed. 🎉');
            clearCart();
            navigate('/order-success', {
              state: { orderNumber, orderId: dbOrderId }
            });

          } catch (err) {
            toast.dismiss();
            console.error('Post-payment error:', err?.response?.data || err);
            toast.error('Payment received but order confirmation failed. Please contact us with your payment ID: ' + response.razorpay_payment_id);
          }
        },

        // Step 5: On payment popup closed / failed
        modal: {
          ondismiss: function () {
            toast.error('Payment cancelled. Your order was not placed.');
            setLoading(false);
          }
        },

        prefill: {
          name: formData.customer_name,
          email: formData.customer_email,
          contact: formData.customer_phone
        },

        theme: { color: '#EA580C' }
      };

      const paymentObject = new window.Razorpay(options);

      // Handle payment failures (card declined etc.)
      paymentObject.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      paymentObject.open();

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
    // Note: setLoading(false) is handled by modal ondismiss / payment.failed
    // On success, we navigate away so no need to reset loading
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate('/')}>Go to Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery Details Form */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Full Name *</Label>
                  <Input
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_email">Email *</Label>
                  <Input
                    id="customer_email"
                    name="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_phone">Phone *</Label>
                  <Input
                    id="customer_phone"
                    name="customer_phone"
                    type="tel"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Delivery Type *</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="delivery_type"
                        value="pickup"
                        checked={formData.delivery_type === 'pickup'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Pickup
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="delivery_type"
                        value="delivery"
                        checked={formData.delivery_type === 'delivery'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Delivery
                    </label>
                  </div>
                </div>

                {formData.delivery_type === 'delivery' && (
                  <div className="space-y-2">
                    <Label htmlFor="delivery_address">Delivery Address *</Label>
                    <Textarea
                      id="delivery_address"
                      name="delivery_address"
                      value={formData.delivery_address}
                      onChange={handleChange}
                      placeholder="Enter your full delivery address"
                      required
                      rows={3}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="special_instructions">Special Instructions</Label>
                  <Textarea
                    id="special_instructions"
                    name="special_instructions"
                    value={formData.special_instructions}
                    onChange={handleChange}
                    placeholder="Any special requests? (optional)"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {loading ? 'Opening Payment...' : 'Proceed to Payment'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-orange-600">₹{getCartTotal().toFixed(2)}</span>
                </div>

                {/* Test mode info */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                  <p className="font-semibold mb-1">🧪 Test Mode — Use these card details:</p>
                  <p>Card: <strong>4111 1111 1111 1111</strong></p>
                  <p>Expiry: <strong>Any future date</strong></p>
                  <p>CVV: <strong>Any 3 digits</strong></p>
                  <p>OTP: <strong>1234</strong></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

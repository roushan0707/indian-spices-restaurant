import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, Home, FileText } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderNumber, orderId } = location.state || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-gray-600 mb-2">Your order number is:</p>
            <p className="text-3xl font-bold text-orange-600">{orderNumber || 'N/A'}</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg text-left">
            <p className="text-sm text-gray-700">
              <strong>What's next?</strong><br />
              We've received your order and payment. Our team will start preparing your delicious meal shortly.
              You'll receive updates via email and SMS.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            Thank you for choosing Indian Spices!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;

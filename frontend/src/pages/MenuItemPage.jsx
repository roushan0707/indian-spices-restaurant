import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Flame, Leaf, Plus, Minus, CheckCircle, XCircle } from 'lucide-react';
import { menuAPI } from '../api';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { FIXED_MENU_ITEMS } from '../menuData';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MenuItemPage = () => {
  const { fixedId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [item, setItem] = useState(location.state?.item || null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(!location.state?.item);
  const [imgLoaded, setImgLoaded] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!item) fetchItem();
    else setLoading(false);
    window.scrollTo(0, 0);
  }, [fixedId]);

  const fetchItem = async () => {
    try {
      const fixedData = FIXED_MENU_ITEMS.find(i => i.fixedId === fixedId);
      if (!fixedData) { navigate('/'); return; }

      // Try to get price/availability from backend
      const response = await menuAPI.getCategories();
      const backendCategories = response.data || [];
      let backendPrice = null;
      let backendAvailable = true;
      let backendId = fixedData.fixedId;

      backendCategories.forEach(cat => {
        (cat.items || []).forEach(bItem => {
          if (bItem.name.toLowerCase().trim() === fixedData.name.toLowerCase().trim()) {
            backendPrice = bItem.price;
            backendAvailable = bItem.available;
            backendId = bItem.id;
          }
        });
      });

      setItem({
        ...fixedData,
        id: backendId,
        price: backendPrice,
        available: backendAvailable,
      });
    } catch (err) {
      console.error('Error fetching item:', err);
      const fixedData = FIXED_MENU_ITEMS.find(i => i.fixedId === fixedId);
      if (fixedData) setItem({ ...fixedData, id: fixedId, price: null, available: true });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!item.available) { toast.error('This item is currently unavailable'); return; }
    if (item.price === null) { toast.error('Price not set — please contact restaurant'); return; }
    addToCart({ ...item, id: item.id || item.fixedId }, quantity);
    toast.success(`${quantity}× ${item.name} added to cart!`);
  };

  const spicyLabel = { None: 'Not Spicy', Low: 'Mildly Spicy', Medium: 'Medium Spicy', High: 'Very Spicy' };
  const spicyColor = { None: 'bg-gray-100 text-gray-600', Low: 'bg-yellow-100 text-yellow-700', Medium: 'bg-orange-100 text-orange-700', High: 'bg-red-100 text-red-700' };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dish details...</p>
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Header />

      <div className="container mx-auto px-4 pt-28 pb-20">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Menu</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* ── Left: Image ─────────────────────────────────────────────── */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              <img
                src={item.image}
                alt={item.name}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
              {/* Unavailable overlay */}
              {!item.available && (
                <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center rounded-3xl">
                  <span className="text-white font-bold text-2xl bg-gray-900/70 px-6 py-3 rounded-full">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>

            {/* Floating category badge */}
            <div className="absolute -bottom-4 left-6">
              <span className="bg-orange-600 text-white font-bold px-5 py-2 rounded-full shadow-lg text-sm">
                {item.category}
              </span>
            </div>
          </div>

          {/* ── Right: Details ──────────────────────────────────────────── */}
          <div className="pt-4 lg:pt-0">
            {/* Name */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {item.name}
            </h1>

            {/* Badges row */}
            <div className="flex flex-wrap gap-3 mb-6">
              {/* Available / Unavailable */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                item.available
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {item.available
                  ? <><CheckCircle className="h-4 w-4" /> Available</>
                  : <><XCircle className="h-4 w-4" /> Unavailable</>
                }
              </div>

              {/* Veg/Non-veg */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                item.is_vegetarian ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <Leaf className="h-4 w-4" />
                {item.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
              </div>

              {/* Spicy level */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${spicyColor[item.spicy] || spicyColor['None']}`}>
                <Flame className="h-4 w-4" />
                {spicyLabel[item.spicy] || 'Not Spicy'}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-8 border-l-4 border-orange-300 pl-4">
              {item.description}
            </p>

            {/* Price */}
            <div className="mb-8">
              {item.price !== null ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-orange-600">₹{item.price}</span>
                  <span className="text-gray-400 text-lg">per serving</span>
                </div>
              ) : (
                <p className="text-gray-400 text-lg italic">Price not set — contact restaurant</p>
              )}
            </div>

            {/* Quantity Selector */}
            {item.available && item.price !== null && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-11 h-11 rounded-full border-2 border-orange-300 flex items-center justify-center text-orange-600 hover:bg-orange-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(10, q + 1))}
                    className="w-11 h-11 rounded-full border-2 border-orange-300 flex items-center justify-center text-orange-600 hover:bg-orange-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="text-gray-500 ml-2">
                    = <strong className="text-gray-900">₹{(item.price * quantity).toFixed(0)}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!item.available || item.price === null}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6 rounded-xl shadow-lg shadow-orange-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingCart className="h-5 w-5 mr-3" />
              {!item.available
                ? 'Currently Unavailable'
                : item.price === null
                  ? 'Price Not Set'
                  : `Add ${quantity} to Cart — ₹${(item.price * quantity).toFixed(0)}`
              }
            </Button>

            {/* Back to full menu */}
            <button
              onClick={() => { navigate('/'); setTimeout(() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="mt-4 w-full text-center text-gray-500 hover:text-orange-600 transition-colors text-sm py-2"
            >
              ← See full menu
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MenuItemPage;

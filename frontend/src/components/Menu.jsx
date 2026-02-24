import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Leaf, ShoppingCart, ChevronRight } from 'lucide-react';
import { menuAPI } from '../api';
import { useCart } from '../context/CartContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { FIXED_MENU_ITEMS, FIXED_CATEGORIES } from '../menuData';

// Merge fixed items with backend prices + availability
const mergeWithBackend = (backendCategories) => {
  // Build a lookup: name (lowercase) → { price, available, id }
  const backendLookup = {};
  backendCategories.forEach(cat => {
    (cat.items || []).forEach(item => {
      backendLookup[item.name.toLowerCase().trim()] = {
        price: item.price,
        available: item.available,
        id: item.id,
      };
    });
  });

  return FIXED_MENU_ITEMS.map(fixedItem => {
    const backend = backendLookup[fixedItem.name.toLowerCase().trim()];
    return {
      ...fixedItem,
      id: backend?.id || fixedItem.fixedId,
      price: backend?.price ?? null,       // null = not set in admin yet
      available: backend?.available ?? true,
    };
  });
};

// Spicy flame indicator
const SpicyBadge = ({ spicy }) => {
  if (!spicy || spicy === 'None') return null;
  const count = spicy === 'Low' ? 1 : spicy === 'Medium' ? 2 : 3;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(count)].map((_, i) => (
        <Flame key={i} className="h-3 w-3 text-red-500 fill-red-500" />
      ))}
    </div>
  );
};

// Single menu card
const MenuCard = ({ item, onViewDetails, onAddToCart }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer ${
        !item.available ? 'opacity-70' : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onViewDetails(item)}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            hovered ? 'scale-110' : 'scale-100'
          }`}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.is_vegetarian && (
            <div className="bg-green-500 rounded-full p-1.5 shadow-lg">
              <Leaf className="h-3.5 w-3.5 text-white fill-white" />
            </div>
          )}
          {item.is_spicy && (
            <div className="bg-red-500 rounded-full p-1.5 shadow-lg">
              <Flame className="h-3.5 w-3.5 text-white fill-white" />
            </div>
          )}
        </div>

        {/* Unavailable overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-gray-900/70 px-4 py-2 rounded-full">
              Currently Unavailable
            </span>
          </div>
        )}

        {/* Price on image bottom */}
        <div className="absolute bottom-3 right-3">
          {item.price !== null ? (
            <span className="bg-orange-600 text-white font-bold text-lg px-3 py-1 rounded-full shadow-lg">
              ₹{item.price}
            </span>
          ) : (
            <span className="bg-gray-600 text-white text-sm px-3 py-1 rounded-full shadow-lg">
              Price TBD
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
            {item.name}
          </h4>
          <SpicyBadge spicy={item.spicy} />
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {item.description}
        </p>

        <div className="flex gap-2">
          <Button
            onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
            disabled={!item.available || item.price === null}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm py-2"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            Add to Cart
          </Button>
          <Button
            onClick={(e) => { e.stopPropagation(); onViewDetails(item); }}
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50 px-3"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Menu = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => { fetchMenu(); }, []);

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getCategories();
      const merged = mergeWithBackend(response.data || []);
      setMenuItems(merged);
    } catch (error) {
      console.error('Error fetching menu:', error);
      // Use fixed items with no prices if backend fails
      setMenuItems(FIXED_MENU_ITEMS.map(i => ({ ...i, id: i.fixedId, price: null, available: true })));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    if (!item.available) { toast.error('This item is currently unavailable'); return; }
    if (item.price === null) { toast.error('Price not set — contact restaurant'); return; }
    addToCart({ ...item, id: item.id || item.fixedId }, 1);
    toast.success(`${item.name} added to cart!`);
  };

  const handleViewDetails = (item) => {
    navigate(`/menu/${item.fixedId}`, { state: { item } });
  };

  const categories = ['All', ...FIXED_CATEGORIES];
  const displayed = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(i => i.category === activeCategory);

  // Group by category for "All" view
  const grouped = FIXED_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = menuItems.filter(i => i.category === cat);
    return acc;
  }, {});

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500">Loading our delicious menu...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="text-center mb-14">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200 text-sm px-4 py-1">
            Our Menu
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Our <span className="text-orange-600">Delicious</span> Menu
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Authentic Indian flavors crafted with love and the finest ingredients
          </p>
        </div>

        {/* Category Filter Tabs — only show Starters, Main Course, Desserts on home page */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {['All', 'Starters', 'Main Course', 'Desserts'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 scale-105'
                  : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-200 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid — All categories grouped */}
        {activeCategory === 'All' ? (
          <div className="space-y-16">
            {['Starters', 'Main Course', 'Desserts'].map(cat => (
              <div key={cat}>
                {/* Category heading */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-orange-200" />
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 px-4">
                    {cat === 'Starters' ? '🥗' : cat === 'Main Course' ? '🍛' : '🍮'} {cat}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-orange-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {grouped[cat].slice(0, 3).map(item => (
                    <MenuCard
                      key={item.fixedId}
                      item={item}
                      onViewDetails={handleViewDetails}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Single category view */
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-orange-200" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 px-4">
                {activeCategory === 'Starters' ? '🥗' : activeCategory === 'Main Course' ? '🍛' : activeCategory === 'Breads & Rice' ? '🍚' : activeCategory === 'Drinks' ? '🥤' : '🍮'} {activeCategory}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-orange-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayed.slice(0, 3).map(item => (
                <MenuCard
                  key={item.fixedId}
                  item={item}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
            {displayed.length > 3 && (
              <div className="text-center mt-8">
                <p className="text-gray-500 text-sm mb-3">
                  Showing 3 of {displayed.length} items in {activeCategory}
                </p>
                <p className="text-sm text-orange-600 font-medium">
                  Use the <strong>Menu</strong> in the header to browse all dishes →
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;

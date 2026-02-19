import React, { useState, useEffect } from 'react';
import { Flame, Leaf, ShoppingCart } from 'lucide-react';
import { menuAPI } from '../api';
import { useCart } from '../context/CartContext';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { toast } from 'sonner';

const Menu = () => {
  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getCategories();
      setMenuCategories(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Failed to load menu');
      // Fallback to mock data if API fails
      const { menuCategories: mockCategories } = await import('../mock');
      setMenuCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  const getSpicyIcon = (level) => {
    if (level === 'None') return null;
    const count = level === 'Low' ? 1 : level === 'Medium' ? 2 : 3;
    return (
      <div className="flex items-center">
        {[...Array(count)].map((_, i) => (
          <Flame key={i} className="h-3 w-3 text-red-500 fill-red-500" />
        ))}
      </div>
    );
  };

  const handleAddToCart = (item) => {
    if (!item.available) {
      toast.error('This item is currently unavailable');
      return;
    }
    addToCart(item, 1);
  };

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading menu...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
            Our Menu
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Delicious Menu
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Authentic Indian flavors crafted with love and the finest ingredients
          </p>
        </div>

        {/* Menu Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 md:grid-cols-5 mb-12 h-auto">
            <TabsTrigger value="all" className="text-sm md:text-base py-3">
              All Items
            </TabsTrigger>
            {menuCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-sm md:text-base py-3"
              >
                {category.name.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All Items */}
          <TabsContent value="all" className="space-y-12">
            {menuCategories.map((category) => (
              <div key={category.id}>
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item) => (
                    <Card
                      key={item.id}
                      className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 group ${
                        !item.available ? 'opacity-60' : ''
                      }`}
                    >
                      {item.image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {item.category === 'Vegetarian' && (
                            <div className="absolute top-3 right-3 bg-green-600 rounded-full p-2">
                              <Leaf className="h-4 w-4 text-white fill-white" />
                            </div>
                          )}
                          {!item.available && (
                            <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">Unavailable</span>
                            </div>
                          )}
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
                          <span className="text-lg font-bold text-orange-600">₹{item.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          {getSpicyIcon(item.spicy)}
                        </div>
                        <Button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.available}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Category-specific tabs */}
          {menuCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <Card
                    key={item.id}
                    className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 group ${
                      !item.available ? 'opacity-60' : ''
                    }`}
                  >
                    {item.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {item.category === 'Vegetarian' && (
                          <div className="absolute top-3 right-3 bg-green-600 rounded-full p-2">
                            <Leaf className="h-4 w-4 text-white fill-white" />
                          </div>
                        )}
                        {!item.available && (
                          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Unavailable</span>
                          </div>
                        )}
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
                        <span className="text-lg font-bold text-orange-600">₹{item.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                        {getSpicyIcon(item.spicy)}
                      </div>
                      <Button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.available}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Menu;

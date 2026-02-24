import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { menuAPI } from '../api';
import { FIXED_MENU_ITEMS, FIXED_CATEGORIES } from '../menuData';

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState(false);
  const [menuItems, setMenuItems] = useState(FIXED_MENU_ITEMS);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Always show all 26 FIXED_MENU_ITEMS in dropdown
  // Overlay price + availability from backend where available
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await menuAPI.getCategories();
        const backendCategories = response.data || [];

        // Build lookup: name → { price, available, id }
        const backendLookup = {};
        backendCategories.forEach(cat => {
          (cat.items || []).forEach(bItem => {
            backendLookup[bItem.name.toLowerCase().trim()] = {
              price: bItem.price,
              available: bItem.available,
              id: bItem.id,
            };
          });
        });

        // Always start from all 26 fixed items, just update price/availability
        const merged = FIXED_MENU_ITEMS.map(item => {
          const backend = backendLookup[item.name.toLowerCase().trim()];
          return {
            ...item,
            price: backend?.price ?? null,
            available: backend?.available ?? true,
            id: backend?.id || item.fixedId,
          };
        });

        setMenuItems(merged);
      } catch (err) {
        console.error('Header menu fetch error:', err);
        // On error still show all 26 items with no prices
        setMenuItems(FIXED_MENU_ITEMS.map(i => ({ ...i, price: null, available: true, id: i.fixedId })));
      }
    };
    fetchMenu();
  }, []);

  const scrollToSection = (id) => {
    // If not on home page, navigate home first then scroll
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
    setMenuOpen(false);
  };

  const handleDishClick = (item) => {
    navigate(`/menu/${item.fixedId}`, { state: { item } });
    setMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const categoryEmoji = { Starters: '🥗', 'Main Course': '🍛', Desserts: '🍮' };

  // Always show all 5 fixed categories in dropdown
  const allCategories = FIXED_CATEGORIES;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <button onClick={() => scrollToSection('home')} className="flex items-center space-x-2">
            <div className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent drop-shadow-sm">
              Indian Spices
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Home
            </button>

            {/* Menu dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Menu
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Panel */}
              {menuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col" style={{maxHeight: 'calc(100vh - 100px)'}}>
                  {/* Sticky Header */}
                  <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-3 rounded-t-2xl flex-shrink-0">
                    <p className="text-white font-bold text-base">Our Menu</p>
                    <p className="text-orange-100 text-xs">Click any dish to view details</p>
                  </div>

                  {/* Scrollable Categories */}
                  <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
                    {allCategories.map(cat => (
                      <div key={cat} className="p-4">
                        {/* Category title */}
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-orange-100">
                          <span className="text-base">{categoryEmoji[cat] || '🍽️'}</span>
                          <span className="font-bold text-gray-800 text-sm">{cat}</span>
                          <span className="text-xs text-gray-400 ml-auto">
                            {menuItems.filter(i => i.category === cat).length} items
                          </span>
                        </div>

                        {/* Dishes grid — 2 columns for compact view */}
                        <div className="grid grid-cols-2 gap-1">
                          {menuItems
                            .filter(item => item.category === cat)
                            .map(item => (
                              <button
                                key={item.fixedId}
                                onClick={() => handleDishClick(item)}
                                className="text-left group"
                              >
                                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-50 transition-colors">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors truncate">
                                      {item.name}
                                    </p>
                                    {item.price !== null ? (
                                      <p className="text-xs text-orange-500 font-semibold">₹{item.price}</p>
                                    ) : (
                                      <p className="text-xs text-gray-400">Price TBD</p>
                                    )}
                                  </div>
                                  {!item.available && (
                                    <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded-full ml-1 flex-shrink-0">
                                      ✗
                                    </span>
                                  )}
                                </div>
                              </button>
                            ))
                          }
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sticky Footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex-shrink-0">
                    <button
                      onClick={() => scrollToSection('menu')}
                      className="text-orange-600 font-semibold text-sm hover:underline"
                    >
                      View full menu with photos →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              About
            </button>
            <button onClick={() => scrollToSection('gallery')} className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Gallery
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Contact
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+919876543210" className="flex items-center text-gray-700 hover:text-orange-600 transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Call Now</span>
            </a>
            <Button onClick={() => scrollToSection('booking')} className="bg-orange-600 hover:bg-orange-700 text-white">
              Book Table
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-orange-600 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 max-h-[80vh] overflow-y-auto">
            <nav className="flex flex-col space-y-2">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-orange-600 font-medium text-left px-2 py-2">
                Home
              </button>

              {/* Mobile Menu accordion */}
              <div>
                <button
                  onClick={() => setMobileMenuExpanded(!mobileMenuExpanded)}
                  className="flex items-center justify-between w-full text-gray-700 hover:text-orange-600 font-medium text-left px-2 py-2"
                >
                  Menu
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileMenuExpanded ? 'rotate-180' : ''}`} />
                </button>

                {mobileMenuExpanded && (
                  <div className="ml-4 mt-2 space-y-4 pb-2">
                    {allCategories.map(cat => (
                      <div key={cat}>
                        <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                          {categoryEmoji[cat] || '🍽️'} {cat}
                        </p>
                        <div className="space-y-1">
                          {menuItems.filter(i => i.category === cat).map(item => (
                            <button
                              key={item.fixedId}
                              onClick={() => handleDishClick(item)}
                              className="flex items-center justify-between w-full text-left px-2 py-1.5 rounded-lg hover:bg-orange-50"
                            >
                              <span className="text-sm text-gray-700">{item.name}</span>
                              {item.price !== null && (
                                <span className="text-xs font-semibold text-orange-500">₹{item.price}</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-orange-600 font-medium text-left px-2 py-2">
                About
              </button>
              <button onClick={() => scrollToSection('gallery')} className="text-gray-700 hover:text-orange-600 font-medium text-left px-2 py-2">
                Gallery
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-orange-600 font-medium text-left px-2 py-2">
                Contact
              </button>
              <a href="tel:+919876543210" className="flex items-center text-gray-700 hover:text-orange-600 px-2 py-2">
                <Phone className="h-4 w-4 mr-2" />
                <span className="font-medium">Call Now</span>
              </a>
              <Button onClick={() => scrollToSection('booking')} className="bg-orange-600 hover:bg-orange-700 text-white w-full mt-2">
                Book Table
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
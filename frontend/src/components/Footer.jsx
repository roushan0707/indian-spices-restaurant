import React from 'react';
import { MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import { restaurantInfo } from '../mock';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      "Hi Indian Spices, I'd like to place an order/book a table near AIIMS."
    );
    window.open(`https://wa.me/${restaurantInfo.whatsapp}?text=${message}`, '_blank');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Indian Spices</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Authentic Indian cuisine near AIIMS Hospital, Patna. 
              Experience the warmth of traditional flavors.
            </p>
            <div className="flex items-center space-x-2 text-orange-400">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">Chiraura, Patna, Bihar</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('menu')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="hover:text-orange-400 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('gallery')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('booking')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Book Table
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <a
                  href={`tel:${restaurantInfo.phone}`}
                  className="hover:text-orange-400 transition-colors"
                >
                  {restaurantInfo.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <a
                  href={`mailto:${restaurantInfo.email}`}
                  className="hover:text-orange-400 transition-colors"
                >
                  {restaurantInfo.email}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <MessageCircle className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <button
                  onClick={handleWhatsAppOrder}
                  className="hover:text-orange-400 transition-colors"
                >
                  WhatsApp Order
                </button>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Opening Hours</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Monday - Sunday</span>
              </div>
              <div className="text-orange-400 font-semibold">
                {restaurantInfo.hours}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-sm text-gray-400">
                  We're open every day to serve you!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} Indian Spices. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <button className="text-gray-400 hover:text-orange-400 transition-colors">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-orange-400 transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <button
        onClick={handleWhatsAppOrder}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 group"
        aria-label="Order via WhatsApp"
      >
        <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Order via WhatsApp
        </span>
      </button>
    </footer>
  );
};

export default Footer;

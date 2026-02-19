import React from 'react';
import { MessageCircle, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { restaurantInfo } from '../mock';

const Hero = () => {
  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      "Hi Indian Spices, I'd like to place an order/book a table near AIIMS."
    );
    window.open(`https://wa.me/${restaurantInfo.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1547573854-74d2a71d0826"
          alt="Indian Spices Restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 mb-6">
            <MapPin className="h-4 w-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">Near AIIMS Hospital, Patna</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {restaurantInfo.tagline}
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            {restaurantInfo.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              onClick={handleWhatsAppOrder}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Order via WhatsApp
            </Button>
            <Button
              onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-6 backdrop-blur-sm transition-all duration-300"
            >
              View Menu
            </Button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 flex items-center space-x-3">
              <Clock className="h-6 w-6 text-orange-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-300">Opening Hours</p>
                <p className="text-white font-semibold">{restaurantInfo.hours}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-orange-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-300">Location</p>
                <p className="text-white font-semibold">Chiraura, Patna</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10"></div>
    </section>
  );
};

export default Hero;

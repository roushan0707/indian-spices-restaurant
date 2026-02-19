import React, { useState } from 'react';
import { gallery } from '../mock';
import { Badge } from './ui/badge';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(gallery.map((item) => item.category))];

  const filteredGallery =
    selectedCategory === 'all'
      ? gallery
      : gallery.filter((item) => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
            Gallery
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Visual Feast
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            A glimpse into our delicious offerings and warm ambiance
          </p>

          {/* Filter Buttons */}
          <div className="flex justify-center flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-orange-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-square"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6 w-full">
                  <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                  <Badge className="bg-orange-600 text-white">
                    {item.category}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;

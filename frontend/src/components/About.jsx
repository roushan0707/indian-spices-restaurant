import React from 'react';
import { Award, Users, ChefHat, Heart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { restaurantInfo } from '../mock';

const About = () => {
  const features = [
    {
      icon: <ChefHat className="h-8 w-8 text-orange-600" />,
      title: 'Expert Chefs',
      description: 'Our experienced chefs bring authentic flavors from across India'
    },
    {
      icon: <Heart className="h-8 w-8 text-orange-600" />,
      title: 'Fresh Ingredients',
      description: 'We use only the freshest, locally-sourced ingredients daily'
    },
    {
      icon: <Award className="h-8 w-8 text-orange-600" />,
      title: 'Quality Service',
      description: 'Committed to providing exceptional dining experience'
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: 'Family Friendly',
      description: 'Welcoming atmosphere perfect for families and groups'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/29106106/pexels-photo-29106106.jpeg"
                alt="Restaurant ambiance"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-orange-600 text-white p-6 rounded-xl shadow-xl">
              <div className="text-4xl font-bold mb-1">5+</div>
              <div className="text-sm">Years of Excellence</div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              About Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Where Tradition Meets Taste
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Welcome to <span className="font-semibold text-orange-600">{restaurantInfo.name}</span>, 
              your destination for authentic Indian cuisine in the heart of Chiraura, Patna. 
              Conveniently located near AIIMS Hospital, we serve traditional dishes prepared 
              with love and the finest ingredients.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our chefs bring years of culinary expertise, crafting each dish to perfection. 
              From aromatic biryanis to rich curries and freshly baked breads, every meal 
              is a celebration of Indian flavors that feels just like home.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

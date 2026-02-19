import React from 'react';
import { Star } from 'lucide-react';
import { testimonials } from '../mock';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';

const Testimonials = () => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our valued customers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              <CardContent className="p-6">
                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 bg-orange-600 text-white">
                    <AvatarFallback className="bg-orange-600 text-white font-semibold">
                      {getInitials(testimonial.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

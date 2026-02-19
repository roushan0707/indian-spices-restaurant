import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { restaurantInfo } from '../mock';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const Contact = () => {
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      "Hi Indian Spices, I have a query regarding your restaurant."
    );
    window.open(`https://wa.me/${restaurantInfo.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Visit Us Today
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Come experience authentic Indian flavors near AIIMS Hospital, Patna
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information Cards */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600">{restaurantInfo.address}</p>
                  <p className="text-sm text-orange-600 mt-2">Near AIIMS Hospital</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Phone</h3>
                  <a
                    href={`tel:${restaurantInfo.phone}`}
                    className="text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {restaurantInfo.phone}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Email</h3>
                  <a
                    href={`mailto:${restaurantInfo.email}`}
                    className="text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {restaurantInfo.email}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Opening Hours</h3>
                  <p className="text-gray-600">{restaurantInfo.hours}</p>
                  <p className="text-sm text-gray-500 mt-1">Open 7 days a week</p>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleWhatsAppContact}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Chat on WhatsApp
            </Button>
          </div>

          {/* Google Maps */}
          <div className="h-full min-h-[500px]">
            <Card className="h-full border-none shadow-lg overflow-hidden">
              <CardContent className="p-0 h-full">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.753!2d${restaurantInfo.coordinates.lng}!3d${restaurantInfo.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDM2JzMzLjUiTiA4NcKwMDgnMTUuNCJF!5e0!3m2!1sen!2sin!4v1234567890`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '500px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Indian Spices Location"
                  className="rounded-lg"
                ></iframe>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

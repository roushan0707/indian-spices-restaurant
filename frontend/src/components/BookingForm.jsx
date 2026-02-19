import React, { useState } from 'react';
import { Calendar, Clock, Users, User, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequest: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mock booking submission - this will be connected to backend later
    console.log('Booking submitted:', formData);
    
    toast.success('Booking request submitted successfully! We will confirm shortly.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: '2',
      specialRequest: ''
    });
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="booking" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Reservations
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Book Your Table
            </h2>
            <p className="text-lg text-gray-600">
              Reserve your spot at Indian Spices for an unforgettable dining experience
            </p>
          </div>

          {/* Booking Form Card */}
          <Card className="shadow-xl border-none">
            <CardHeader>
              <CardTitle className="text-2xl">Make a Reservation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>

                {/* Date, Time, and Guests Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      Date *
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      min={today}
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      Time *
                    </Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guests" className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      Guests *
                    </Label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      required
                      className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <Label htmlFor="specialRequest">
                    Special Requests (Optional)
                  </Label>
                  <Textarea
                    id="specialRequest"
                    name="specialRequest"
                    placeholder="Any dietary restrictions, preferences, or special occasions..."
                    value={formData.specialRequest}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6"
                >
                  Reserve Table
                </Button>
              </form>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-700 text-center">
                  <strong>Note:</strong> Reservations are subject to availability. 
                  We will confirm your booking within 2 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;

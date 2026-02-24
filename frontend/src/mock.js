// Mock data structure for Indian Spices Restaurant
// This structure mirrors what the backend will provide

export const restaurantInfo = {
  name: "Indian Spices",
  tagline: "Authentic Flavors, Taste The Best",
  description: "Located conveniently near AIIMS Patna, serving fresh, aromatic Indian cuisine that feels like home.",
  address: "Chiraura, near AIIMS Hospital, Patna, Bihar",
  phone: "+91 7970898670",
  whatsapp: "+917970898670",
  email: "contact@indianspices.com",
  hours: "08:00 AM – 11:00 PM",
  coordinates: {
    lat: 25.6093,
    lng: 85.1376
  }
};

export const menuCategories = [
  {
    id: "1",
    name: "Starters & Tandoori Specialties",
    description: "Begin your culinary journey",
    items: [
      {
        id: "101",
        name: "Paneer Tikka",
        description: "Cottage cheese marinated in spices and grilled to perfection",
        price: 220,
        image: "https://images.pexels.com/photos/3928854/pexels-photo-3928854.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        category: "Vegetarian",
        spicy: "Medium",
        available: true
      },
      {
        id: "102",
        name: "Tandoori Chicken",
        description: "Classic tandoori chicken with authentic spices",
        price: 280,
        image: "https://images.unsplash.com/photo-1705359573325-f2006d5e459f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHw0fHx0YW5kb29yaXxlbnwwfHx8fDE3NzE1MTUxNDN8MA&ixlib=rb-4.1.0&q=85",
        category: "Non-Vegetarian",
        spicy: "High",
        available: true
      },
      {
        id: "103",
        name: "Samosa Platter",
        description: "Crispy samosas served with mint and tamarind chutney",
        price: 120,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBmb29kfGVufDB8fHx8MTc3MTUxNTExM3ww&ixlib=rb-4.1.0&q=85",
        category: "Vegetarian",
        spicy: "Low",
        available: true
      }
    ]
  },
  {
    id: "2",
    name: "Main Course",
    description: "Signature curries and delicacies",
    items: [
      {
        id: "201",
        name: "Paneer Butter Masala",
        description: "Rich and creamy tomato-based curry with cottage cheese",
        price: 260,
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwxfHxwYW5lZXJ8ZW58MHx8fHwxNzcxNTE1MTUyfDA&ixlib=rb-4.1.0&q=85",
        category: "Vegetarian",
        spicy: "Medium",
        available: true
      },
      {
        id: "202",
        name: "Chicken Biryani",
        description: "Fragrant basmati rice layered with tender chicken and aromatic spices",
        price: 320,
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pfGVufDB8fHx8MTc3MTUxNTEyMHww&ixlib=rb-4.1.0&q=85",
        category: "Non-Vegetarian",
        spicy: "Medium",
        available: true
      },
      {
        id: "203",
        name: "Mutton Handi",
        description: "Slow-cooked mutton in traditional handi with rich gravy",
        price: 380,
        image: "https://images.unsplash.com/photo-1567529854338-fc097b962123?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxjdXJyeXxlbnwwfHx8fDE3NzE1MTUxMTd8MA&ixlib=rb-4.1.0&q=85",
        category: "Non-Vegetarian",
        spicy: "High",
        available: true
      },
      {
        id: "204",
        name: "Dal Tadka",
        description: "Yellow lentils tempered with cumin, garlic and aromatic spices",
        price: 180,
        image: "https://images.pexels.com/photos/35267290/pexels-photo-35267290.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        category: "Vegetarian",
        spicy: "Low",
        available: true
      },
      {
        id: "205",
        name: "Mix Veg Curry",
        description: "Assorted vegetables in traditional Indian curry",
        price: 220,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmb29kfGVufDB8fHx8MTc3MTUxNTExM3ww&ixlib=rb-4.1.0&q=85",
        category: "Vegetarian",
        spicy: "Medium",
        available: true
      }
    ]
  },
  {
    id: "3",
    name: "Breads",
    description: "Freshly baked in tandoor",
    items: [
      {
        id: "301",
        name: "Butter Naan",
        description: "Soft leavened bread brushed with butter",
        price: 50,
        image: "https://images.unsplash.com/photo-1640625314547-aee9a7696589?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxuYWFufGVufDB8fHx8MTc3MTUxNTE0OHww&ixlib=rb-4.1.0&q=85",
        category: "Vegetarian",
        spicy: "None",
        available: true
      },
      {
        id: "302",
        name: "Garlic Naan",
        description: "Naan topped with fresh garlic and coriander",
        price: 60,
        image: "https://images.unsplash.com/photo-1640625314547-aee9a7696589?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxuYWFufGVufDB8fHx8MTc3MTUxNTE0OHww&ixlib=rb-4.1.0&q=85",
        category: "Vegetarian",
        spicy: "None",
        available: true
      },
      {
        id: "303",
        name: "Tandoori Roti",
        description: "Whole wheat bread baked in clay oven",
        price: 30,
        image: "https://images.unsplash.com/photo-1640625314547-aee9a7696589?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxuYWFufGVufDB8fHx8MTc3MTUxNTE0OHww&ixlib=rb-4.1.0&q=85",
        category: "Vegetarian",
        spicy: "None",
        available: true
      }
    ]
  },
  {
    id: "4",
    name: "Beverages",
    description: "Refresh yourself",
    items: [
      {
        id: "401",
        name: "Lassi",
        description: "Traditional yogurt-based drink (Sweet/Salted)",
        price: 70,
        category: "Beverage",
        spicy: "None",
        available: true
      },
      {
        id: "402",
        name: "Masala Chai",
        description: "Spiced Indian tea",
        price: 40,
        category: "Beverage",
        spicy: "None",
        available: true
      }
    ]
  }
];

export const testimonials = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    role: "AIIMS Doctor",
    rating: 5,
    comment: "Best Indian food near AIIMS! The biryani is absolutely delicious. Perfect place for a quick lunch break.",
    date: "2024-12-10"
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "Local Resident",
    rating: 5,
    comment: "Authentic taste and generous portions. The paneer butter masala reminds me of home-cooked food!",
    date: "2024-12-08"
  },
  {
    id: "3",
    name: "Amit Singh",
    role: "Food Blogger",
    rating: 4,
    comment: "Great ambiance and excellent service. The tandoori items are exceptional. Highly recommended!",
    date: "2024-12-05"
  }
];

export const gallery = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1547573854-74d2a71d0826",
    title: "Traditional Indian Feast",
    category: "Food"
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pfGVufDB8fHx8MTc3MTUxNTEyMHww&ixlib=rb-4.1.0&q=85",
    title: "Signature Biryani",
    category: "Food"
  },
  {
    id: "3",
    image: "https://images.pexels.com/photos/3928854/pexels-photo-3928854.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    title: "Paneer Tikka",
    category: "Food"
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1705359573325-f2006d5e459f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHw0fHx0YW5kb29yaXxlbnwwfHx8fDE3NzE1MTUxNDN8MA&ixlib=rb-4.1.0&q=85",
    title: "Tandoori Specialties",
    category: "Food"
  },
  {
    id: "5",
    image: "https://images.pexels.com/photos/29106106/pexels-photo-29106106.jpeg",
    title: "Elegant Dining Experience",
    category: "Ambiance"
  },
  {
    id: "6",
    image: "https://images.pexels.com/photos/33947401/pexels-photo-33947401.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    title: "Traditional Preparations",
    category: "Food"
  }
];

export const specialOffers = [
  {
    id: "1",
    title: "Lunch Special",
    description: "Get 20% off on all orders between 12 PM - 3 PM",
    validUntil: "2025-01-31",
    active: true
  },
  {
    id: "2",
    title: "Family Pack",
    description: "Order for 4+ people and get complimentary dessert",
    validUntil: "2025-01-31",
    active: true
  }
];

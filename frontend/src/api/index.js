import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Restaurant API
export const restaurantAPI = {
  getInfo: () => api.get('/restaurant/info'),
  updateInfo: (info) => api.put('/restaurant/info', info),
};

// Menu API
export const menuAPI = {
  getCategories: () => api.get('/menu/categories'),
  createCategory: (category) => api.post('/menu/category', category),
  createItem: (item, categoryId) => api.post(`/menu/item?category_id=${categoryId}`, item),
  updateItem: (itemId, item) => api.put(`/menu/item/${itemId}`, item),
  deleteItem: (itemId) => api.delete(`/menu/item/${itemId}`),
};

// Order API
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: () => api.get('/orders'),
  getById: (orderId) => api.get(`/orders/${orderId}`),
  updateStatus: (orderId, status) => api.put(`/orders/${orderId}/status?status=${status}`),
};

// Booking API
export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getAll: () => api.get('/bookings'),
  updateStatus: (bookingId, status) => api.put(`/bookings/${bookingId}/status?status=${status}`),
};

// Testimonial API
export const testimonialAPI = {
  getAll: () => api.get('/testimonials'),
  create: (testimonialData) => api.post('/testimonials', testimonialData),
  getPending: () => api.get('/testimonials/pending'),
  approve: (testimonialId) => api.put(`/testimonials/${testimonialId}/approve`),
};

// Gallery API
export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  add: (image) => api.post('/gallery', image),
  delete: (imageId) => api.delete(`/gallery/${imageId}`),
};

// Special Offers API
export const offersAPI = {
  getAll: () => api.get('/offers'),
  create: (offer) => api.post('/offers', offer),
  update: (offerId, offer) => api.put(`/offers/${offerId}`, offer),
};

// Payment API
export const paymentAPI = {
  createOrder: (paymentData) => api.post('/payment/create-order', paymentData),
  verifyPayment: (verificationData) => api.post('/payment/verify', verificationData),
};

export default api;

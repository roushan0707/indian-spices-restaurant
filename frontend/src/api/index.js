import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(
    `[API] ${config.method?.toUpperCase()} ${config.url}`,
    config.params ? `| params: ${JSON.stringify(config.params)}` : '',
    config.data ? `| body: ${JSON.stringify(config.data)}` : ''
  );
  return config;
});

// Log responses and errors
api.interceptors.response.use(
  (response) => {
    console.log(`[API] ✅ ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(
      `[API] ❌ ${error.response?.status} ${error.config?.url}`,
      '| body:', error.response?.data
    );
    return Promise.reject(error);
  }
);

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

  // Backend route: POST /menu/item?category_id=<str>
  // `category_id` is a FastAPI Query param — must be in URL, NOT in body.
  // Body must only contain MenuItem model fields:
  //   name, description, price, available, is_vegetarian, is_spicy
  createItem: (item, categoryId) => {
    // Strip category_id from body — FastAPI will reject unknown body fields
    const { category_id, ...bodyFields } = item;
    return api.post('/menu/item', bodyFields, {
      params: { category_id: categoryId },
    });
  },

  updateItem: (itemId, item) => {
    // Also strip category_id from update body
    const { category_id, ...bodyFields } = item;
    return api.put(`/menu/item/${itemId}`, bodyFields);
  },

  deleteItem: (itemId) => api.delete(`/menu/item/${itemId}`),
};

// Order API
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: () => api.get('/orders'),
  getById: (orderId) => api.get(`/orders/${orderId}`),
  updateStatus: (orderId, status) =>
    api.put(`/orders/${orderId}/status`, null, { params: { status } }),
};

// Booking API
export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getAll: () => api.get('/bookings'),
  updateStatus: (bookingId, status) =>
    api.put(`/bookings/${bookingId}/status`, null, { params: { status } }),
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
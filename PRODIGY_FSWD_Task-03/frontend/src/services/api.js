import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Cart (frontend only, handled via context, but stub for compatibility)
export const addToCart = (product) => {
  // This should be handled by CartContext, but provided for compatibility
  // Could dispatch to context or localStorage if needed
};

// Products
export const getProducts = async (filters = {}) => {
  const params = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params[key] = value;
  });
  const { data } = await api.get('/products', { params });
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const createProduct = async (product) => {
  let config = {};
  if (product instanceof FormData) {
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }
  const { data } = await api.post('/products', product, config);
  return data;
};

export const updateProduct = async (id, product) => {
  let config = {};
  if (product instanceof FormData) {
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }
  const { data } = await api.put(`/products/${id}`, product, config);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// Orders
export const createOrder = async (order) => {
  const { data } = await api.post('/orders', order);
  return data;
};

export const getOrders = async () => {
  const { data } = await api.get('/orders');
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}`, status);
  return data;
};

// Reviews
export const createReview = async (review) => {
  const { data } = await api.post('/reviews', review);
  return data;
};

export const getReviewsByProduct = async (productId) => {
  const { data } = await api.get(`/reviews/product/${productId}`);
  return data;
};

export const deleteReview = async (id) => {
  const { data } = await api.delete(`/reviews/${id}`);
  return data;
};

// Support
export const createSupportTicket = async (ticket) => {
  const { data } = await api.post('/support', ticket);
  return data;
};

export const getSupportTickets = async () => {
  const { data } = await api.get('/support');
  return data;
};

export const respondSupportTicket = async (id, response) => {
  const { data } = await api.put(`/support/${id}/respond`, response);
  return data;
};

// Admin Users
export const getUsers = async () => {
  const { data } = await api.get('/admin/users');
  return data;
};

export const updateUserRole = async (id, role) => {
  const { data } = await api.put(`/admin/users/${id}/role`, role);
  return data;
};

export const banUser = async (id) => {
  const { data } = await api.put(`/admin/users/${id}/ban`);
  return data;
};

// Admin Analytics
export const getAdminAnalytics = async () => {
  const { data } = await api.get('/analytics/admin');
  return data;
};

// Admin Notifications
export const getAdminNotifications = async () => {
  const { data } = await api.get('/notifications');
  return data;
};

export const markNotificationRead = async (id) => {
  const { data } = await api.put(`/notifications/${id}/read`);
  return data;
};

export default api;

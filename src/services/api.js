import axios from 'axios';
import { mockServer } from './mockServer';

// Base API URL configurable via environment variable VITE_API_BASE_URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// By default, if VITE_USE_MOCK_API is not explicitly set to 'false', enable mock engine
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Bearer Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('staffpulse_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global 401 Unauthorized / errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('staffpulse_auth_token');
      localStorage.removeItem('staffpulse_auth_user');
      // If we are not already on the login page, trigger navigation
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export { USE_MOCK_API };
export default api;

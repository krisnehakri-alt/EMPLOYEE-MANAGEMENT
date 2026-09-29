import api, { USE_MOCK_API } from './api';
import { mockServer } from './mockServer';

const TOKEN_KEY = 'staffpulse_auth_token';
const USER_KEY = 'staffpulse_auth_user';

export const authService = {
  /**
   * Log in user with email and password
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ token: string, user: object }>}
   */
  login: async (credentials) => {
    if (USE_MOCK_API) {
      const response = await mockServer.login(credentials);
      const { token, user } = response.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return response.data;
    }

    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      if (token) localStorage.setItem(TOKEN_KEY, token);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      return response.data;
    } catch (error) {
      // If network error and backend is offline, inform user clearly
      throw error;
    }
  },

  /**
   * Log out user and clear stored authentication data
   */
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get JWT auth token
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get logged-in user profile
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Failed to parse stored user:', e);
      return null;
    }
  },

  /**
   * Update stored user profile in local storage
   */
  updateCurrentUser: (userData) => {
    const current = authService.getCurrentUser() || {};
    const updated = { ...current, ...userData };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    return updated;
  },
};

import axios from 'axios';

const API_URL = 'http://localhost:5000';

/**
 * Send Google token to backend for verification and login
 * @param {string} token - Google authentication token
 * @returns {Promise} - Response from the server
 */
const googleLogin = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/auth/google`, { token }, { withCredentials: true });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Log the user out
 * @returns {Promise} - Response from the server
 */
const logout = async () => {
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

/**
 * Get the current user from local storage
 * @returns {Object|null} - User object or null if not logged in
 */
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
const isAuthenticated = () => {
  return !!localStorage.getItem('user');
};

/**
 * Get the current user from the server
 * @returns {Promise} - Response from the server
 */
const fetchCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/user`, { withCredentials: true });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    // If unauthorized, clear local storage
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
    }
    throw error;
  }
};

const authService = {
  googleLogin,
  logout,
  getCurrentUser,
  isAuthenticated,
  fetchCurrentUser
};

export default authService; 
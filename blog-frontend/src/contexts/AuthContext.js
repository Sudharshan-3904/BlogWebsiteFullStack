import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);

    // Verify the user's session with the server
    const verifyUser = async () => {
      try {
        setLoading(true);
        const userData = await authService.fetchCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error verifying user session:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      verifyUser();
    }
  }, []);

  const login = async (token) => {
    try {
      setLoading(true);
      const user = await authService.googleLogin(token);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; 
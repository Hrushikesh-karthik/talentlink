import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// 1. Create the context
export const AppContext = createContext();

// 2. Create the provider 
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      console.log('Attempting to register with data:', userData);
      
      const response = await authAPI.register(userData);
      console.log('Registration response:', response);
      
      if (response.data && response.data.access_token) {
        const { access_token, user: userData } = response.data;
        localStorage.setItem('token', access_token);
        setUser(userData);
        console.log('Registration successful, user:', userData);
        return { success: true, user: userData };
      }
      
      console.warn('Unexpected response format:', response);
      return { 
        success: false, 
        error: response.data?.message || 'Registration successful but incomplete response' 
      };
      
    } catch (err) {
      console.error('Registration error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data
        }
      });
      
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error || 
                      'Registration failed. Please check your connection and try again.';
      
      setError(errorMsg);
      return { 
        success: false, 
        error: errorMsg,
        status: err.response?.status
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // --- Value to be "provided" to all components ---
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AppContext.Provider value={value}>
      {!loading && children}
    </AppContext.Provider>
  );
}
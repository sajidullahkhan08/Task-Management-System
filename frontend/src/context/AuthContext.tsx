import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  clearError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/api/users`, {
        name,
        email,
        password,
      });

      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Registration failed'
      );
      setIsAuthenticated(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Invalid credentials'
      );
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
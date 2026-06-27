'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance, { setOnUnauthorized } from '../services/api/axiosInstance';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    setUser(null);
    setToken(null);
    setIsLoading(false);
    router.push('/login');
  };

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('crm_token', newToken);
    localStorage.setItem('crm_user', JSON.stringify(newUser));
    setUser(newUser);
    setToken(newToken);
    router.push('/');
  };

  useEffect(() => {
    setOnUnauthorized(logout);

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('crm_token');
      const storedUser = localStorage.getItem('crm_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          const response = await axiosInstance.get('/auth/me');
          if (response.data && response.data.success) {
            const updatedUser = response.data.data;
            setUser(updatedUser);
            localStorage.setItem('crm_user', JSON.stringify(updatedUser));
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

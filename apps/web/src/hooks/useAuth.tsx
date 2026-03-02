'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { authApi } from '@agri-scan/shared'; 

// Giả định bạn đã định nghĩa các Interface này trong packages/shared/src/types
import type { IUserResponse, IUserLogin, IUserCreate } from '@agri-scan/shared';

interface AuthContextType {
  user: IUserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: IUserLogin) => Promise<void>;
  register: (userData: IUserCreate) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm tự động gọi lên Backend để lấy thông tin User thông qua Token đang có
  const refreshUser = useCallback(async () => {
    try {
      if (localStorage.getItem('accessToken')) {
        // Sử dụng authApi từ gói shared
        const response = await authApi.getProfile(); 
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Lỗi lấy thông tin user:', error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };
    initAuth();
  }, [refreshUser]);

  const login = useCallback(async (credentials: IUserLogin) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      
      // Lưu lại Token vào LocalStorage (Bắt buộc phải làm ở Web)
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: IUserCreate) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(userData);
      
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('Backend báo lỗi hoặc token đã chết trước khi gọi logout', error);
    } finally {
      // Bất chấp Backend nói gì, Frontend phải dọn sạch nhà cửa
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth bắt buộc phải được bọc bên trong AuthProvider');
  }
  return context;
}
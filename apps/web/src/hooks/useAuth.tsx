"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { authApi, tokenStorage } from "@/lib/api-client";
import type { IAuthResponse } from "@agri-scan/shared";

// Simple User interface matching backend response
interface User {
  id: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for persisted user session and get profile if token exists
    const checkAuthSession = async () => {
      const accessToken = tokenStorage.getAccessToken();
      if (accessToken) {
        try {
          const userData = await authApi.getProfile();
          const userWithAvatar: User = {
            id: userData.id,
            email: userData.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.email)}&background=random`,
          };
          setUser(userWithAvatar);
        } catch (error) {
          console.error("Failed to get user profile:", error);
          tokenStorage.clearTokens();
        }
      }
      setIsLoading(false);
    };

    checkAuthSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Call real login API
      const authResponse: IAuthResponse = await authApi.login({
        email,
        password,
      });

      // Validate response structure
      if (!authResponse || !authResponse.user) {
        throw new Error("Invalid response format from server");
      }

      const { user, accessToken, refreshToken } = authResponse;

      // Validate user object
      if (!user.id || !user.email) {
        throw new Error("Invalid user data from server");
      }

      // Save tokens
      tokenStorage.saveTokens(accessToken, refreshToken || "");

      // Set user with avatar - use email for avatar name
      const userWithAvatar: User = {
        id: user.id,
        email: user.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=random`,
      };
      setUser(userWithAvatar);
    } catch (error: any) {
      console.error("Login failed:", error);

      // Handle different error types
      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      setIsLoading(true);
      setError(null);
      try {
        // Call real register API
        await authApi.register({ email, password, fullName });
        // Registration complete - user needs to login manually
      } catch (error: any) {
        console.error("Registration failed:", error);
        setError(
          error.response?.data?.message ||
            "Đăng ký thất bại. Vui lòng thử lại.",
        );
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      setUser(null);
      tokenStorage.clearTokens();
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth bắt buộc phải được bọc bên trong AuthProvider");
  }
  return context;
}

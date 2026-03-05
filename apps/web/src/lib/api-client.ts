/**
 * API Client for Web App
 * Configures shared packages to work with browser localStorage
 */

import { setTokenStorage, axiosClient, authApi } from '@agri-scan/shared';

// Token storage implementation for web (localStorage)
const webTokenStorage = {
  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },

  saveTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },

  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

// Configure token storage for shared package
setTokenStorage(webTokenStorage);

// Re-export for easy access
export { axiosClient, authApi };
export const tokenStorage = webTokenStorage;
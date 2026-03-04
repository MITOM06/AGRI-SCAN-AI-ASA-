export interface ITokenStorage {
  getAccessToken: () => Promise<string | null> | string | null;
  getRefreshToken: () => Promise<string | null> | string | null;
  saveTokens: (access: string, refresh: string) => Promise<void> | void;
  clearTokens: () => Promise<void> | void;
}

// Biến lưu trữ cấu hình do Web/Mobile truyền vào
let tokenStorage: ITokenStorage | null = null;

export const setTokenStorage = (storage: ITokenStorage) => {
  tokenStorage = storage;
};

export const getTokenStorage = () => {
  if (!tokenStorage) {
    console.warn('⚠️ TokenStorage chưa được cấu hình. Hãy gọi setTokenStorage() ở file khởi tạo App.');
  }
  return tokenStorage;
};
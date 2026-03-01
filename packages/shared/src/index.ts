/**
 * @agri-scan/shared - Thư viện dùng chung cho Web và Mobile
 * 
 * Export tất cả types, constants và utilities
 */

// Types
export * from './types';

// Constants
export * from './constants';

// Utilities
export * from './utils';

// Legacy export (để không break code cũ)
export const helloWorld = () => {
  return "Hello from Shared Logic!";
};
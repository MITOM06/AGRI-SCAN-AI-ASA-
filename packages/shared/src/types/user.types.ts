export enum UserRole {
  FARMER = 'FARMER',
  EXPERT = 'EXPERT',
  ADMIN = 'ADMIN',
}

// 🔥 THÊM MỚI: Enum Gói cước
export enum SubscriptionPlan {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  VIP = 'VIP',
}

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  plan: SubscriptionPlan; // 🔥 THÊM MỚI
  planExpiresAt: Date | null; // 🔥 THÊM MỚI
  dailyImageCount: number; // 🔥 THÊM MỚI
  dailyPromptCount: number; // 🔥 THÊM MỚI
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  plan: SubscriptionPlan; // Bắn gói cước về cho Frontend
}

export interface IAuthResponse {
  user: IUserResponse;
  accessToken: string;
  refreshToken?: string;
}
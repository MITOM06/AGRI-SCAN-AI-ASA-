/**
 * User Types - Dùng chung cho Web và Mobile
 * Khớp với Collection: users trong MongoDB
 */

export enum UserRole {
  FARMER = 'FARMER',
  EXPERT = 'EXPERT',
  ADMIN = 'ADMIN',
}

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
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
}

export interface IAuthResponse {
  user: IUserResponse;
  accessToken: string;
  refreshToken?: string;
}

import type { Request } from 'express';

/** Dữ liệu người dùng gắn vào request sau khi JwtStrategy.validate() chạy. */
export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

/** Payload được ký trong JWT (auth.service.signTokens). */
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

/** Request đã qua JwtAuthGuard — `req.user` được đảm bảo tồn tại và có kiểu. */
export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

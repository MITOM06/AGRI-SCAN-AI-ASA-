import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Cấp phát & lưu trữ access/refresh token.
 * Là nơi duy nhất biết cấu trúc khoá cache `refresh_token:<userId>`.
 */
@Injectable()
export class AuthTokenService {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async generateTokens(
    userId: string,
    email: string,
    fullName?: string,
    plan?: string,
    isPasswordSet?: boolean,
    role?: string,
  ) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.cacheManager.set(
      this.refreshTokenKey(userId),
      refreshToken,
      REFRESH_TOKEN_TTL_MS,
    );

    return {
      user: { id: userId, email, fullName, plan, isPasswordSet, role },
      accessToken,
      refreshToken,
    };
  }

  /** Refresh token đang được lưu cho user (undefined/null nếu đã đăng xuất). */
  async getStoredRefreshToken(userId: string) {
    return this.cacheManager.get(this.refreshTokenKey(userId));
  }

  /** Thu hồi refresh token (dùng khi đăng xuất). */
  async revokeRefreshToken(userId: string) {
    await this.cacheManager.del(this.refreshTokenKey(userId));
  }

  private refreshTokenKey(userId: string): string {
    return `refresh_token:${userId}`;
  }
}

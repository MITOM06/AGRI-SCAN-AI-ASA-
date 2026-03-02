import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Gọi Redis
  ) { }

  // 1. ĐĂNG KÝ
  async register(data: any) {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) throw new BadRequestException('Email này đã được sử dụng!');

    // Băm mật khẩu (SaltRounds = 10)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });

    return this.generateTokens(newUser._id.toString(), newUser.email);
  }

  // 2. ĐĂNG NHẬP
  async login(data: any) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('Sai email hoặc mật khẩu!');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Sai email hoặc mật khẩu!');

    return this.generateTokens(user._id.toString(), user.email);
  }

 // 3. ĐĂNG XUẤT
  async logout(userId: string) {
    const tokenKey = `refresh_token:${userId}`;
  
    const existingToken = await this.cacheManager.get(tokenKey);

    if (!existingToken) {
      throw new BadRequestException('Bạn đã đăng xuất trước đó rồi!');
    }

    await this.cacheManager.del(tokenKey);
    return { message: 'Đăng xuất thành công!' };
  }

  // HÀM TIỆN ÍCH: TẠO TOKEN & LƯU REDIS
  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    // Access Token (sống 15 phút, dùng để gọi API liên tục)
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Refresh Token (sống 7 ngày, dùng để xin lại Access Token mới)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Lưu Refresh Token vào Redis (Thời gian tính bằng mili-giây: 7 ngày)
    await this.cacheManager.set(`refresh_token:${userId}`, refreshToken, 7 * 24 * 60 * 60 * 1000);

    return {
      user: { id: userId, email },
      accessToken,
      refreshToken
    };
  }
  // 4. CẤP LẠI TOKEN MỚI (Refresh Token)
  async refreshToken(refreshToken: string) {
    try {
      // Bước 1: Giải mã để xem token này của ai và còn hạn không
      const payload = this.jwtService.verify(refreshToken);
      const userId = payload.sub;

      // Bước 2: Kiểm tra đối chiếu với Redis xem token này có bị thu hồi chưa
      // (Ví dụ: Đã ấn Đăng xuất trên máy khác thì Redis sẽ mất token này)
      const cachedToken = await this.cacheManager.get(`refresh_token:${userId}`);
      if (cachedToken !== refreshToken) {
        throw new UnauthorizedException('Token không hợp lệ hoặc bạn đã đăng xuất!');
      }

      // Bước 3: Nếu mọi thứ OK, cấp cho họ cặp token hoàn toàn mới
      // Vòng đời 15 phút / 7 ngày lại được reset từ đầu
      return this.generateTokens(userId, payload.email);
    } catch (error) {
      // Nếu token hết hạn hoặc giải mã thất bại
      throw new UnauthorizedException('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
    }
  }
}
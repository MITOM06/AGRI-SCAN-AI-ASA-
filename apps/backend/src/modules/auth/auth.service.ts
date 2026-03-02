import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Gọi Redis
    private mailerService: MailerService,
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
  // 5. QUÊN MẬT KHẨU - GỬI OTP
  async forgotPassword(email: string) {
    // 5.1 Kiểm tra xem có đang bị khóa 30p không
    const isLocked = await this.cacheManager.get(`lockout:${email}`);
    if (isLocked) throw new BadRequestException('Tài khoản đang bị vô hiệu hóa 30 phút do nhập sai OTP quá nhiều lần.');

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('Email không tồn tại trong hệ thống!');

    // 5.2 Tạo mã OTP 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 5.3 Lưu OTP vào Redis, tồn tại 60 giây
    await this.cacheManager.set(`otp:${email}`, otp, 60 * 1000);

    // 5.4 Gửi Email với Form Template chuyên nghiệp
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #2e7d32; text-align: center;">Agri-Scan AI</h2>
        <p>Xin chào <strong>${user.fullName}</strong>,</p>
        <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã OTP dưới đây để tiếp tục:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <h1 style="color: #333; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: red; font-size: 14px;"><em>* Mã OTP này chỉ có hiệu lực trong vòng 60 giây.</em></p>
        <p>Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này để đảm bảo an toàn.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">Đội ngũ phát triển Agri-Scan AI - HUTECH</p>
      </div>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: '🔑 Khôi phục mật khẩu - Agri-Scan AI',
      html: emailHtml,
    });

    return { message: 'Mã OTP đã được gửi đến email của bạn!' };
  }

  // 6. XÁC NHẬN OTP
  async verifyOtp(email: string, otp: string) {
    const isLocked = await this.cacheManager.get(`lockout:${email}`);
    if (isLocked) throw new BadRequestException('Tài khoản đang bị vô hiệu hóa 30 phút do nhập sai OTP quá nhiều lần.');

    const cachedOtp = await this.cacheManager.get(`otp:${email}`);
    if (!cachedOtp) throw new BadRequestException('Mã OTP đã hết hạn hoặc không tồn tại!');

    // Nếu nhập SAI OTP
    if (cachedOtp !== otp) {
      let attempts = await this.cacheManager.get<number>(`otp_attempts:${email}`) || 0;
      attempts += 1;

      if (attempts >= 5) {
        // Khóa 30 phút (30 * 60 * 1000 ms)
        await this.cacheManager.set(`lockout:${email}`, true, 30 * 60 * 1000);
        await this.cacheManager.del(`otp_attempts:${email}`);
        await this.cacheManager.del(`otp:${email}`);
        throw new BadRequestException('Bạn đã nhập sai 5 lần. Chức năng khôi phục bị khóa trong 30 phút!');
      }

      await this.cacheManager.set(`otp_attempts:${email}`, attempts, 10 * 60 * 1000); // Lưu số lần sai trong 10p
      throw new BadRequestException(`Mã OTP không chính xác! Bạn còn ${5 - attempts} lần thử.`);
    }

    // Nếu đúng: Xóa OTP, xóa số lần sai, cấp Reset Token (sống 5 phút)
    await this.cacheManager.del(`otp:${email}`);
    await this.cacheManager.del(`otp_attempts:${email}`);

    const resetToken = crypto.randomBytes(32).toString('hex');
    await this.cacheManager.set(`reset_token:${email}`, resetToken, 5 * 60 * 1000);

    return {
      message: 'Xác thực OTP thành công!',
      resetToken // Frontend cần giữ mã này để gửi kèm mật khẩu mới ở bước cuối
    };
  }

  // 7. ĐẶT LẠI MẬT KHẨU MỚI
  async resetPassword(email: string, resetToken: string, newPassword: string) {
    const cachedToken = await this.cacheManager.get(`reset_token:${email}`);

    if (!cachedToken || cachedToken !== resetToken) {
      throw new BadRequestException('Phiên đổi mật khẩu đã hết hạn hoặc không hợp lệ!');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Tìm và cập nhật user (Cần thêm hàm updatePassword bên UsersService nếu dùng TypeORM, với Mongoose ta có thể gọi Model)
    // Để gọn, ta gọi qua usersService (Bổ sung hàm updatePassword vào UsersService sau nhé)
    await this.usersService.updatePassword(email, hashedPassword);

    // Xóa token đi để không dùng lại được
    await this.cacheManager.del(`reset_token:${email}`);

    return { message: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập.' };
  }
}
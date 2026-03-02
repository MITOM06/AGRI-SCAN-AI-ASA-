import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) { 
    return this.authService.register(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: LoginDto) { 
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard) // Bắt buộc phải có Bearer Token
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: any) {
    // req.user được tạo ra từ hàm validate() trong JwtStrategy
    return this.authService.logout(req.user.userId);
  }

  // Thêm một API test thử xem Token hoạt động không
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return {
      message: 'Bạn đã truy cập thành công API bảo mật!',
      user: req.user,
    };
  }

  // API Cấp lại token
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshToken(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new BadRequestException('Vui lòng cung cấp Refresh Token!');
    }
    return this.authService.refreshToken(body.refreshToken);
  }
  @Post('forgot-password')
  // Vì chỉ có 1 field nên xài LoginDto (lấy email) tạm cũng được, hoặc tạo ForgotPasswordDto riêng
  forgotPassword(@Body() body: { email: string }) { 
    return this.authService.forgotPassword(body.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  verifyOtp(@Body() body: VerifyOtpDto) { 
    return this.authService.verifyOtp(body.email, body.otp);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  resetPassword(@Body() body: any) { 
    // Bạn có thể tự viết thêm ResetPasswordDto để tái sử dụng luật @IsStrongPassword cho mật khẩu mới nhé!
    return this.authService.resetPassword(body.email, body.resetToken, body.newPassword);
  }
}
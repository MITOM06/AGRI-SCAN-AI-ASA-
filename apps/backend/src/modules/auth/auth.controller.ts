import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @HttpCode(HttpStatus.OK) // Mặc định Post là 201, đổi sang 200 cho chuẩn Login
  @Post('login')
  login(@Body() body: any) {
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
}
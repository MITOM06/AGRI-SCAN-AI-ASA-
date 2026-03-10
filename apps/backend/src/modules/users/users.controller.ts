import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upgrade')
  async upgradePlan(@Request() req, @Body('plan') plan: 'PREMIUM' | 'VIP') {
    // req.user được lấy từ JwtAuthGuard
    const updatedUser = await this.usersService.upgradePlan(req.user.id, plan);
    
    return {
      message: `Nâng cấp gói ${plan} thành công!`,
      plan: updatedUser.plan,
      expiresAt: updatedUser.planExpiresAt
    };
  }
}
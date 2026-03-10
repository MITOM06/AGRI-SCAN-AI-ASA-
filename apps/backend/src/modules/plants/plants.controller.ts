import { Controller, Get, Param, UseGuards, Post, Body } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('plants')
@UseGuards(JwtAuthGuard) 
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) { }

  @Get()
  async getAllPlants() {
    return this.plantsService.findAllPlants();
  }

  @Get(':id')
  async getPlantDetail(@Param('id') id: string) {
    return this.plantsService.findPlantById(id);
  }

  @Post('seed')
  async seedPlantData() {
    return this.plantsService.seedData();
  }

  // 🔥 THÊM MỚI: Endpoint gửi đóng góp cây trồng (Tự động vào hàng đợi)
  @Post('contribute')
  async contributePlant(@Body() plantData: any) { // Có thể tạo DTO sau để validate chặt chẽ hơn
    return this.plantsService.contributePlant(plantData);
  }
}
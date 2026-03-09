import { Controller, Get, Param, UseGuards, Post } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('plants')
@UseGuards(JwtAuthGuard) // Yêu cầu phải login mới được xem từ điển (tùy bạn quyết định)
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

}
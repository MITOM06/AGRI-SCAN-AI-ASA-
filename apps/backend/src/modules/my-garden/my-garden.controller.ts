import { Controller, Post, Get, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { MyGardenService } from './my-garden.service';
import { AddPlantToGardenDto, DailyCheckInDto } from './dto/my-garden.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('my-garden')
@UseGuards(JwtAuthGuard) // Bắt buộc user phải đăng nhập mới được dùng
export class MyGardenController {
    constructor(private readonly myGardenService: MyGardenService) { }

    // 1. Lấy danh sách cây trong vườn của User hiện tại
    @Get()
    async getUserGarden(@Req() req) {
        const userId = req.user.id; // Lấy ID từ token đăng nhập
        return this.myGardenService.getUserGarden(userId);
    }

    // 2. Thêm cây vào vườn (Kích hoạt AI tạo lộ trình)
    @Post()
    async addPlantToGarden(@Req() req, @Body() dto: AddPlantToGardenDto) {
        const userId = req.user.id;
        return this.myGardenService.addPlantToGarden({
            userId,
            ...dto
        });
    }

    // 3. Check-in hằng ngày (Cập nhật tiến trình)
    @Post(':id/check-in')
    async dailyCheckIn(
        @Req() req,
        @Param('id') gardenId: string,
        @Body() dto: DailyCheckInDto
    ) {
        const userId = req.user.id;
        return this.myGardenService.dailyCheckIn(gardenId, userId, dto.currentDay);
    }

    // 4. Xóa cây khỏi vườn (Hoàn lại Slot cho gói cước)
    @Delete(':id')
    async removePlant(@Req() req, @Param('id') gardenId: string) {
        const userId = req.user.id;
        return this.myGardenService.removePlantFromGarden(gardenId, userId);
    }
}
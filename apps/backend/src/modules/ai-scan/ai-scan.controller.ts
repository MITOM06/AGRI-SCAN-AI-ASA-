import { Controller, Post, Get, Patch, Body, Param, UseInterceptors, UploadedFile, Req, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiScanService } from './ai-scan.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('scan')
@UseGuards(JwtAuthGuard) // Bắt buộc đăng nhập mới được quét ảnh
export class AiScanController {
    constructor(private readonly aiScanService: AiScanService) { }

    @Post('analyze')
    @UseInterceptors(FileInterceptor('image')) // 'image' là tên field Mobile gửi lên
    async analyzePlantImage(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        const userId = req.user.id; // Lấy ID user từ token đăng nhập
        return this.aiScanService.processImageAndDiagnose(userId, file);
    }

    @Post('chat')
    async chatWithAi(@Req() req: any, @Body('question') question: string) {
        const userId = req.user.id;
        return this.aiScanService.askVirtualAssistant(userId, question);
    }

    // API 2: Lấy toàn bộ lịch sử quét của User đang đăng nhập
    @Get('history')
    async getHistory(@Req() req: any) {
        const userId = req.user.id;
        return this.aiScanService.getUserScanHistory(userId);
    }

    @Get('chat/history')
    async getChatHistory(@Req() req: any) {
        const userId = req.user.id;
        return this.aiScanService.getUserChatHistory(userId);
    }

    // API 3: User xác nhận kết quả AI đúng hay sai (isAccurate)
    @Patch('history/:id/feedback')
    async submitFeedback(
        @Param('id') scanId: string,
        @Body('isAccurate') isAccurate: boolean,
    ) {
        return this.aiScanService.updateAccuracyFeedback(scanId, isAccurate);
    }
}
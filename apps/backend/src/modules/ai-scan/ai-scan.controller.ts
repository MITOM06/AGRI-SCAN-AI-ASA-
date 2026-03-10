import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiScanService } from './ai-scan.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('scan')
@UseGuards(JwtAuthGuard) // Bắt buộc đăng nhập mới được quét ảnh
export class AiScanController {
  constructor(private readonly aiScanService: AiScanService) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('image'))
  async analyzePlantImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 1. Cho phép dung lượng lên tới 10MB (10 * 1024 * 1024 bytes)
          new MaxFileSizeValidator({ maxSize: 10485760 }),
          // 2. Hỗ trợ đa dạng: JPG, PNG, WebP và đặc biệt là HEIC (định dạng ảnh gốc của Apple)
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp|heic)$/i }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user.userId || req.user._id || req.user.sub;
    if (!userId)
      throw new UnauthorizedException(
        'Không tìm thấy thông tin user trong token',
      );

    return this.aiScanService.processImageAndDiagnose(userId, file);
  }

    @Post('chat')
    async chatWithAi(
        @Req() req: any,
        @Body('question') question: string,
        @Body('label') label?: string,
        @Body('sessionId') sessionId?: string // Client truyền lên để tiếp tục session cũ
    ) {
        console.log('Dữ liệu User từ Token:', req.user);
        const userId = req.user.userId || req.user._id || req.user.sub;
        if (!userId) throw new UnauthorizedException('Không tìm thấy thông tin user trong token');

        return this.aiScanService.askVirtualAssistant(userId, question, label, sessionId);
    }


  @Get('chat/history')
  async getChatHistory(@Req() req: any) {
    const userId = req.user.userId || req.user._id || req.user.sub;
    return this.aiScanService.getUserChatHistory(userId);
  }

  // Lấy nội dung tin nhắn của một session cụ thể
  @Get('chat/sessions/:sessionId')
  async getSessionMessages(
    @Req() req: any,
    @Param('sessionId') sessionId: string,
  ) {
    const userId = req.user.userId || req.user._id || req.user.sub;
    return this.aiScanService.getSessionMessages(userId, sessionId);
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

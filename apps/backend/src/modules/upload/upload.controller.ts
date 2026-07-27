import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly storageService: StorageService) {}

  /**
   * POST /upload/image
   * Upload 1 ảnh (multipart/form-data, field 'image') lên GCS.
   * Dùng cho check-in vườn (mobile) và các nhu cầu upload ảnh chung.
   * Trả về: { url: string }
   */
  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10485760 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp|heic)$/i }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    const url = await this.storageService.uploadImage(file, 'uploads');
    return { url };
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { StorageService } from './storage.service';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [StorageService],
  exports: [StorageService], // để AiScanModule (và các module khác) tái sử dụng
})
export class UploadModule {}

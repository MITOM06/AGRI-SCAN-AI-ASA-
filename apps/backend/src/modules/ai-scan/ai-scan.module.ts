import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AiScanController } from './ai-scan.controller';
import { AiScanService } from './ai-scan.service';
import { AiScanConsumer } from './ai-scan.consumer';
import { 
  ScanHistory, ScanHistorySchema, 
  User, UserSchema, 
  ChatHistory, ChatHistorySchema 
} from '@agri-scan/database';
import { PlantsModule } from '../plants/plants.module';

@Module({
  imports: [
    // 1. Kết nối cơ sở dữ liệu
    MongooseModule.forFeature([
      { name: ScanHistory.name, schema: ScanHistorySchema },
      { name: ChatHistory.name, schema: ChatHistorySchema },
      { name: User.name, schema: UserSchema },
    ]),


    // FIX: Dùng Transport.RMQ (không phải REDIS) + đọc URL từ env thay vì hardcode localhost
    ClientsModule.registerAsync([
      {
        name: 'SCAN_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: 'scan_queue',
            queueOptions: { durable: true },
            prefetchCount: 1, // AI nặng, xử lý tuần tự từng ảnh
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'CHAT_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: 'chat_queue',
            queueOptions: { durable: true },
            prefetchCount: 5,
          },
        }),
        inject: [ConfigService],
      },
    ]),
    // FIX: Bỏ CacheModule.register() thừa — Redis cache đã được đăng ký global ở app.module.ts


    ConfigModule,


    PlantsModule,
  ],
  controllers: [
    AiScanController, 
    AiScanConsumer 
  ],
  providers: [
    AiScanService
  ],
})
export class AiScanModule {}
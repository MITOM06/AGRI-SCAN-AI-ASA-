import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiScanController } from './ai-scan.controller';
import { AiScanService } from './ai-scan.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ScanHistory, ScanHistorySchema } from '@agri-scan/database';
import { ChatHistory, ChatHistorySchema } from '@agri-scan/database';
import { PlantsModule } from '../plants/plants.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScanHistory.name, schema: ScanHistorySchema },
      { name: ChatHistory.name, schema: ChatHistorySchema },
    ]),
    PlantsModule,
    CacheModule.register({
      store: redisStore,
      host: 'asa-redis',
      port: 6379,
    }),
  ],
  controllers: [AiScanController],
  providers: [AiScanService],
})
export class AiScanModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiScanController } from './ai-scan.controller';
import { AiScanService } from './ai-scan.service';
import { ScanHistory, ScanHistorySchema, User, UserSchema } from '@agri-scan/database';
import { ChatHistory, ChatHistorySchema } from '@agri-scan/database';
import { PlantsModule } from '../plants/plants.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScanHistory.name, schema: ScanHistorySchema },
      { name: ChatHistory.name, schema: ChatHistorySchema },
      { name: User.name, schema: UserSchema },
    ]),
    PlantsModule,
  ],
  controllers: [AiScanController],
  providers: [AiScanService],
})
export class AiScanModule {}

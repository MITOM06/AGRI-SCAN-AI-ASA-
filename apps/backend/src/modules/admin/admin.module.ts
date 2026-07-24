import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  User,
  UserSchema,
  Feedback,
  FeedbackSchema,
  Payment,
  PaymentSchema,
  ScanHistory,
  ScanHistorySchema,
  ChatHistory,
  ChatHistorySchema,
} from '@agri-scan/database';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Feedback.name, schema: FeedbackSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: ScanHistory.name, schema: ScanHistorySchema },
      { name: ChatHistory.name, schema: ChatHistorySchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

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
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminUsersService } from './admin-users.service';
import { AdminReportsService } from './admin-reports.service';
import { AdminFeedbackService } from './admin-feedback.service';
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
  providers: [
    AdminDashboardService,
    AdminUsersService,
    AdminReportsService,
    AdminFeedbackService,
  ],
})
export class AdminModule {}

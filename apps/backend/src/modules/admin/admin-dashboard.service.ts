import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  User,
  UserDocument,
  Feedback,
  FeedbackDocument,
  Payment,
  PaymentDocument,
  ScanHistory,
  ScanHistoryDocument,
} from '@agri-scan/database';
import type { RevenueSumRow } from './admin.types';

/**
 * Tổng quan dashboard admin: số user, doanh thu, feedback chờ xử lý, tổng lượt quét.
 */
@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(ScanHistory.name)
    private scanHistoryModel: Model<ScanHistoryDocument>,
  ) {}

  async getDashboard() {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0); // Mutate bản copy, không mutate now
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      newUsersToday,
      newUsersThisMonth,
      totalPremium,
      totalVip,
      totalFree,
      pendingFeedbacks,
      totalRevenue,
      revenueThisMonth,
      totalScans,
    ] = await Promise.all([
      this.userModel.countDocuments({ role: { $ne: 'ADMIN' } }),
      this.userModel.countDocuments({
        role: { $ne: 'ADMIN' },
        createdAt: { $gte: todayStart },
      }),
      this.userModel.countDocuments({
        role: { $ne: 'ADMIN' },
        createdAt: { $gte: monthStart },
      }),
      this.userModel.countDocuments({ plan: 'PREMIUM' }),
      this.userModel.countDocuments({ plan: 'VIP' }),
      this.userModel.countDocuments({ plan: 'FREE', role: { $ne: 'ADMIN' } }),
      this.feedbackModel.countDocuments({ status: 'PENDING' }),
      this.paymentModel.aggregate<RevenueSumRow>([
        { $match: { status: 'SUCCESS' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      this.paymentModel.aggregate<RevenueSumRow>([
        {
          $match: {
            status: 'SUCCESS',
            createdAt: { $gte: monthStart },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      this.scanHistoryModel.countDocuments(),
    ]);

    return {
      users: {
        total: totalUsers,
        newToday: newUsersToday,
        newThisMonth: newUsersThisMonth,
        byPlan: { FREE: totalFree, PREMIUM: totalPremium, VIP: totalVip },
      },
      revenue: {
        total: totalRevenue[0]?.total ?? 0,
        thisMonth: revenueThisMonth[0]?.total ?? 0,
      },
      pendingFeedbacks,
      totalScans,
    };
  }
}

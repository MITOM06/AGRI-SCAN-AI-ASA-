import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { User, UserDocument } from '@agri-scan/database';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(userData: Partial<User>): Promise<UserDocument> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    await this.userModel.updateOne({ email }, { password: newPassword }).exec();
  }

  // 🔥 THÊM MỚI: Hàm kiểm tra và reset bộ đếm nếu qua ngày mới
  async checkAndResetDailyQuotas(user: UserDocument): Promise<UserDocument> {
    const today = new Date();
    const lastReset = new Date(user.lastResetDate);

    let needsUpdate = false;

    // 1. Kiểm tra hết hạn gói cước
    if (user.plan !== 'FREE' && user.planExpiresAt && user.planExpiresAt < today) {
      user.plan = 'FREE';
      user.planExpiresAt = null; // TypeScript giờ đã cho phép
      needsUpdate = true;
    }

    // 2. Kiểm tra qua ngày mới
    if (lastReset.toDateString() !== today.toDateString()) {
      user.dailyImageCount = 0;
      user.dailyPromptCount = 0;
      user.lastResetDate = today;
      needsUpdate = true;
    }

    if (needsUpdate) {
      // Dùng markModified nếu cần thiết với các trường phức tạp, 
      // nhưng ở đây gán trực tiếp và save() là đủ.
      await user.save();
    }

    return user;
  }

  // 🔥 THÊM MỚI: Hàm Mock Payment Nâng cấp gói
  async upgradePlan(userId: string, plan: 'PREMIUM' | 'VIP'): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');

    const now = new Date();
    // Cộng thêm 30 ngày (30 * 24 * 60 * 60 * 1000)
    const expirationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    user.plan = plan;
    user.planExpiresAt = expirationDate;

    // Khi nâng cấp, reset luôn bộ đếm ngày hôm đó cho họ dùng thả ga
    user.dailyImageCount = 0;
    user.dailyPromptCount = 0;
    user.lastResetDate = now;

    return user.save();
  }
}
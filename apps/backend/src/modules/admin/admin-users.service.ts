import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  User,
  UserDocument,
  Payment,
  PaymentDocument,
} from '@agri-scan/database';
import { GetUsersQueryDto } from './dto/admin-user.dto';

/**
 * Quản lý người dùng phía admin: tra cứu danh sách và đổi gói đăng ký.
 */
@Injectable()
export class AdminUsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async getUsers(query: GetUsersQueryDto) {
    const { plan, role, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { role: { $ne: 'ADMIN' } };

    if (plan) filter.plan = plan;
    if (role && role !== 'ADMIN') filter.role = role;
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-password -googleId -facebookId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserPlan(
    userId: string,
    plan: 'FREE' | 'PREMIUM' | 'VIP',
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Người dùng không tồn tại!');
    if (user.role === 'ADMIN')
      throw new BadRequestException('Không thể thay đổi gói của Admin!');

    user.plan = plan;

    if (plan === 'FREE') {
      user.planExpiresAt = null;
    } else {
      const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      user.planExpiresAt = expirationDate;

      // Ghi nhận payment khi admin gán gói thủ công (miễn phí / tặng)
      await this.paymentModel.create({
        userId: user._id,
        plan,
        amount: 0, // admin tặng → 0 đồng
        status: 'SUCCESS',
        method: 'ADMIN_GRANT',
      });
    }

    return user.save();
  }
}

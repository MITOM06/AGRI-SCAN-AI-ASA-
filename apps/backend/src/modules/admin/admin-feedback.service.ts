import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Types } from 'mongoose';
import { Feedback, FeedbackDocument } from '@agri-scan/database';

/**
 * Feedback: người dùng gửi/xem lại phản hồi của mình, admin xem danh sách và trả lời.
 */
@Injectable()
export class AdminFeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
  ) {}

  async submitFeedback(
    userId: string,
    data: { category: string; content: string },
  ) {
    const feedback = await this.feedbackModel.create({
      userId: new Types.ObjectId(userId),
      ...data,
    });
    return { message: 'Cảm ơn bạn đã gửi phản hồi!', id: feedback._id };
  }

  async getFeedbacks(status?: string, page = 1, limit = 20) {
    const filter: Record<string, any> = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.feedbackModel
        .find(filter)
        .populate('userId', 'email fullName')
        .populate('repliedBy', 'email fullName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.feedbackModel.countDocuments(filter),
    ]);

    return {
      data,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async replyFeedback(feedbackId: string, adminId: string, reply: string) {
    const feedback = await this.feedbackModel.findById(feedbackId);
    if (!feedback) throw new NotFoundException('Không tìm thấy feedback này!');
    if (feedback.status === 'REPLIED') {
      throw new BadRequestException('Feedback này đã được trả lời!');
    }

    feedback.adminReply = reply;
    feedback.repliedBy = new Types.ObjectId(adminId);
    feedback.repliedAt = new Date();
    feedback.status = 'REPLIED';

    await feedback.save();
    return { message: 'Đã trả lời feedback thành công!' };
  }

  // Lấy danh sách feedback của riêng 1 User
  async getUserFeedbacks(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const filter = { userId: new Types.ObjectId(userId) };

    const [data, total] = await Promise.all([
      this.feedbackModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.feedbackModel.countDocuments(filter),
    ]);

    return {
      data,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}

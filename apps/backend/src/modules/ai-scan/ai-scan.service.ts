import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScanHistory, ChatHistory, User } from '@agri-scan/database';
import { PlantsService } from '../plants/plants.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';

@Injectable()
export class AiScanService {
  constructor(
    @InjectModel(ScanHistory.name) private scanHistoryModel: Model<ScanHistory>,
    @InjectModel(ChatHistory.name) private chatHistoryModel: Model<ChatHistory>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('SCAN_SERVICE') private readonly scanClient: ClientProxy, // RabbitMQ Client cho Scan
    @Inject('CHAT_SERVICE') private readonly chatClient: ClientProxy, // RabbitMQ Client cho Chat
    private readonly plantsService: PlantsService,
    private readonly configService: ConfigService,
  ) { }

  private get aiServiceUrl(): string {
    return this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
  }

  // Giả định hàm uploadImage hiện tại của bạn
  private async uploadImage(file: Express.Multer.File): Promise<string> {
    // Logic upload của bạn ở đây (Cloudinary/S3/Local...)
    return 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg';
  }

  // ==========================================
  // 🔥 XỬ LÝ ẢNH (PHIÊN BẢN RABBITMQ)
  // ==========================================
  async processImageAndDiagnose(userId: string, imageFile: Express.Multer.File) {
    // 1. Kiểm tra và trừ quota trước
    await this.checkAndIncrementQuota(userId, 'IMAGE');

    try {
      // 2. Tải ảnh lên storage
      const savedImageUrl = await this.uploadImage(imageFile);

      const newScan = new this.scanHistoryModel({
        userId,
        imageUrl: savedImageUrl,
        aiPredictions: [],
        scannedAt: new Date(),
        status: 'PENDING',
      });
      await newScan.save();

      // 4. Đẩy yêu cầu vào Queue (RabbitMQ)
      // Chúng ta gửi dữ liệu cần thiết để Worker phía sau có thể xử lý
      this.scanClient.emit('scan.image.requested', {
        scanId: newScan._id.toString(),
        userId,
        imageUrl: savedImageUrl,
      });

      // 5. Trả về ngay lập tức cho Frontend
      return {
        scanHistoryId: newScan._id,
        imageUrl: savedImageUrl,
        status: 'PROCESSING',
        message: 'Ảnh đang được hệ thống phân tích, kết quả sẽ cập nhật sau giây lát...',
      };

    } catch (error) {
      // 6. Hoàn lại lượt nếu có lỗi xảy ra trong quá trình lưu DB hoặc đẩy Queue
      console.error('Lỗi khi đẩy task vào queue:', error);
      if (!(error instanceof BadRequestException) && !(error instanceof UnauthorizedException)) {
        await this.userModel.findByIdAndUpdate(userId, { $inc: { dailyImageCount: -1 } });
      }
      throw error;
    }
  }

  async getScanStatus(userId: string, scanId: string) {
    const scan = await this.scanHistoryModel
      .findOne({ _id: scanId, userId })
      .populate({ path: 'aiPredictions.diseaseId', select: 'name pathogen type symptoms treatments' })
      .exec();

    if (!scan) throw new NotFoundException('Không tìm thấy lịch sử quét này!');

    if ((scan as any).status === 'PENDING' || (scan as any).status === 'PROCESSING') {
      return { status: 'PROCESSING', message: 'Đang phân tích...' };
    }

    if ((scan as any).status === 'FAILED') {
      return { status: 'FAILED', message: (scan as any).errorMessage };
    }

    // COMPLETED — trả về kết quả đầy đủ
    return {
      status: 'COMPLETED',
      scanHistoryId: scan._id,
      imageUrl: scan.imageUrl,
      predictions: scan.aiPredictions,
      topDisease: scan.aiPredictions[0]?.diseaseId ?? null,
    };
  }

  // ==========================================
  // CÁC HÀM HỖ TRỢ (GIỮ NGUYÊN LOGIC CŨ)
  // ==========================================

  private async checkAndIncrementQuota(userId: string, type: 'IMAGE' | 'PROMPT') {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('Không tìm thấy người dùng');

    const today = new Date();
    const lastReset = new Date(user.lastResetDate);

    if (lastReset.toDateString() !== today.toDateString()) {
      await this.userModel.findByIdAndUpdate(userId, {
        $set: { dailyImageCount: 0, dailyPromptCount: 0, lastResetDate: today }
      });
      user.dailyImageCount = 0;
    }

    if (user.plan !== 'FREE' && user.planExpiresAt && user.planExpiresAt < today) {
      await this.userModel.findByIdAndUpdate(userId, { $set: { plan: 'FREE', planExpiresAt: null } });
      user.plan = 'FREE';
    }

    const limits = {
      IMAGE: { FREE: 3, PREMIUM: 10, VIP: Infinity },
      PROMPT: { FREE: 10, PREMIUM: 50, VIP: Infinity },
    };
    const maxCount = limits[type][user.plan] ?? 3;
    const countField = type === 'IMAGE' ? 'dailyImageCount' : 'dailyPromptCount';

    if (user[countField] >= maxCount) {
      throw new BadRequestException(`Đã hết lượt sử dụng gói ${user.plan}.`);
    }

    await this.userModel.findByIdAndUpdate(userId, { $inc: { [countField]: 1 } });
  }

  // Các hàm khác giữ nguyên...
  async getScanDetail(userId: string, scanId: string) {
    const scan = await this.scanHistoryModel.findOne({ _id: scanId, userId }).populate('aiPredictions.diseaseId').exec();
    if (!scan) throw new NotFoundException('Không tìm thấy lịch sử quét!');
    return scan;
  }

  async getChatMessageStatus(userId: string, sessionId: string) {
    const chatDoc = await this.chatHistoryModel
      .findOne({ _id: sessionId, userId })
      .exec();

    if (!chatDoc) throw new NotFoundException('Không tìm thấy phiên hội thoại!');

    const lastMessage = chatDoc.messages[chatDoc.messages.length - 1];
    if (!lastMessage) return { status: 'EMPTY' };

    if (lastMessage.role === 'ai' && (lastMessage as any).status === 'PENDING') {
      return { status: 'PROCESSING', message: 'Trợ lý đang soạn câu trả lời...' };
    }

    // Trả về tin nhắn AI mới nhất đã hoàn thành
    return {
      status: 'COMPLETED',
      sessionId: chatDoc._id,
      answer: lastMessage.content,
      messages: chatDoc.messages,
    };
  }

  // ==========================================
  // 🔥 HÀM CHAT TRỢ LÝ ẢO (PHIÊN BẢN RABBITMQ)
  // ==========================================
  async askVirtualAssistant(userId: string | null, question: string, diseaseLabel?: string, sessionId?: string) {
    const finalLabel = diseaseLabel || 'Cây trồng';

    // 1. XỬ LÝ KHÁCH VÃNG LAI (Không cần trừ DB, không lưu lịch sử, gọi trực tiếp)
    if (!userId) {
      try {
        const aiResponse = await axios.post(`${this.aiServiceUrl}/chat`, { label: finalLabel, prompt: question });
        return {
          sessionId: 'guest_session',
          question,
          answer: aiResponse.data.answer ? String(aiResponse.data.answer) : JSON.stringify(aiResponse.data),
          status: 'COMPLETED'
        };
      } catch (error) {
        throw new InternalServerErrorException('Trợ lý ảo đang bận, vui lòng thử lại!');
      }
    }

    // 2. XỬ LÝ NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP (Sử dụng RabbitMQ)
    await this.checkAndIncrementQuota(userId, 'PROMPT');

    try {
      let chatDoc: any;
      if (sessionId) {
        chatDoc = await this.chatHistoryModel.findOne({ _id: sessionId, userId });
      }

      if (!chatDoc) {
        const autoTitle = question.trim().length > 0
          ? question.trim().slice(0, 50) + (question.trim().length > 50 ? '...' : '')
          : 'Cuộc hội thoại mới';
        chatDoc = new this.chatHistoryModel({ userId, title: autoTitle, messages: [] });
      }

      // Lưu tin nhắn user ngay lập tức
      chatDoc.messages.push({
        role: 'user',
        content: question,
        timestamp: new Date(),
        status: 'COMPLETED', // Cần thêm field status vào Schema của Message
      });

      // Tạo placeholder cho tin nhắn AI với status PENDING
      const pendingIndex = chatDoc.messages.length;
      chatDoc.messages.push({
        role: 'ai',
        content: '',          // Rỗng, chờ worker điền vào
        timestamp: new Date(),
        status: 'PENDING',
      });

      await chatDoc.save();

      // Đẩy vào queue thay vì gọi AI Service trực tiếp
      this.chatClient.emit('chat.message.requested', {
        sessionId: chatDoc._id.toString(),
        userId,
        label: finalLabel,
        question,
        pendingMessageIndex: pendingIndex,
      });

      // Trả về ngay, không cần chờ AI
      return {
        sessionId: chatDoc._id,
        question,
        answer: null,                    // null = đang chờ
        status: 'PROCESSING',
        message: 'Trợ lý đang soạn câu trả lời...',
      };

    } catch (error) {
      // ROLLBACK PROMPT QUOTA khi lỗi hệ thống
      if (
        !(error instanceof BadRequestException) &&
        !(error instanceof UnauthorizedException)
      ) {
        console.log(`Đang hoàn lại lượt prompt cho user ${userId} do lỗi hệ thống...`);
        await this.userModel.findByIdAndUpdate(userId, {
          $inc: { dailyPromptCount: -1 },
        });
      }
      throw new InternalServerErrorException('Trợ lý ảo đang bận, vui lòng thử lại sau!');
    }
  }

  // Các hàm getHistory giữ nguyên...
  async getUserScanHistory(userId: string) {
    return this.scanHistoryModel.find({ userId: userId }).populate({ path: 'aiPredictions.diseaseId', select: 'name pathogen type treatments' }).sort({ scannedAt: -1 }).exec();
  }
  async getUserChatHistory(userId: string) {
    const sessions = await this.chatHistoryModel.find({ userId }).select('_id title createdAt updatedAt').sort({ createdAt: -1 }).exec();
    return sessions.map((s) => ({ sessionId: (s._id as any).toString(), title: s.title, createdAt: (s as any).createdAt, updatedAt: (s as any).updatedAt }));
  }
  async getSessionMessages(userId: string, sessionId: string) {
    const chatDoc = await this.chatHistoryModel.findOne({ _id: sessionId, userId }).exec();
    if (!chatDoc) return { sessionId, title: null, messages: [] };
    return { sessionId: chatDoc._id, title: chatDoc.title, messages: chatDoc.messages };
  }
  async updateAccuracyFeedback(scanId: string, isAccurate: boolean) {
    const updatedScan = await this.scanHistoryModel.findByIdAndUpdate(scanId, { isAccurate: isAccurate }, { new: true });
    if (!updatedScan) throw new NotFoundException('Không tìm thấy lịch sử quét này');
    return updatedScan;
  }
}
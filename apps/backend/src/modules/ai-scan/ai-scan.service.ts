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
import { ScanHistory, ChatHistory, User } from '@agri-scan/database'; // 🔥 Thêm User vào import
import { PlantsService } from '../plants/plants.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import FormDataNode from 'form-data';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiScanService {
  constructor(
    @InjectModel(ScanHistory.name) private scanHistoryModel: Model<ScanHistory>,
    @InjectModel(ChatHistory.name) private chatHistoryModel: Model<ChatHistory>,
    @InjectModel(User.name) private userModel: Model<User>, // 🔥 Bơm Model User vào để check Quota
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly plantsService: PlantsService,
    private readonly configService: ConfigService,
  ) { }
  private get aiServiceUrl(): string {
    return this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
  }

  async getScanDetail(userId: string, scanId: string) {
    const scan = await this.scanHistoryModel
      .findOne({ _id: scanId, userId })
      .populate({
        path: 'aiPredictions.diseaseId',
        select: 'name pathogen type symptoms treatments description'
      })
      .exec();

    if (!scan) throw new NotFoundException('Không tìm thấy lịch sử quét này!');
    return scan;
  }
  // ==========================================
  // 🔥 HÀM KIỂM TRA & TRỪ LƯỢT GÓI CƯỚC (QUOTA)
  // ==========================================
  private async checkAndIncrementQuota(userId: string, type: 'IMAGE' | 'PROMPT') {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('Không tìm thấy người dùng');

    const today = new Date();
    const lastReset = new Date(user.lastResetDate);

    // Reset nếu qua ngày - phải làm riêng vì cần check điều kiện trước
    if (lastReset.toDateString() !== today.toDateString()) {
      await this.userModel.findByIdAndUpdate(userId, {
        $set: { dailyImageCount: 0, dailyPromptCount: 0, lastResetDate: today }
      });
      user.dailyImageCount = 0;
      user.dailyPromptCount = 0;
    }

    // Downgrade nếu hết hạn
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
    const currentCount = user[countField];

    if (currentCount >= maxCount) {
      throw new BadRequestException(
        `Đã hết ${maxCount === Infinity ? 'không giới hạn' : maxCount} lượt ${type === 'IMAGE' ? 'chụp ảnh' : 'hỏi trợ lý'}/ngày của gói ${user.plan}.`
      );
    }

    // Atomic increment - đảm bảo không race condition
    await this.userModel.findByIdAndUpdate(userId, { $inc: { [countField]: 1 } });
  }

  // ==========================================
  // HÀM XỬ LÝ ẢNH
  // ==========================================
  async processImageAndDiagnose(userId: string, imageFile: Express.Multer.File) {
    // 1. CHỐT CHẶN: Kiểm tra và tăng quota trước
    // Giả sử hàm này ném ra lỗi nếu hết lượt, lỗi đó sẽ không bị catch ở dưới rollback 
    // vì nó nằm ngoài block try (hợp lý vì chưa trừ thì không cần hoàn).
    await this.checkAndIncrementQuota(userId, 'IMAGE');

    try {
      const mockImageUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

      // 2. Xử lý Cache với Redis
      const imageHash = crypto.createHash('md5').update(imageFile.buffer).digest('hex');
      const cacheKey = `ai_scan_result_${imageHash}`;
      const cachedResult = await this.cacheManager.get(cacheKey);

      let aiPredictionResult;

      if (cachedResult) {
        console.log('Lấy kết quả từ Redis 🚀');
        aiPredictionResult = cachedResult;
      } else {
        // 3. Gửi sang FastAPI nếu chưa có cache
        console.log('Đang gửi ảnh sang FastAPI... 🧠');
        const formData = new FormDataNode();
        formData.append('file', imageFile.buffer, {
          filename: imageFile.originalname,
          contentType: imageFile.mimetype,
          knownLength: imageFile.size,
        });

        try {
          const aiResponse = await axios.post(`${this.aiServiceUrl}/predict`, formData, {
            headers: formData.getHeaders(),
            maxBodyLength: Infinity,
          });
          aiPredictionResult = aiResponse.data;
        } catch (error) {
          // Lỗi kết nối AI sẽ nhảy xuống block catch lớn bên ngoài để rollback
          throw new InternalServerErrorException('Hệ thống AI đang bận, vui lòng thử lại sau');
        }

        if (!aiPredictionResult || aiPredictionResult.success === false) {
          // Lỗi logic từ AI server (ví dụ: ảnh không có cây)
          throw new BadRequestException(`AI Server: ${aiPredictionResult?.error || 'Không nhận diện được'}`);
        }

        // Lưu cache 24h
        await this.cacheManager.set(cacheKey, aiPredictionResult, 86400 * 1000);
      }

      // 4. Lấy thông tin bệnh từ database
      const diseaseInfo = await this.plantsService.findDiseaseByName(aiPredictionResult.yolo_label);
      if (!diseaseInfo) {
        throw new NotFoundException(`Không tìm thấy dữ liệu cho bệnh: ${aiPredictionResult.yolo_label}`);
      }

      // 5. Lưu lịch sử chẩn đoán
      const newScan = new this.scanHistoryModel({
        userId,
        imageUrl: mockImageUrl,
        aiPredictions: [{ diseaseId: diseaseInfo._id, confidence: aiPredictionResult.confidence }],
        scannedAt: new Date(),
      });
      await newScan.save();

      return {
        scanHistoryId: newScan._id,
        imageUrl: mockImageUrl,
        predictions: [aiPredictionResult],
        topDisease: diseaseInfo,
      };

    } catch (error) {
      // 6. ROLLBACK QUOTA: Nếu lỗi không phải do người dùng (400, 401)
      // Các lỗi như: 500 (Server die), lỗi Database, lỗi kết nối AI... sẽ được hoàn lượt
      if (!(error instanceof BadRequestException) && !(error instanceof UnauthorizedException)) {
        console.log(`Đang hoàn lại lượt dùng cho user ${userId} do lỗi hệ thống...`);
        await this.userModel.findByIdAndUpdate(userId, { $inc: { dailyImageCount: -1 } });
      }

      // Cuối cùng vẫn phải throw lỗi để Frontend nhận diện được
      throw error;
    }
  }
  // ==========================================
  // HÀM CHAT TRỢ LÝ ẢO
  // ==========================================
  async askVirtualAssistant(userId: string | null, question: string, diseaseLabel?: string, sessionId?: string) {
    const finalLabel = diseaseLabel || 'Cây trồng';


    // 🔥 XỬ LÝ KHÁCH VÃNG LAI (Không cần trừ DB, không lưu lịch sử)
    if (!userId) {
      try {
        const aiResponse = await axios.post(`${this.aiServiceUrl}/chat`, { label: finalLabel, prompt: question });
        return {
          sessionId: 'guest_session',
          question,
          answer: aiResponse.data.answer ? String(aiResponse.data.answer) : JSON.stringify(aiResponse.data),
        };
      } catch (error) {
        throw new InternalServerErrorException('Trợ lý ảo đang bận, vui lòng thử lại!');
      }
    }



    // 🔥 CHỐT CHẶN: Kiểm tra lượt Prompt của User đã đăng nhập
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

      chatDoc.messages.push({ role: 'user', content: question, timestamp: new Date() });
      await chatDoc.save();

      const aiResponse = await axios.post(`${this.aiServiceUrl}/chat`, {
        label: finalLabel,
        prompt: question,
      });

      const answerContent = aiResponse.data.answer
        ? String(aiResponse.data.answer)
        : JSON.stringify(aiResponse.data);

      chatDoc.messages.push({ role: 'ai', content: answerContent, timestamp: new Date() });
      await chatDoc.save();

      return { sessionId: chatDoc._id, question, answer: answerContent };

    } catch (error) {
      // ✅ FIX: ROLLBACK PROMPT QUOTA khi lỗi hệ thống (không phải lỗi user)
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
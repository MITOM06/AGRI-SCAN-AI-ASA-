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

@Injectable()
export class AiScanService {
  constructor(
    @InjectModel(ScanHistory.name) private scanHistoryModel: Model<ScanHistory>,
    @InjectModel(ChatHistory.name) private chatHistoryModel: Model<ChatHistory>,
    @InjectModel(User.name) private userModel: Model<User>, // 🔥 Bơm Model User vào để check Quota
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly plantsService: PlantsService,

  ) { }

  // ==========================================
  // 🔥 HÀM KIỂM TRA & TRỪ LƯỢT GÓI CƯỚC (QUOTA)
  // ==========================================
  private async checkAndIncrementQuota(userId: string, type: 'IMAGE' | 'PROMPT') {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('Không tìm thấy người dùng');

    const today = new Date();
    const lastReset = new Date(user.lastResetDate);

    // 1. Reset ngày mới
    if (lastReset.toDateString() !== today.toDateString()) {
      user.dailyImageCount = 0;
      user.dailyPromptCount = 0;
      user.lastResetDate = today;
    }

    // 2. Hạ cấp nếu gói hết hạn
    if (user.plan !== 'FREE' && user.planExpiresAt && user.planExpiresAt < today) {
      user.plan = 'FREE';
      user.planExpiresAt = null;
    }

    // 3. Kiểm tra logic các gói
    if (type === 'IMAGE') {
      let maxImages = 3; // FREE
      if (user.plan === 'PREMIUM') maxImages = 10;
      if (user.plan === 'VIP') maxImages = 20;

      if (user.dailyImageCount >= maxImages) {
        throw new BadRequestException(`Đã hết ${maxImages} lượt chụp ảnh/ngày của gói ${user.plan}. Vui lòng nâng cấp gói để sử dụng tiếp!`);
      }
      user.dailyImageCount += 1;
    }

    if (type === 'PROMPT') {
      let maxPrompts = 10; // FREE
      if (user.plan === 'PREMIUM') maxPrompts = 20;
      if (user.plan === 'VIP') maxPrompts = Infinity; // VIP Vô hạn

      if (user.dailyPromptCount >= maxPrompts) {
        throw new BadRequestException(`Đã hết ${maxPrompts} lượt hỏi trợ lý/ngày của gói ${user.plan}. Vui lòng nâng cấp gói để sử dụng tiếp!`);
      }
      user.dailyPromptCount += 1;
    }

    await user.save();
  }

  // ==========================================
  // HÀM XỬ LÝ ẢNH
  // ==========================================
  async processImageAndDiagnose(userId: string, imageFile: Express.Multer.File) {
    // 1. CHỐT CHẶN: Kiểm tra xem User còn lượt chụp ảnh không
    await this.checkAndIncrementQuota(userId, 'IMAGE');

    // 🔥 FIX LỖI: Đặt biến mockImageUrl vào BÊN TRONG hàm
    const mockImageUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';


    const imageHash = crypto.createHash('md5').update(imageFile.buffer).digest('hex');
    const cacheKey = `ai_scan_result_${imageHash}`;
    const cachedResult = await this.cacheManager.get(cacheKey);

    let aiPredictionResult;

    if (cachedResult) {
      console.log('Lấy kết quả từ Redis 🚀');
      aiPredictionResult = cachedResult;
    } else {
      try {
        console.log('Đang gửi ảnh sang FastAPI... 🧠');
        const formData = new FormDataNode();
        formData.append('file', imageFile.buffer, {
          filename: imageFile.originalname,
          contentType: imageFile.mimetype,
          knownLength: imageFile.size,
        });

        const aiResponse = await axios.post('http://localhost:8000/predict', formData, {
          headers: formData.getHeaders(),
          maxBodyLength: Infinity,
        });
        aiPredictionResult = aiResponse.data;
      } catch (error) {
        throw new InternalServerErrorException('Không thể kết nối với hệ thống AI Bác sĩ');
      }

      if (!aiPredictionResult || aiPredictionResult.success === false) {
        throw new BadRequestException(`AI Server báo lỗi: ${aiPredictionResult?.error || 'Không nhận diện được'}`);
      }
      await this.cacheManager.set(cacheKey, aiPredictionResult, 86400);
    }

    const diseaseInfo = await this.plantsService.findDiseaseByName(aiPredictionResult.yolo_label);
    if (!diseaseInfo) {
      throw new NotFoundException(`Không tìm thấy bệnh: ${aiPredictionResult.yolo_label}`);
    }

    const newScan = new this.scanHistoryModel({
      userId,
      imageUrl: mockImageUrl, // Dùng biến nội bộ của hàm
      aiPredictions: [{ diseaseId: diseaseInfo._id, confidence: aiPredictionResult.confidence }],
      isAccurate: null,
      scannedAt: new Date(),
    });
    await newScan.save();

    return {
      scanHistoryId: newScan._id,
      imageUrl: mockImageUrl, // Trả về link ảo cho Frontend hiển thị tạm
      predictions: [aiPredictionResult],
      topDisease: diseaseInfo,
    };
  }
  // ==========================================
  // HÀM CHAT TRỢ LÝ ẢO
  // ==========================================
  async askVirtualAssistant(userId: string | null, question: string, diseaseLabel?: string, sessionId?: string) {
    const finalLabel = diseaseLabel || 'Cây trồng';


    // 🔥 XỬ LÝ KHÁCH VÃNG LAI (Không cần trừ DB, không lưu lịch sử)
    if (!userId) {
      try {
        const aiResponse = await axios.post('http://localhost:8000/chat', { label: finalLabel, prompt: question });
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
        // Không có sessionId hoặc không tìm thấy → tạo session MỚI
        const autoTitle = question.trim().length > 0
          ? question.trim().slice(0, 50) + (question.trim().length > 50 ? '...' : '')
          : 'Cuộc hội thoại mới';

        chatDoc = new this.chatHistoryModel({
          userId,
          title: autoTitle,
          messages: [],
        });
      }

      chatDoc.messages.push({ role: 'user', content: question, timestamp: new Date() });
      await chatDoc.save();


      // 1.4 Bắn câu hỏi sang cổng 8000 của team AI
      const aiResponse = await axios.post('http://localhost:8000/chat', {
        label: finalLabel,
        prompt: question,
      });

      console.log('Dữ liệu AI trả về:', aiResponse.data);

      const answerContent = aiResponse.data.answer
        ? String(aiResponse.data.answer)
        : JSON.stringify(aiResponse.data);


      // 1.5 Push câu trả lời của AI vào mảng messages
      chatDoc.messages.push({
        role: 'ai',
        content: answerContent,
        timestamp: new Date(),
      });

      chatDoc.messages.push({ role: 'ai', content: answerContent, timestamp: new Date() });
      await chatDoc.save();

      return {
        sessionId: chatDoc._id,
        question,
        answer: answerContent,
      };
    } catch (error) {
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
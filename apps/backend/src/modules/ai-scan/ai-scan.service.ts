import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScanHistory } from '@agri-scan/database';
import { PlantsService } from '../plants/plants.service';
import { ChatHistory } from '@agri-scan/database';
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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly plantsService: PlantsService,
  ) {}
  async processImageAndDiagnose(
    userId: string,
    imageFile: Express.Multer.File,
  ) {
    // 1. 🔥 TỐI ƯU: CHUYỂN ẢNH SANG BASE64 ĐỂ LƯU THẲNG VÀO DATABASE
    // Không dùng mock URL nữa, chúng ta lấy chính bức ảnh người dùng vừa chụp!
    const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;

    // 2. TẠO MÃ BĂM (HASH) CHO BỨC ẢNH ĐỂ LÀM CHÌA KHÓA TÌM KIẾM
    const imageHash = crypto
      .createHash('md5')
      .update(imageFile.buffer)
      .digest('hex');
    const cacheKey = `ai_scan_result_${imageHash}`;

    // 3. KIỂM TRA REDIS: Bức ảnh này đã quét bao giờ chưa?
    const cachedResult = await this.cacheManager.get(cacheKey);

    let aiPredictionResult;

    if (cachedResult) {
      console.log('Lấy kết quả từ Redis 🚀 (Bỏ qua gọi FastAPI)');
      aiPredictionResult = cachedResult;
    } else {
      // GỌI MẠNG SANG FASTAPI
      try {
        console.log('Đang gửi ảnh sang FastAPI phân tích... 🧠');
        const formData = new FormDataNode();

        formData.append('file', imageFile.buffer, {
          filename: imageFile.originalname,
          contentType: imageFile.mimetype,
          knownLength: imageFile.size,
        });

        const aiResponse = await axios.post(
          'http://localhost:8000/predict',
          formData,
          {
            headers: formData.getHeaders(),
            maxBodyLength: Infinity,
          },
        );

        aiPredictionResult = aiResponse.data;
      } catch (error) {
        console.error('Lỗi kết nối FastAPI:', error.message);
        throw new InternalServerErrorException(
          'Không thể kết nối với hệ thống AI Bác sĩ',
        );
      }

      // KIỂM TRA LỖI LOGIC TỪ AI
      if (!aiPredictionResult || aiPredictionResult.success === false) {
        throw new BadRequestException(
          `AI Server báo lỗi: ${aiPredictionResult?.error || 'Không nhận diện được'}`,
        );
      }

      // LƯU VÀO REDIS
      await this.cacheManager.set(cacheKey, aiPredictionResult, 86400);
    }

    // 4. TRA CỨU DATABASE LẤY "TỦ THUỐC"
    console.log(
      `Đang tra cứu thông tin bệnh: ${aiPredictionResult.yolo_label}`,
    );
    const diseaseInfo = await this.plantsService.findDiseaseByName(
      aiPredictionResult.yolo_label,
    );

    if (!diseaseInfo) {
      throw new NotFoundException(
        `Không tìm thấy thông tin chi tiết cho bệnh: ${aiPredictionResult.yolo_label}`,
      );
    }

    // 5. 🔥 LƯU LỊCH SỬ QUÉT VÀO MONGODB KÈM THEO ẢNH THẬT
    const newScan = new this.scanHistoryModel({
      userId,
      imageUrl: base64Image, // LƯU ẢNH THẬT
      aiPredictions: [
        {
          diseaseId: diseaseInfo._id,
          confidence: aiPredictionResult.confidence,
        },
      ],
      isAccurate: null,
      scannedAt: new Date(),
    });
    await newScan.save();

    // 6. 🔥 TRẢ VỀ DỮ LIỆU CUỐI CÙNG CÓ KÈM ẢNH THẬT
    return {
      scanHistoryId: newScan._id,
      imageUrl: base64Image, // TRẢ ẢNH THẬT CHO FRONTEND HIỂN THỊ
      predictions: [aiPredictionResult],
      topDisease: diseaseInfo,
    };
  }


  async askVirtualAssistant(
    userId: string,
    question: string,
    diseaseLabel?: string,
    sessionId?: string,
  ) {
    try {
      const finalLabel = diseaseLabel || 'Cây trồng';

      let chatDoc: any;

      if (sessionId) {
        // Client truyền sessionId → tiếp tục session đó (kiểm tra userId để tránh truy cập chéo)
        chatDoc = await this.chatHistoryModel.findOne({
          _id: sessionId,
          userId,
        });
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

      // 1.2 Push câu hỏi của User vào mảng messages của session
      chatDoc.messages.push({
        role: 'user',
        content: question,
        timestamp: new Date(),
      });

      // 1.3 Lưu session ngay lập tức (trước khi gọi AI)
      // → Đảm bảo session & câu hỏi không bị mất nếu FastAPI timeout/lỗi
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

      // 1.6 Lưu lần 2 — cập nhật thêm câu trả lời AI vào MongoDB
      await chatDoc.save();

      // 1.6 Trả kết quả về cho App Mobile
      return {
        sessionId: chatDoc._id, // Trả về sessionId để client lưu lại dùng cho lần sau
        question,
        answer: answerContent,
      };
    } catch (error) {
      console.error(
        'LỖI CHI TIẾT TỪ AI:',
        JSON.stringify(error.response?.data, null, 2),
      );
      throw new InternalServerErrorException(
        'Trợ lý ảo đang bận, vui lòng thử lại sau!',
      );
    }
  }

  // 2. TÍNH NĂNG LẤY LỊCH SỬ QUÉT CỦA USER
  async getUserScanHistory(userId: string) {
    // Truy vấn collection scan_histories trong MongoDB
    return this.scanHistoryModel
      .find({ userId: userId })
      .populate({
        // Lệnh populate này cực kỳ mạnh mẽ!
        // Nó tự động chạy sang collection diseases, tìm ID bệnh tương ứng và đắp toàn bộ
        // thông tin (triệu chứng, cách chữa) vào kết quả trả về.
        path: 'aiPredictions.diseaseId',
        select: 'name pathogen type treatments',
      })
      .sort({ scannedAt: -1 }) // Sắp xếp mới nhất lên đầu
      .exec();
  }

  // 3. TÍNH NĂNG LẤY LỊCH SỬ CHAT (Trả về danh sách tất cả sessions của user)
  async getUserChatHistory(userId: string) {
    // Lấy tất cả sessions, chỉ trả metadata (không lấy messages để response nhẹ)
    const sessions = await this.chatHistoryModel
      .find({ userId })
      .select('_id title createdAt updatedAt')
      .sort({ createdAt: -1 }) // Session mới nhất lên đầu
      .exec();

    // Map _id → sessionId để khớp với interface IChatSession của frontend
    return sessions.map((s) => ({
      sessionId: (s._id as any).toString(),
      title: s.title,
      createdAt: (s as any).createdAt,
      updatedAt: (s as any).updatedAt,
    }));
  }

  // 3b. LẤY NỘI DUNG TIN NHẮN CỦA MỘT SESSION CỤ THỂ (khi user bấm vào 1 session)
  async getSessionMessages(userId: string, sessionId: string) {
    const chatDoc = await this.chatHistoryModel
      .findOne({ _id: sessionId, userId }) // Kiểm tra userId để tránh truy cập session của người khác
      .exec();

    if (!chatDoc) {
      return { sessionId, title: null, messages: [] };
    }

    return {
      sessionId: chatDoc._id,
      title: chatDoc.title,
      messages: chatDoc.messages,
    };
  }

  // 4. TÍNH NĂNG UPDATE ĐỘ CHÍNH XÁC (Thu thập Feedback cho AI)
  async updateAccuracyFeedback(scanId: string, isAccurate: boolean) {
    const updatedScan = await this.scanHistoryModel.findByIdAndUpdate(
      scanId,
      { isAccurate: isAccurate },
      { new: true },
    );

    if (!updatedScan) {
      throw new NotFoundException('Không tìm thấy lịch sử quét này');
    }
    return updatedScan;
  }
}

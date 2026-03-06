import { Injectable, InternalServerErrorException, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScanHistory } from '@agri-scan/database';
import { PlantsService } from '../plants/plants.service';
import { ChatHistory } from '@agri-scan/database';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import  FormDataNode from 'form-data';
import axios from 'axios';

@Injectable()
export class AiScanService {
  constructor(
    @InjectModel(ScanHistory.name) private scanHistoryModel: Model<ScanHistory>,
    @InjectModel(ChatHistory.name) private chatHistoryModel: Model<ChatHistory>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly plantsService: PlantsService,
  ) { }

  async processImageAndDiagnose(userId: string, imageFile: Express.Multer.File) {
    const mockImageUrl = 'https://example.com/mock-leaf-image.jpg';

    // 1. TẠO MÃ BĂM (HASH) CHO BỨC ẢNH ĐỂ LÀM CHÌA KHÓA TÌM KIẾM
    const imageHash = crypto.createHash('md5').update(imageFile.buffer).digest('hex');
    const cacheKey = `ai_scan_result_${imageHash}`;

    // 2. KIỂM TRA REDIS: Bức ảnh này đã quét bao giờ chưa?
    const cachedResult = await this.cacheManager.get(cacheKey);

    let aiPredictionResult;

    if (cachedResult) {
      // NẾU CÓ TRONG REDIS: Lấy luôn kết quả, tốc độ siêu tốc (0.01 giây)!
      console.log('Lấy kết quả chẩn đoán từ Redis Cache 🚀');
      aiPredictionResult = cachedResult;
    } else {
      // NẾU CHƯA CÓ: Gửi sang server AI (FastAPI) phân tích
      try {
        console.log('Phân tích ảnh mới bằng FastAPI 🧠');
        const formData = new FormDataNode();
        formData.append('file', imageFile.buffer, imageFile.originalname);

        const aiResponse = await axios.post('http://<host-ip>:8000/predict', formData, {
          headers: formData.getHeaders(),
        });
        aiPredictionResult = aiResponse.data;

        // Lưu kết quả vào Redis để lần sau dùng lại (Cache trong 24 giờ = 86400 giây)
        await this.cacheManager.set(cacheKey, aiPredictionResult, 86400);

      } catch (error) {
        throw new InternalServerErrorException('Không thể kết nối với hệ thống AI Bác sĩ');
      }
    }

    // 3. Chạy ra "Tủ thuốc" (MongoDB) lấy phác đồ điều trị
    const diseaseInfo = await this.plantsService.findDiseaseByName(aiPredictionResult.diseaseName);

    // 4. Lưu vào lịch sử quét (Bệnh án)
    const newScan = new this.scanHistoryModel({
      userId,
      imageUrl: mockImageUrl,
      aiPredictions: [{
        diseaseId: diseaseInfo?._id || null,
        confidence: aiPredictionResult.confidence,
      }],
      isAccurate: null, // Chờ user feedback sau
      scannedAt: new Date(),
    });
    await newScan.save();

    // 5. Trả kết quả trọn gói về cho Mobile/Web hiển thị
    return {
      scanId: newScan._id,
      imageUrl: mockImageUrl,
      prediction: aiPredictionResult,
      treatmentDetails: diseaseInfo,
    };
  }

  async askVirtualAssistant(userId: string, question: string) {
    try {
      // 1.1 Tìm xem user này đã có phiên chat nào trong Database chưa
      let chatDoc = await this.chatHistoryModel.findOne({ userId });

      // Nếu chưa có, tạo một phiên chat mới tinh
      if (!chatDoc) {
        chatDoc = new this.chatHistoryModel({ userId, messages: [] });
      }

      // 1.2 Push câu hỏi của User vào mảng messages
      chatDoc.messages.push({
        role: 'user',
        content: question,
        timestamp: new Date()
      });

      // 1.3 Bắn câu hỏi sang cổng 8000 của team AI
      const aiResponse = await axios.post('http://<host-ip>:8000/chat', {
        question: question
      });

      // Lấy data text do AI trả về
      const answerContent = aiResponse.data.answer || aiResponse.data;

      // 1.4 Push câu trả lời của AI vào mảng messages
      chatDoc.messages.push({
        role: 'ai',
        content: answerContent,
        timestamp: new Date()
      });

      // 1.5 LƯU TOÀN BỘ XUỐNG MONGODB
      await chatDoc.save();

      // 1.6 Trả kết quả về cho App Mobile hiển thị ngay lập tức
      return {
        question: question,
        answer: answerContent,
      };
    } catch (error) {
      console.error('Lỗi khi gọi API Chatbot:', error.message);
      throw new InternalServerErrorException('Trợ lý ảo đang bận, vui lòng thử lại sau!');
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
        select: 'name pathogen type treatments'
      })
      .sort({ scannedAt: -1 }) // Sắp xếp mới nhất lên đầu
      .exec();
  }

  // 3. TÍNH NĂNG LẤY LỊCH SỬ CHAT (Cho màn hình mở lại App)
  async getUserChatHistory(userId: string) {
    const chatDoc = await this.chatHistoryModel.findOne({ userId }).exec();
    // Nếu có data thì trả về mảng tin nhắn, nếu user chưa chat bao giờ thì trả về mảng rỗng []
    return chatDoc ? chatDoc.messages : [];
  }

  // 4. TÍNH NĂNG UPDATE ĐỘ CHÍNH XÁC (Thu thập Feedback cho AI)
  async updateAccuracyFeedback(scanId: string, isAccurate: boolean) {
    const updatedScan = await this.scanHistoryModel.findByIdAndUpdate(
      scanId,
      { isAccurate: isAccurate },
      { new: true }
    );

    if (!updatedScan) {
      throw new NotFoundException('Không tìm thấy lịch sử quét này');
    }
    return updatedScan;
  }


}

import { Injectable, InternalServerErrorException, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
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
  ) { }

  async processImageAndDiagnose(userId: string, imageFile: Express.Multer.File) {
    const mockImageUrl = 'https://example.com/mock-leaf-image.jpg';

    // 1. TẠO MÃ BĂM (HASH) CHO BỨC ẢNH ĐỂ LÀM CHÌA KHÓA TÌM KIẾM
    const imageHash = crypto.createHash('md5').update(imageFile.buffer).digest('hex');
    const cacheKey = `ai_scan_result_${imageHash}`;

    // 2. KIỂM TRA REDIS: Bức ảnh này đã quét bao giờ chưa?
    const cachedResult = await this.cacheManager.get(cacheKey);

    let aiPredictionResult;

    // 1. KIỂM TRA CACHE TRƯỚC
    if (cachedResult) {
      console.log('Lấy kết quả từ Redis 🚀 (Bỏ qua gọi FastAPI)');
      aiPredictionResult = cachedResult;
    } else {
      // 2. GỌI MẠNG (CHỈ TRY-CATCH LỖI KẾT NỐI)
      try {
        console.log('Đang gửi ảnh sang FastAPI phân tích... 🧠');
        const formData = new FormDataNode();
        formData.append('file', imageFile.buffer, imageFile.originalname);

        const aiResponse = await axios.post('http://localhost:8000/predict', formData, {
          headers: formData.getHeaders(),
        });

        aiPredictionResult = aiResponse.data;
      } catch (error) {
        // Lỗi này là do server FastAPI sập hoặc chưa bật
        console.error('Lỗi kết nối FastAPI:', error.message);
        throw new InternalServerErrorException('Không thể kết nối với hệ thống AI Bác sĩ');
      }

      // 3. KIỂM TRA LỖI LOGIC TỪ AI (NẰM NGOÀI TRY-CATCH MẠNG)
      if (!aiPredictionResult || aiPredictionResult.success === false) {
        // Trả về lỗi 400 (Bad Request) nếu AI báo ảnh lỗi (mờ, không phải cây,...)
        throw new BadRequestException(`AI Server báo lỗi: ${aiPredictionResult?.error || 'Không nhận diện được'}`);
      }

      // 4. LƯU VÀO REDIS (Chỉ lưu khi AI đã phân tích thành công)
      await this.cacheManager.set(cacheKey, aiPredictionResult, 86400);
    }

    // ---------------------------------------------------------
    // 5. TIẾP TỤC CHẠY RA TỦ THUỐC (TRA CỨU DATABASE)
    // Bước này nằm NGOÀI "else" vì dù lấy từ Cache hay FastAPI thì đều cần thông tin DB
    // ---------------------------------------------------------
    console.log(`Đang tra cứu thông tin bệnh: ${aiPredictionResult.yolo_label}`);

    const diseaseInfo = await this.plantsService.findDiseaseByName(aiPredictionResult.yolo_label);

    if (!diseaseInfo) {
      // Phòng trường hợp AI đọc ra tên bệnh nhưng DB của bạn chưa cập nhật bệnh đó
      throw new NotFoundException(`Không tìm thấy thông tin chi tiết cho bệnh: ${aiPredictionResult.yolo_label}`);
    }

    // 6. TRẢ KẾT QUẢ CUỐI CÙNG VỀ CHO APP MOBILE
    return {
      prediction: aiPredictionResult, // Chứa nhãn, độ tự tin...
      details: diseaseInfo           // Chứa cách chữa, hình ảnh thuốc, mô tả...
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
      const aiResponse = await axios.post('http://localhost:8000/chat', {
        question: question
      });

      // 🔥 THÊM DÒNG NÀY ĐỂ DEBUG: In ra xem AI thực sự nhả ra cái gì
      console.log('Dữ liệu AI trả về:', aiResponse.data);

      // Lấy data text do AI trả về (Đảm bảo nó luôn là String để Mongoose không bị crash)
      const answerContent = aiResponse.data.answer ? String(aiResponse.data.answer) : JSON.stringify(aiResponse.data);

      // Đảm bảo mảng messages luôn tồn tại để tránh lỗi "Cannot read properties of undefined"
      if (!chatDoc.messages) {
        chatDoc.messages = [];
      }

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

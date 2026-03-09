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
import * as FormData from 'form-data';

@Injectable()
export class AiScanService {
  constructor(
    @InjectModel(ScanHistory.name) private scanHistoryModel: Model<ScanHistory>,
    @InjectModel(ChatHistory.name) private chatHistoryModel: Model<ChatHistory>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly plantsService: PlantsService,
  ) { }

  async processImageAndDiagnose(userId: string, imageFile: Express.Multer.File) {
    // Tạm thời dùng mock URL, sau này bạn thay bằng link upload từ S3/Cloudinary
    const mockImageUrl = 'https://example.com/mock-leaf-image.jpg';

    // 1. TẠO MÃ BĂM (HASH) CHO BỨC ẢNH ĐỂ LÀM CHÌA KHÓA TÌM KIẾM
    const imageHash = crypto.createHash('md5').update(imageFile.buffer).digest('hex');
    const cacheKey = `ai_scan_result_${imageHash}`;

    // 2. KIỂM TRA REDIS: Bức ảnh này đã quét bao giờ chưa?
    const cachedResult = await this.cacheManager.get(cacheKey);

    let aiPredictionResult;

    if (cachedResult) {
      console.log('Lấy kết quả từ Redis 🚀 (Bỏ qua gọi FastAPI)');
      aiPredictionResult = cachedResult;
    } else {
      // GỌI MẠNG SANG FASTAPI
      try {
        console.log('Đang gửi ảnh sang FastAPI phân tích... 🧠');
        const formData = new FormDataNode(); // Lưu ý: Đảm bảo bạn đang dùng đúng thư viện 'form-data'

        // 🔥 FIX LỖI CONFIDENCE 0.00 Ở ĐÂY: Thêm đầy đủ thông tin contentType và size
        formData.append('file', imageFile.buffer, {
          filename: imageFile.originalname,
          contentType: imageFile.mimetype,
          knownLength: imageFile.size,
        });

        const aiResponse = await axios.post('http://localhost:8000/predict', formData, {
          headers: formData.getHeaders(),
          maxBodyLength: Infinity, // Bắt buộc phải có để không bị nghẽn khi file ảnh nặng
        });

        aiPredictionResult = aiResponse.data;
      } catch (error) {
        console.error('Lỗi kết nối FastAPI:', error.message);
        throw new InternalServerErrorException('Không thể kết nối với hệ thống AI Bác sĩ');
      }

      // 3. KIỂM TRA LỖI LOGIC TỪ AI
      if (!aiPredictionResult || aiPredictionResult.success === false) {
        throw new BadRequestException(`AI Server báo lỗi: ${aiPredictionResult?.error || 'Không nhận diện được'}`);
      }

      // 4. LƯU VÀO REDIS (Chỉ lưu khi AI tự tin > 0.5 và không bị lỗi)
      await this.cacheManager.set(cacheKey, aiPredictionResult, 86400); // Lưu 1 ngày
    }

    // 5. TRA CỨU DATABASE LẤY "TỦ THUỐC"
    console.log(`Đang tra cứu thông tin bệnh: ${aiPredictionResult.yolo_label}`);
    const diseaseInfo = await this.plantsService.findDiseaseByName(aiPredictionResult.yolo_label);

    if (!diseaseInfo) {
      throw new NotFoundException(`Không tìm thấy thông tin chi tiết cho bệnh: ${aiPredictionResult.yolo_label}`);
    }

    // 6. 🔥 THIẾU SÓT: Bổ sung bước lưu Lịch sử quét vào MongoDB 
    // (Bắt buộc phải có để App Mobile gọi API getScanHistory hiển thị lại)
    const newScan = new this.scanHistoryModel({
      userId,
      imageUrl: mockImageUrl,
      aiPredictions: [{
        diseaseId: diseaseInfo._id,
        confidence: aiPredictionResult.confidence,
      }],
      isAccurate: null,
      scannedAt: new Date(),
    });
    await newScan.save();

    // 7. TRẢ KẾT QUẢ CUỐI CÙNG VỀ CHO APP MOBILE (Khớp với Interface IScanResult)
    return {
      scanHistoryId: newScan._id, // Đã đổi tên biến để khớp với interface IScanResult của bạn
      imageUrl: mockImageUrl,
      predictions: [aiPredictionResult], // Trả về dạng mảng theo IScanResult
      topDisease: diseaseInfo
    };
  }
 async askVirtualAssistant(userId: string, question: string, diseaseLabel: string = 'Cây trồng') {

    try {
      // 1.1 Tìm session theo sessionId + userId
      // Nếu không có sessionId hoặc không tìm thấy → tự động tạo session mới
      let chatDoc = sessionId
        ? await this.chatHistoryModel.findOne({ _id: sessionId, userId })
        : null;

      if (!chatDoc) {
        // Lấy tối đa 50 ký tự đầu của câu hỏi làm title, tránh title quá dài
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
        timestamp: new Date()
      });

   // 1.3 Bắn câu hỏi sang cổng 8000 của team AI
      const aiResponse = await axios.post('http://localhost:8000/chat', {
        label: "Cây trồng",  
        prompt: question,
      });

      console.log('Dữ liệu AI trả về:', aiResponse.data);


      // Lấy data text do AI trả về
      const answerContent = aiResponse.data.answer ? String(aiResponse.data.answer) : JSON.stringify(aiResponse.data);

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

      // 1.6 Trả kết quả về cho App Mobile
      return {
        sessionId: chatDoc._id, // Trả về sessionId để client lưu lại dùng cho lần sau
        question,
        answer: answerContent,
      };
 }catch (error) {
      // Dòng này sẽ in ra chi tiết FastAPI đang đòi cái gì:
      console.error('LỖI CHI TIẾT TỪ AI:', JSON.stringify(error.response?.data, null, 2));
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
      { new: true }
    );

    if (!updatedScan) {
      throw new NotFoundException('Không tìm thấy lịch sử quét này');
    }
    return updatedScan;
  }


}

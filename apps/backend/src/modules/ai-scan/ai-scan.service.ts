import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScanHistory } from '@agri-scan/database';
import { PlantsService } from '../plants/plants.service'; // Chuyên gia lấy thuốc
import { ChatHistory } from '@agri-scan/database';
import axios from 'axios';

@Injectable()
export class AiScanService {
  constructor(
    @InjectModel(ScanHistory.name) private scanHistoryModel: Model<ScanHistory>,
    @InjectModel(ChatHistory.name) private chatHistoryModel: Model<ChatHistory>,
    private readonly plantsService: PlantsService,
  ) {}

  async processImageAndDiagnose(userId: string, imageFile: Express.Multer.File) {
    // 1. (Mock) Giả lập upload ảnh lên Cloud (S3/Firebase) và lấy URL
    const mockImageUrl = 'https://example.com/mock-leaf-image.jpg';

    // 2. (Mock) Giả lập gọi API sang server AI của team bạn (Delay 2 giây cho giống thật)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const mockAiPrediction = { diseaseName: 'Bệnh Đốm Vòng (Early Blight)', confidence: 0.95 };

    // 3. Chạy ra "Tủ thuốc" (MongoDB) lấy phác đồ điều trị
    const diseaseInfo = await this.plantsService.findDiseaseByName(mockAiPrediction.diseaseName);

    // 4. Lưu vào lịch sử quét (Bệnh án)
    const newScan = new this.scanHistoryModel({
      userId,
      imageUrl: mockImageUrl,
      aiPredictions: [{
        diseaseId: diseaseInfo?._id || null,
        confidence: mockAiPrediction.confidence,
      }],
      isAccurate: null, // Chờ user feedback sau
      scannedAt: new Date(),
    });
    await newScan.save();

    // 5. Trả kết quả trọn gói về cho Mobile/Web hiển thị
    return {
      scanId: newScan._id,
      imageUrl: mockImageUrl,
      prediction: mockAiPrediction,
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

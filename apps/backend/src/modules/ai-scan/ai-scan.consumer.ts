import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ScanHistory, ChatHistory } from '@agri-scan/database';

/**
 * Consumer lắng nghe RabbitMQ queue.
 * Nhận message → gọi Python AI Service → cập nhật kết quả vào MongoDB.
 * Redis cache (CACHE_MANAGER) vẫn dùng bình thường ở AiScanService, không đụng vào đây.
 */
@Controller()
export class AiScanConsumer {
  private readonly logger = new Logger(AiScanConsumer.name);

  constructor(
    @InjectModel(ScanHistory.name) private scanHistoryModel: Model<ScanHistory>,
    @InjectModel(ChatHistory.name) private chatHistoryModel: Model<ChatHistory>,
    private readonly configService: ConfigService,
  ) {}

  private get aiServiceUrl(): string {
    // Trong Docker dùng tên service, local dev dùng localhost
    return this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
  }

  // --------------------------------------------------
  // CONSUMER 1: Xử lý scan ảnh từ scan_queue
  // --------------------------------------------------
  @EventPattern('scan.image.requested')
  async handleScanImage(
    @Payload() data: { scanId: string; userId: string; imageUrl: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(`[SCAN] Nhận scanId: ${data.scanId}`);

    try {
      // Cập nhật status → PROCESSING
      await this.scanHistoryModel.findByIdAndUpdate(data.scanId, {
        $set: { status: 'PROCESSING' },
      });

      // Tải ảnh từ URL về buffer
      const imgRes = await axios.get(data.imageUrl, {
        responseType: 'arraybuffer',
        timeout: 15000,
      });

      // Gửi sang Python /predict dạng multipart/form-data
      const FormData = (await import('form-data')).default;
      const form = new FormData();
      form.append('file', Buffer.from(imgRes.data), {
        filename: 'plant.jpg',
        contentType: 'image/jpeg',
      });

      const aiRes = await axios.post(`${this.aiServiceUrl}/predict`, form, {
        headers: form.getHeaders(),
        timeout: 60000,
      });

      const result = aiRes.data;

      if (!result.success) {
        await this.scanHistoryModel.findByIdAndUpdate(data.scanId, {
          $set: {
            status: 'FAILED',
            errorMessage: result.error || 'Không nhận diện được, vui lòng chụp rõ hơn.',
          },
        });
      } else {
        await this.scanHistoryModel.findByIdAndUpdate(data.scanId, {
          $set: {
            status: 'COMPLETED',
            aiPredictions: [{ label: result.yolo_label, confidence: result.confidence }],
          },
        });
        this.logger.log(`[SCAN] Xong ${data.scanId} → ${result.yolo_label} (${result.confidence})`);
      }

      channel.ack(originalMsg);
    } catch (err) {
      this.logger.error(`[SCAN] Lỗi scanId: ${data.scanId}`, err.stack);
      await this.scanHistoryModel.findByIdAndUpdate(data.scanId, {
        $set: { status: 'FAILED', errorMessage: 'Hệ thống AI đang bận, vui lòng thử lại.' },
      }).catch(() => {});
      // nack + không requeue tránh vòng lặp lỗi
      channel.nack(originalMsg, false, false);
    }
  }

  // --------------------------------------------------
  // CONSUMER 2: Xử lý chat từ chat_queue
  // --------------------------------------------------
  @EventPattern('chat.message.requested')
  async handleChatMessage(
    @Payload() data: {
      sessionId: string;
      userId: string;
      label: string;
      question: string;
      pendingMessageIndex: number;
    },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(`[CHAT] Nhận sessionId: ${data.sessionId}`);

    try {
      const aiRes = await axios.post(
        `${this.aiServiceUrl}/chat`,
        { label: data.label, prompt: data.question },
        { timeout: 60000 },
      );

      const answerText = aiRes.data.answer
        ? String(aiRes.data.answer)
        : JSON.stringify(aiRes.data);

      // Cập nhật đúng vị trí message trong mảng
      const field = `messages.${data.pendingMessageIndex}`;
      await this.chatHistoryModel.findByIdAndUpdate(data.sessionId, {
        $set: {
          [`${field}.content`]: answerText,
          [`${field}.status`]: 'COMPLETED',
        },
      });

      this.logger.log(`[CHAT] Xong sessionId: ${data.sessionId}`);
      channel.ack(originalMsg);
    } catch (err) {
      this.logger.error(`[CHAT] Lỗi sessionId: ${data.sessionId}`, err.stack);
      const field = `messages.${data.pendingMessageIndex}`;
      await this.chatHistoryModel.findByIdAndUpdate(data.sessionId, {
        $set: {
          [`${field}.content`]: 'Xin lỗi, trợ lý đang bận. Vui lòng thử lại!',
          [`${field}.status`]: 'FAILED',
        },
      }).catch(() => {});
      channel.nack(originalMsg, false, false);
    }
  }
}

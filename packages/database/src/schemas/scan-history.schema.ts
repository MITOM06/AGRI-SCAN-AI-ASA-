import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema.js';
import { Disease } from './disease.schema.js';

export type ScanHistoryDocument = HydratedDocument<ScanHistory>;

@Schema()
class AIPrediction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Disease' })
  diseaseId: Disease;

  @Prop()
  confidence: number; // Độ tin cậy (0.95 = 95%)
}

@Schema({ timestamps: true })
export class ScanHistory {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  imageUrl: string;

  @Prop([AIPrediction])
  aiPredictions: AIPrediction[];

  @Prop({ default: null })
  isAccurate: boolean | null; // null = chưa feedback, true/false = đã feedback

  // BUG FIX: scannedAt bị thiếu trong schema nhưng type IScanHistory có dùng.
  // timestamps: true chỉ tạo createdAt + updatedAt, không tạo scannedAt.
  // → Thêm field này để schema khớp với type.
  // Default = thời điểm tạo document (= lúc scan xong)
  @Prop({ default: () => new Date() })
  scannedAt: Date;
}

export const ScanHistorySchema = SchemaFactory.createForClass(ScanHistory);

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
  confidence: number; // Độ tin cậy (0.95)
}

@Schema({ timestamps: true })
export class ScanHistory {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  imageUrl: string; // Link ảnh đã upload

  @Prop([AIPrediction])
  aiPredictions: AIPrediction[];

  @Prop({ default: false })
  isAccurate: boolean; // Người dùng feedback đúng/sai
}

export const ScanHistorySchema = SchemaFactory.createForClass(ScanHistory);
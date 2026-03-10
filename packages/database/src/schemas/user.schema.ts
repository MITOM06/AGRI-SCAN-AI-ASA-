import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ default: 'FARMER', enum: ['FARMER', 'EXPERT', 'ADMIN'] })
  role: string;

  // 🔥 THÊM MỚI: Quản lý gói cước
  @Prop({ default: 'FREE', enum: ['FREE', 'PREMIUM', 'VIP'] })
  plan: string;

  @Prop({ type: Date, default: null })
  planExpiresAt: Date | null;

  // 🔥 THÊM MỚI: Quản lý bộ đếm theo ngày
  @Prop({ default: 0 })
  dailyImageCount: number;

  @Prop({ default: 0 })
  dailyPromptCount: number;

  @Prop({ type: Date, default: Date.now })
  lastResetDate: Date; // Ngày cuối cùng sử dụng để biết khi nào qua ngày mới
}

export const UserSchema = SchemaFactory.createForClass(User);
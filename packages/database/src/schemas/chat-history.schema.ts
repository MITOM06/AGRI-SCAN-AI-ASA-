import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

// Tạo một interface nhỏ để định nghĩa cấu trúc của 1 tin nhắn
export interface IChatMessage {
  role: 'user' | 'ai'; // Phân biệt ai là người nói
  content: string;     // Nội dung tin nhắn
  timestamp: Date;     // Thời gian nhắn
}

@Schema({ 
  timestamps: true, // Tự động tạo createdAt và updatedAt
  collection: 'chat_histories' // Tên bảng trong MongoDB
})
export class ChatHistory extends Document {
  // Liên kết với bảng users
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId | User;

  // Lưu một mảng các tin nhắn hội thoại
  @Prop({ 
    type: [
      {
        role: { type: String, enum: ['user', 'ai'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ], 
    default: [] 
  })
  messages: IChatMessage[];
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);
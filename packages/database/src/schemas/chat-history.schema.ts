import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

// Định nghĩa cấu trúc của 1 tin nhắn trong hội thoại
export interface IChatMessage {
  role: 'user' | 'ai'; // Phân biệt ai là người nói
  content: string;     // Nội dung tin nhắn
  timestamp: Date;     // Thời gian nhắn
}

// Mỗi document = 1 session hội thoại
// 1 user có nhiều session, 1 session chứa 1 hội thoại
// _id (ObjectId) của mỗi document chính là sessionId - MongoDB tự sinh
@Schema({
  timestamps: true, // Tự động tạo createdAt và updatedAt
  collection: 'chat_histories' // Tên bảng trong MongoDB
})
export class ChatHistory extends Document {
  // Liên kết với bảng users (1 user có nhiều session)
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId: Types.ObjectId | User;

  // Tiêu đề của phiên hội thoại (tự đặt hoặc lấy từ tin nhắn đầu tiên)
  @Prop({ type: String, default: 'Cuộc hội thoại mới' })
  title: string;

  // Lưu một mảng các tin nhắn trong phiên hội thoại này
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

// Index kết hợp: tối ưu truy vấn lấy tất cả sessions của 1 user
ChatHistorySchema.index({ userId: 1, createdAt: -1 });
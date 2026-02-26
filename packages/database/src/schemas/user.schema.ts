import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true }) // Tự động tạo createdAt, updatedAt
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ default: 'FARMER', enum: ['FARMER', 'EXPERT', 'ADMIN'] })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
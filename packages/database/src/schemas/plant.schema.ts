import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Disease } from './disease.schema.js';

export type PlantDocument = HydratedDocument<Plant>;

@Schema({ timestamps: true })
export class Plant {
  @Prop({ required: true })
  commonName: string; // Tên thường gọi (Cà chua)

  @Prop({ required: true })
  scientificName: string; // Tên khoa học

  @Prop()
  family: string; // Họ thực vật

  @Prop()
  description: string;

  @Prop([String])
  images: string[]; // Ảnh minh họa cây khỏe

  // Liên kết với bảng Disease
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Disease' }] })
  diseases: Disease[];
}

export const PlantSchema = SchemaFactory.createForClass(Plant);
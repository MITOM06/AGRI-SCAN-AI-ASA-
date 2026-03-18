import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Plant } from './plant.schema';

export type MyGardenDocument = HydratedDocument<MyGarden>;

// Sub-schema cho từng ngày trong lộ trình
@Schema({ _id: false })
export class DailyTask {
    @Prop({ required: true }) day: number;
    @Prop({ required: true }) date: Date;
    @Prop({ required: true }) weatherContext: string; // Vd: "Mưa to, độ ẩm 90%"
    @Prop({ required: true }) waterAction: string;
    @Prop({ required: true }) fertilizerAction: string;
    @Prop({ required: true }) careAction: string;
    @Prop({ default: false }) isCompleted: boolean; // User check done mỗi ngày
}

@Schema({ timestamps: true, collection: 'my_gardens' })
export class MyGarden {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
    userId: Types.ObjectId | User;

    @Prop({ type: Types.ObjectId, ref: Plant.name, required: true })
    plantId: Types.ObjectId | Plant;

    @Prop({ default: 'Khỏe mạnh' })
    currentCondition: string;

    @Prop({ type: [String], default: [] })
    growthStages: string[];

    @Prop({ default: 0 })
    currentStageIndex: number; 
    @Prop({ default: 0 })
    progressPercentage: number; 

    @Prop({ default: Date.now })
    lastInteractionDate: Date; 
    @Prop({ required: true })
    customName: string; 

    @Prop({ enum: ['FRUIT', 'FLOWER', 'ORNAMENTAL'], required: true })
    plantGroup: string;

    @Prop({ enum: ['HEAL_DISEASE', 'GET_FRUIT', 'GET_FLOWER', 'MAINTAIN'], required: true })
    userGoal: string; // Mục tiêu user chọn

    @Prop({ type: [DailyTask], default: [] })
    careRoadmap: DailyTask[]; // Lộ trình AI trả về lưu thẳng vào đây

    @Prop({ enum: ['IN_PROGRESS', 'COMPLETED', 'FAILED'], default: 'IN_PROGRESS' })
    status: string;
}
export const MyGardenSchema = SchemaFactory.createForClass(MyGarden);
import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MyGarden, MyGardenDocument, Plant, User } from '@agri-scan/database';
import { WeatherService } from '../weather/Weather.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MyGardenService {
  async getUserGarden(userId: string) {
    return this.myGardenModel
      .find({ userId: new Types.ObjectId(userId), status: { $ne: 'FAILED' } })
      .populate('plantId', 'commonName scientificName images category')
      .sort({ lastInteractionDate: -1 })
      .lean()
      .exec();
  }
  private readonly PLAN_LIMITS = { FREE: 0, PREMIUM: 10, VIP: 20 };

  constructor(
    @InjectModel(MyGarden.name) private myGardenModel: Model<MyGardenDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Plant.name) private plantModel: Model<Plant>,
    private readonly weatherService: WeatherService,
    private readonly configService: ConfigService,
  ) { }

  private get aiServiceUrl(): string {
    return this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
  }
  private mapPlantCategoryToWeatherTarget(
    categories: string[]
  ): 'ALL' | 'FRUIT' | 'FLOWER' | 'VEGETABLE' {
    const lower = categories.map(c => c.toLowerCase());
    if (lower.some(c => c.includes('quả') || c.includes('fruit'))) return 'FRUIT';
    if (lower.some(c => c.includes('hoa') || c.includes('flower'))) return 'FLOWER';
    if (lower.some(c => c.includes('rau') || c.includes('vegetable') || c.includes('củ'))) return 'VEGETABLE';
    return 'ALL';
  }
  // ==========================================
  // 1. KIỂM TRA QUYỀN VÀ GIỚI HẠN GÓI CƯỚC
  // ==========================================
  private async validateUserPlan(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new ForbiddenException('Không tìm thấy người dùng.');

    const today = new Date();
    // Nếu gói hết hạn -> Tự động hạ cấp về FREE
    if (user.plan !== 'FREE' && user.planExpiresAt && user.planExpiresAt < today) {
      user.plan = 'FREE';
      user.planExpiresAt = null;
      await user.save();
    }

    const maxPlants = this.PLAN_LIMITS[user.plan as keyof typeof this.PLAN_LIMITS] ?? 0;

    if (maxPlants === 0) {
      throw new ForbiddenException('Tính năng My Garden chỉ dành cho Premium/VIP. Vui lòng nâng cấp!');
    }

    // Đếm số cây đang tồn tại trong vườn (Trừ những cây đã xóa)
    const currentPlantCount = await this.myGardenModel.countDocuments({
      userId,
      status: { $in: ['IN_PROGRESS', 'COMPLETED'] },
    });

    return { user, maxPlants, currentPlantCount };
  }

  // ==========================================
  // 2. THÊM CÂY VÀO VƯỜN (TẠO LỘ TRÌNH TỪ AI)
  // ==========================================
  async addPlantToGarden(dto: {
    userId: string;
    plantId: string;
    customName?: string;
    userGoal: string;
    diseaseName?: string;
    lat: number;
    lon: number;
  }) {
    // 2.1. Kiểm tra gói cước
    const { user, maxPlants, currentPlantCount } = await this.validateUserPlan(dto.userId);
    if (currentPlantCount >= maxPlants) {
      throw new BadRequestException(`Gói ${user.plan} chỉ cho trồng tối đa ${maxPlants} cây. Vui lòng xóa bớt cây cũ.`);
    }

    const plant = await this.plantModel.findById(dto.plantId);
    if (!plant) throw new NotFoundException('Không tìm thấy thông tin cây trồng.');

    // 2.2. Lấy thời tiết 7 ngày tới
    let weatherForecastStr = '';

    try {
      const weatherCategory = this.mapPlantCategoryToWeatherTarget(plant.category);
      const weatherData = await this.weatherService.getWeatherAndAdvice(dto.lat, dto.lon, weatherCategory);
      const dailySummaries = weatherData.weatherData.daily.slice(0, 7).map(
        (day, idx) => `Ngày ${idx + 1}: ${day.summary}, ${day.tempMin}-${day.tempMax}°C`
      );
      weatherForecastStr = dailySummaries.join(' | ');
    } catch {
      weatherForecastStr = 'Không có dữ liệu thời tiết.';
    }

    // 2.3. Gọi LLM tạo lộ trình & Thanh tiến trình
    const conditionStr = dto.diseaseName && dto.diseaseName !== 'Khỏe mạnh'
      ? `Đang mắc bệnh: ${dto.diseaseName}. Ưu tiên chữa bệnh.`
      : `Đang khỏe mạnh.`;

    const systemPrompt = `
      Tạo lộ trình chăm sóc cây bằng JSON nghiêm ngặt.
      Cây: ${plant.commonName}. Mục tiêu: ${dto.userGoal}. Tình trạng: ${conditionStr}. Thời tiết: ${weatherForecastStr}.
      
      Yêu cầu trả về JSON chuẩn xác:
      {
        "estimated_days": 7,
        "growth_stages": ["Cây non", "Phát triển", "Ra hoa", "Đậu quả", "Thu hoạch"],
        "current_stage_index": 3,
        "daily_tasks": [
          { "day": 1, "weatherContext": "...", "waterAction": "...", "fertilizerAction": "...", "careAction": "..." }
        ]
      }
    `;

    let aiData;
    try {
      const resp = await axios.post(`${this.aiServiceUrl}/plan_garden`, { prompt: systemPrompt });
      const answerText = typeof resp.data === 'string' ? resp.data : resp.data.answer;
      aiData = JSON.parse(answerText.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (error) {
      throw new InternalServerErrorException('AI đang bận, không thể lập lộ trình.');
    }

    // 2.4. Lưu DB
    const newGardenPlant = new this.myGardenModel({
      userId: new Types.ObjectId(dto.userId),
      plantId: new Types.ObjectId(dto.plantId),
      customName: dto.customName || plant.commonName,
      plantGroup: plant.category.includes('Cây ăn quả') ? 'FRUIT' : (plant.category.includes('Cây hoa') ? 'FLOWER' : 'ORNAMENTAL'),
      userGoal: dto.userGoal,
      currentCondition: dto.diseaseName || 'Khỏe mạnh',
      growthStages: aiData.growth_stages || ['Giai đoạn 1', 'Giai đoạn 2', 'Giai đoạn 3'],
      currentStageIndex: aiData.current_stage_index || 0,
      progressPercentage: 0,
      lastInteractionDate: new Date(),
      careRoadmap: aiData.daily_tasks.map(task => ({
        ...task,
        date: new Date(new Date().getTime() + (task.day - 1) * 24 * 60 * 60 * 1000),
        isCompleted: false
      })),
    });

    await newGardenPlant.save();
    return { message: 'Thêm cây thành công!', data: newGardenPlant };
  }

  // ==========================================
  // 3. CHECK-IN HẰNG NGÀY & XỬ LÝ "BỎ BÊ 3 NGÀY"
  // ==========================================
  async dailyCheckIn(gardenId: string, userId: string, currentDay: number) {
    // Check quyền truy cập
    await this.validateUserPlan(userId);

    const gardenPlant = await this.myGardenModel.findOne({ _id: gardenId, userId });
    if (!gardenPlant) throw new NotFoundException('Không tìm thấy cây trong vườn.');

    const today = new Date();
    const lastInteraction = new Date(gardenPlant.lastInteractionDate);

    // Tính số ngày bỏ bê (khoảng cách giữa hôm nay và lần tương tác cuối)
    const diffTime = Math.abs(today.getTime() - lastInteraction.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // NẾU BỎ BÊ QUÁ 3 NGÀY -> Bắn tín hiệu về Client để yêu cầu chụp ảnh lại
    if (diffDays > 3) {
      return {
        requireRegeneration: true,
        message: 'Bạn đã không cập nhật tình trạng cây quá 3 ngày. Lộ trình cũ không còn chính xác. Vui lòng chụp ảnh mới để AI đánh giá lại từ đầu.',
      };
    }

    // NẾU BÌNH THƯỜNG -> Đánh dấu hoàn thành task hôm nay
    const taskIndex = gardenPlant.careRoadmap.findIndex(t => t.day === currentDay);
    if (taskIndex !== -1) {
      gardenPlant.careRoadmap[taskIndex].isCompleted = true;
    }

    // Tính % hoàn thành
    const completedTasks = gardenPlant.careRoadmap.filter(t => t.isCompleted).length;
    const totalTasks = gardenPlant.careRoadmap.length;
    gardenPlant.progressPercentage = Math.round((completedTasks / totalTasks) * 100);

    // Cập nhật ngày tương tác
    gardenPlant.lastInteractionDate = today;

    // Nếu đạt 100% -> Hoàn thành
    if (gardenPlant.progressPercentage >= 100) {
      gardenPlant.status = 'COMPLETED';
    }

    await gardenPlant.save();

    return {
      requireRegeneration: false,
      message: 'Check-in thành công! Bạn đang làm rất tốt.',
      progressPercentage: gardenPlant.progressPercentage,
      status: gardenPlant.status
    };
  }

  // ==========================================
  // 4. HỦY/XÓA CÂY (TRẢ LẠI SLOT CHO USER)
  // ==========================================
  async removePlantFromGarden(gardenId: string, userId: string) {
    const deletedPlant = await this.myGardenModel.findOneAndDelete({ _id: gardenId, userId });
    if (!deletedPlant) throw new NotFoundException('Không tìm thấy cây này trong vườn.');
    return { message: 'Đã xóa cây. Bạn đã nhận lại 1 vị trí trống trong vườn.' };
  }
}
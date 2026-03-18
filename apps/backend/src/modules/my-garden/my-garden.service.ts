import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MyGarden, MyGardenDocument, User } from '@agri-scan/database'; // BỎ import Plant
import { WeatherService } from '../weather/Weather.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MyGardenService {
  private readonly PLAN_LIMITS = { FREE: 0, PREMIUM: 10, VIP: 20 };

  constructor(
    @InjectModel(MyGarden.name) private myGardenModel: Model<MyGardenDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly weatherService: WeatherService,
    private readonly configService: ConfigService,
  ) {}

  private get aiServiceUrl(): string {
    return this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
  }

  async getUserGarden(userId: string) {
    // Không còn populate 'plantId' nữa
    return this.myGardenModel
      .find({ userId: new Types.ObjectId(userId), status: { $ne: 'FAILED' } })
      .sort({ lastInteractionDate: -1 })
      .lean()
      .exec();
  }

  private async validateUserPlan(userId: string) {
    // ... Giữ nguyên logic cũ của bạn ở đây ...
    const user = await this.userModel.findById(userId);
    if (!user) throw new ForbiddenException('Không tìm thấy người dùng.');

    const today = new Date();
    if (user.plan !== 'FREE' && user.planExpiresAt && user.planExpiresAt < today) {
      user.plan = 'FREE';
      user.planExpiresAt = null;
      await user.save();
    }

    const maxPlants = this.PLAN_LIMITS[user.plan as keyof typeof this.PLAN_LIMITS] ?? 0;
    if (maxPlants === 0) {
      throw new ForbiddenException('Tính năng My Garden chỉ dành cho Premium/VIP.');
    }

    const currentPlantCount = await this.myGardenModel.countDocuments({
      userId: new Types.ObjectId(userId),
      status: { $in: ['IN_PROGRESS', 'COMPLETED'] },
    });

    return { user, maxPlants, currentPlantCount };
  }

  async addPlantToGarden(dto: {
    userId: string;
    label: string;
    imageUrl?: string;
    customName?: string;
    userGoal: string;
    lat: number;
    lon: number;
  }) {
    // 1. Kiểm tra plan
    const { user, maxPlants, currentPlantCount } = await this.validateUserPlan(dto.userId);
    if (currentPlantCount >= maxPlants) {
      throw new BadRequestException(`Gói ${user.plan} chỉ cho trồng tối đa ${maxPlants} cây.`);
    }

    // 2. Lấy thời tiết cơ bản để truyền cho AI
    let weatherForecastStr = '';
    try {
      const weatherData = await this.weatherService.getWeatherAndAdvice(dto.lat, dto.lon, 'ALL');
      const dailySummaries = weatherData.weatherData.daily.slice(0, 7).map(
        (day, idx) => `Ngày ${idx + 1}: ${day.summary}, ${day.tempMin}-${day.tempMax}°C`
      );
      weatherForecastStr = dailySummaries.join(' | ');
    } catch {
      weatherForecastStr = 'Không có dữ liệu thời tiết.';
    }

    // 3. Gọi FastAPI AI Service mới
    let aiData;
    try {
      const aiPayload = {
        label: dto.label,
        prompt: `Mục tiêu người dùng: ${dto.userGoal}. Thời tiết 7 ngày tới: ${weatherForecastStr}. Hãy lập lộ trình phù hợp.`
      };
      const resp = await axios.post(`${this.aiServiceUrl}/plant_garden`, aiPayload);
      aiData = resp.data; // FastAPI đã trả về JSON chuẩn
    } catch (error) {
      throw new InternalServerErrorException('AI đang bận hoặc không thể phân tích cây này.');
    }

    // Phân loại kết quả là cây khỏe (có thông tin thực vật) hay cây bệnh
    const isHealthy = !!aiData.scientificName; 
    const currentCondition = isHealthy ? 'Khỏe mạnh' : `Đang điều trị: ${dto.label}`;

    // Tách riêng plantInfo nếu có
    const plantInfo = isHealthy ? {
      commonName: aiData.commonName,
      scientificName: aiData.scientificName,
      family: aiData.family,
      description: aiData.description,
      uses: aiData.uses,
      care: aiData.care,
      category: aiData.category,
      plantGroup: aiData.plantGroup,
    } : null;

    // 4. Lưu vào MongoDB
    const newGardenPlant = new this.myGardenModel({
      userId: new Types.ObjectId(dto.userId),
      aiLabel: dto.label,
      imageUrl: dto.imageUrl || (aiData.images && aiData.images.length > 0 ? aiData.images[0] : ''),
      plantInfo: plantInfo,
      customName: dto.customName || (isHealthy ? aiData.commonName : dto.label),
      userGoal: dto.userGoal,
      currentCondition: currentCondition,
      roadmapSummary: aiData.roadmap_summary || '',
      growthStages: aiData.growth_stages || ['Giai đoạn 1', 'Giai đoạn 2', 'Giai đoạn 3'],
      currentStageIndex: aiData.current_stage_index || 1,
      progressPercentage: 0,
      lastInteractionDate: new Date(),
      careRoadmap: aiData.daily_tasks.map(task => ({
        ...task,
        date: new Date(new Date().getTime() + (task.day - 1) * 24 * 60 * 60 * 1000),
        isCompleted: false
      })),
    });

    const populatedPlant = await newGardenPlant.populate('plantId', 'commonName scientificName images category');

    return { message: 'Thêm cây thành công!', data: populatedPlant };
  }

  // ==========================================
  // 3. CHECK-IN HẰNG NGÀY & XỬ LÝ "BỎ BÊ 3 NGÀY"
  // ==========================================
  async dailyCheckIn(gardenId: string, userId: string, currentDay: number) {
    // Check quyền truy cập
    await this.validateUserPlan(userId);

    const gardenPlant = await this.myGardenModel.findOne({
      _id: gardenId,
      userId: new Types.ObjectId(userId),
    });
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
    const deletedPlant = await this.myGardenModel.findOneAndDelete({
      _id: gardenId,
      userId: new Types.ObjectId(userId),
    });
    if (!deletedPlant) throw new NotFoundException('Không tìm thấy cây này trong vườn.');
    return { message: 'Đã xóa cây. Bạn đã nhận lại 1 vị trí trống trong vườn.' };
  }
}
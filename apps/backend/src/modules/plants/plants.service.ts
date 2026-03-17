import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plant, Disease } from '@agri-scan/database';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class PlantsService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Plant.name) private plantModel: Model<Plant>,
    @InjectModel(Disease.name) private diseaseModel: Model<Disease>,
  ) { }

  async onApplicationBootstrap() {
    const count = await this.plantModel.countDocuments();
    if (count > 0) {
      console.log(`🌱 Đã có ${count} cây trong DB, bỏ qua seed tự động.`);
      return;
    }
    console.log('🌱 DB trống, đang seed dữ liệu...');
    try {
      const result = await this.seedData();
      console.log(result.message);
    } catch (error) {
      console.error('⚠️ Seed thất bại:', (error as Error).message);
    }
  }

  // 1. Lấy danh sách cây (Chỉ lấy APPROVED hoặc data cũ chưa có trường status)
  async findAllPlants() {
    return this.plantModel.find({
      $or: [{ status: 'APPROVED' }, { status: { $exists: false } }]
    }).select('commonName scientificName images status').exec();
  }

  // 2. Lấy chi tiết 1 loại cây
  async findPlantById(id: string) {
    const plant = await this.plantModel.findById(id).populate('diseases').exec();
    if (!plant) {
      throw new NotFoundException(`Không tìm thấy cây với ID: ${id}`);
    }
    return plant;
  }

  // 3. Tìm bệnh theo tên
  async findDiseaseByName(diseaseName: string) {
    return this.diseaseModel.findOne({ name: diseaseName }).exec();
  }

  // 🔥 4. THÊM MỚI: Xử lý người dùng đóng góp dữ liệu cây trồng
  async contributePlant(plantData: any) {
    const newPlant = new this.plantModel({
      ...plantData,
      status: 'PENDING' // Luôn ép về PENDING khi user gửi
    });
    return newPlant.save();
  }

  // 5. Bơm dữ liệu
  // 5. Bơm dữ liệu (Cây Trồng + Từ điển Bệnh + Nối bệnh vào cây)
  async seedData() {
    try {
      // 1. ĐỌC FILE CÂY TRỒNG
      const plantsPath = path.join(process.cwd(), '..', 'ai-service', 'data', 'plants_data.json');
      const plantsRawData = fs.readFileSync(plantsPath, 'utf-8');
      const plantsList = JSON.parse(plantsRawData);

      // 🔥 FIX LỖI TYPE 'never': Khai báo rõ kiểu dữ liệu là mảng chứa bất kỳ object nào (any[])
      const plantDocs: any[] = [];

      for (const plantData of plantsList) {
        const plant = await this.plantModel.findOneAndUpdate(
          { scientificName: plantData.scientificName },
          plantData,
          { upsert: true, new: true }
        );

        // 🔥 Bổ sung kiểm tra plant tồn tại để tránh lỗi strict null check
        if (plant) {
          plant.diseases = []; // Reset mảng bệnh trước khi nối lại
          await plant.save();
          plantDocs.push(plant);
        }
      }

      // 2. ĐỌC FILE BỆNH TỪ TEAM AI
      const diseasePath = path.join(process.cwd(), '..', 'ai-service', 'data', 'plant_knowledge.json');
      const diseaseRawData = fs.readFileSync(diseasePath, 'utf-8');
      const plantKnowledge: Record<string, any> = JSON.parse(diseaseRawData);

      let diseaseCount = 0;

      for (const [yoloLabel, info] of Object.entries(plantKnowledge)) {
        const isHealthy = info['Status'] === 'Healthy' || info['Status'] === 'Normal';

        const mappedData = isHealthy ? {
          name: yoloLabel,
          commonName: 'Cây khỏe mạnh',
          description: info['Analysis'] || info['Detail'] || 'Cây phát triển bình thường.',
          type: 'HEALTHY',
          treatments: { biological: [], chemical: [] },
          status: 'APPROVED'
        } : {
          name: yoloLabel,
          commonName: info['LOAI_BENH'],
          description: `**Đặc điểm:** ${info['DAC_DIEM']}\n\n**Nguyên nhân:** ${info['NGUYEN_NHAN']}\n\n**Lưu ý:** ${info['LUU_Y']}`,
          type: 'DISEASE',
          treatments: {
            biological: [info['GIAI_PHAP']],
            chemical: [info['LIEU_TRINH_VA_THUOC']?.['Hoat_chat_dac_tri'], info['LIEU_TRINH_VA_THUOC']?.['Lo_trinh_14_ngay']].filter(Boolean),
          },
          status: 'APPROVED'
        };


        const savedDisease = await this.diseaseModel.findOneAndUpdate(
          { name: yoloLabel },
          mappedData,
          { upsert: true, new: true }
        );
        diseaseCount++;

        // 3. THUẬT TOÁN NỐI BỆNH VÀO ĐÚNG CÂY
        const tenCayString = info['TEN_CAY'] || '';
        const match = tenCayString.match(/\((.*?)\)/); // Trích xuất tên khoa học trong ngoặc tròn

        if (match && match[1]) {
          const targetPlant = plantDocs.find(p => p.scientificName === match[1]);
          if (targetPlant && !isHealthy) { // Không nhét "Cây khỏe mạnh" vào danh sách bệnh
            targetPlant.diseases.push(savedDisease._id);
            await targetPlant.save();
          }
        }
      }

      return { message: `Đã bơm thành công ${plantDocs.length} cây và ${diseaseCount} bệnh vào Database! 🌳` };
    } catch (error) {
      console.error('Lỗi khi bơm dữ liệu:', error);
      throw new Error('Bơm dữ liệu thất bại, vui lòng kiểm tra lại đường dẫn file JSON.');
    }
  }
}
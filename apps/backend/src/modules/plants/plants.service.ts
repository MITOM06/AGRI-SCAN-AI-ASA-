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
    console.log('🌱 Đang kiểm tra và đồng bộ dữ liệu Tủ thuốc từ team AI...');
    try {
      const result = await this.seedData();
      console.log(result.message);
    } catch (error) {
      console.error('⚠️ Bỏ qua đồng bộ dữ liệu:', (error as Error).message);
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
  async seedData() {
    try {
      const jsonPath = path.join(process.cwd(), '..', 'ai-service', 'data', 'plant_knowledge.json');
      const rawData = fs.readFileSync(jsonPath, 'utf-8');
      const plantKnowledge: Record<string, any> = JSON.parse(rawData);

      let count = 0;

      for (const [yoloLabel, info] of Object.entries(plantKnowledge)) {
        let mappedData: any = {};

        if (info['Status'] === 'Healthy' || info['Status'] === 'Normal') {
          mappedData = {
            name: yoloLabel,
            commonName: 'Cây khỏe mạnh',
            description: info['Analysis'] || info['Detail'] || 'Cây phát triển bình thường.',
            type: 'HEALTHY',
            treatments: { biological: [], chemical: [] },
            status: 'APPROVED' // 🔥 ÉP CHUẨN: Data từ AI mặc định được duyệt
          };
        } else {
          mappedData = {
            name: yoloLabel,
            commonName: info['LOAI_BENH'],
            description: `**Đặc điểm:** ${info['DAC_DIEM']}\n\n**Nguyên nhân:** ${info['NGUYEN_NHAN']}\n\n**Lưu ý:** ${info['LUU_Y']}`,
            type: 'DISEASE',
            treatments: {
              biological: [info['GIAI_PHAP']],
              chemical: [
                info['LIEU_TRINH_VA_THUOC']?.['Hoat_chat_dac_tri'],
                info['LIEU_TRINH_VA_THUOC']?.['Lo_trinh_14_ngay'],
              ].filter(Boolean),
            },
            status: 'APPROVED' // 🔥 ÉP CHUẨN: Data từ AI mặc định được duyệt
          };
        }

        await this.diseaseModel.findOneAndUpdate(
          { name: yoloLabel },
          mappedData,
          { upsert: true, new: true }
        );
        count++;
      }

      return { message: `Đã bơm thành công ${count} nhãn bệnh vào Tủ thuốc! 💉` };
    } catch (error) {
      console.error('Lỗi khi bơm dữ liệu:', error);
      throw new Error('Bơm dữ liệu thất bại, vui lòng kiểm tra lại đường dẫn file JSON.');
    }
  }
}
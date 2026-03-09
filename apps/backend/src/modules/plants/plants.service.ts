import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plant, Disease } from '@agri-scan/database'; // Gộp import cho gọn
import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class PlantsService {
  constructor(
    @InjectModel(Plant.name) private plantModel: Model<Plant>,
    @InjectModel(Disease.name) private diseaseModel: Model<Disease>,
  ) { }

  // 1. Lấy danh sách tất cả các loại cây (phục vụ Từ điển)
  async findAllPlants() {
    return this.plantModel.find().select('commonName scientificName images').exec();
  }
  async onApplicationBootstrap() {
    console.log('🌱 Đang kiểm tra và đồng bộ dữ liệu Tủ thuốc từ team AI...');
    try {
      const result = await this.seedData();
      console.log(result.message);
    } catch (error) {
      console.error('⚠️ Bỏ qua đồng bộ dữ liệu:', error.message);
    }
  }
  // 2. Lấy chi tiết 1 loại cây (kèm theo các bệnh thường gặp)
  async findPlantById(id: string) {
    const plant = await this.plantModel.findById(id).populate('diseases').exec();
    if (!plant) {
      throw new NotFoundException(`Không tìm thấy cây với ID: ${id}`);
    }
    return plant;
  }

  // 3. (Chuẩn bị cho AI Scan) - Tìm bệnh theo tên
  async findDiseaseByName(diseaseName: string) {
    return this.diseaseModel.findOne({ name: diseaseName }).exec();
  }

  // 🔥 HÀM BƠM DỮ LIỆU ĐÃ ĐƯỢC FIX LỖI TYPESCRIPT
  async seedData() {
    try {
      // 1. Trỏ đường dẫn tới file JSON của team AI
      const jsonPath = path.join(process.cwd(), '..', 'ai-service', 'data', 'plant_knowledge.json');
      const rawData = fs.readFileSync(jsonPath, 'utf-8');

      // 🔥 FIX TẠI ĐÂY: Khai báo rõ kiểu Record<string, any> để TS ngừng bắt bẻ biến 'info'
      const plantKnowledge: Record<string, any> = JSON.parse(rawData);

      let count = 0;

      // 2. Duyệt qua từng bệnh trong file JSON
      for (const [yoloLabel, info] of Object.entries(plantKnowledge)) {
        let mappedData: any = {};

        // Xử lý case: Cây khỏe mạnh
        if (info['Status'] === 'Healthy' || info['Status'] === 'Normal') {
          mappedData = {
            name: yoloLabel,
            commonName: 'Cây khỏe mạnh',
            description: info['Analysis'] || info['Detail'] || 'Cây phát triển bình thường.',
            type: 'HEALTHY',
            treatments: { biological: [], chemical: [] },
          };
        }
        // Xử lý case: Cây bị bệnh
        else {
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
              ].filter(Boolean), // Lọc bỏ giá trị undefined/null
            },
          };
        }

        // 3. Lưu vào MongoDB (Dùng upsert)
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
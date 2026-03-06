import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plant } from '@agri-scan/database';
import { Disease } from '@agri-scan/database';

@Injectable()
export class PlantsService {
  constructor(
    @InjectModel(Plant.name) private plantModel: Model<Plant>,
    @InjectModel(Disease.name) private diseaseModel: Model<Disease>,
  ) {}

  // 1. Lấy danh sách tất cả các loại cây (phục vụ Từ điển)
  async findAllPlants() {
    return this.plantModel.find().select('commonName scientificName images').exec();
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
}
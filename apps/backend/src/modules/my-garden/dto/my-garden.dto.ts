import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AddPlantToGardenDto {
  @IsString()
  @IsNotEmpty()
  plantId: string;

  @IsString()
  @IsOptional()
  customName?: string;

  @IsString()
  @IsNotEmpty()
  userGoal: string; // VD: 'GET_FRUIT', 'HEAL_DISEASE'

  @IsString()
  @IsOptional()
  diseaseName?: string; // Tên bệnh từ kết quả AI quét

  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lon: number;
}

export class DailyCheckInDto {
  @IsNumber()
  @IsNotEmpty()
  currentDay: number;

  @IsString()
  @IsOptional()
  imageUrl?: string; // Ảnh người dùng chụp hằng ngày (nếu có)
}
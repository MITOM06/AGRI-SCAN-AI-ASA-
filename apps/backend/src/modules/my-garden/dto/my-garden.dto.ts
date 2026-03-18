import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AddPlantToGardenDto {
  @IsString()
  @IsNotEmpty()
  label: string; // Tên cây hoặc bệnh từ AI (VD: "Hoa hồng", "Bệnh đốm lá cà chua")

  @IsString()
  @IsOptional()
  imageUrl?: string; // Ảnh người dùng vừa quét (để hiển thị trong vườn)

  @IsString()
  @IsOptional()
  customName?: string;

  @IsString()
  @IsNotEmpty()
  userGoal: string; // VD: 'GET_FRUIT', 'HEAL_DISEASE'

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
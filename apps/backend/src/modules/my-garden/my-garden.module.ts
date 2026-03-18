import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyGardenController } from './my-garden.controller';
import { MyGardenService } from './my-garden.service';
import { WeatherModule } from '../weather/Weather.module'; // Import WeatherModule của bạn
import { 
  MyGarden, MyGardenSchema, 
  User, UserSchema, 
  Plant, PlantSchema 
} from '@agri-scan/database';

@Module({
  imports: [
    // Đăng ký các Schema để sử dụng trong Service
    MongooseModule.forFeature([
      { name: MyGarden.name, schema: MyGardenSchema },
      { name: User.name, schema: UserSchema },
      { name: Plant.name, schema: PlantSchema },
    ]),
    WeatherModule, // Cần WeatherModule để lấy thời tiết
  ],
  controllers: [MyGardenController],
  providers: [MyGardenService],
  exports: [MyGardenService],
})
export class MyGardenModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@agri-scan/database';
import { UsersService } from './users.service';

@Module({
  imports: [
    // Đăng ký Model ở đây để UsersService dùng được
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  exports: [UsersService], // RẤT QUAN TRỌNG: Mở cửa cho AuthModule gọi vào
})
export class UsersModule {}
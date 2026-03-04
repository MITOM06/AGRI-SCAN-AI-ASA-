import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import {
  User, UserSchema,
  Plant, PlantSchema,
  Disease, DiseaseSchema,
  ScanHistory, ScanHistorySchema

} from '@agri-scan/database';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // 1. Load file .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Kết nối Mongo
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
      inject: [ConfigService],
    }),

    // 3. Kết nối Redis
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: parseInt(configService.get<string>('REDIS_PORT')!),
          },
        }),
      }),
      inject: [ConfigService],
    }),

    // 4. Đăng ký Schema cho Root
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Plant.name, schema: PlantSchema },
      { name: Disease.name, schema: DiseaseSchema },
      { name: ScanHistory.name, schema: ScanHistorySchema },
    ]),
    
    // 5. Nạp các Module con (Không khai báo nội dung của chúng ở đây)
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [], // Đã dọn dẹp sạch sẽ
})
export class AppModule { }


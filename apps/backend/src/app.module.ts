import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 1. Import Config
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
    // 2. Load file .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
    }),

    // 3. Kết nối Mongo dùng biến môi trường
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
      inject: [ConfigService],
    }),

    // 4. Kết nối Redis dùng biến môi trường
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

    // Đăng ký Schema như cũ...
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Plant.name, schema: PlantSchema },
      { name: Disease.name, schema: DiseaseSchema },
      { name: ScanHistory.name, schema: ScanHistorySchema },
    ]),

    UsersModule,

    AuthModule,
  ],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PlantsModule } from './modules/plants/plants.module';
import {AiScanModule} from './modules/ai-scan/ai-scan.module';
import { WeatherModule } from './modules/weather/Weather.module';
import { AdminModule } from './modules/admin/admin.module';
@Module({
  imports: [
    // 1. Load .env toàn cục
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Kết nối MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('DB_URI'),
      }),
      inject: [ConfigService],
    }),

    // 3. Kết nối Redis - isGlobal: true → tất cả module con nhận CACHE_MANAGER tự động
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: parseInt(configService.getOrThrow<string>('REDIS_PORT')),
          },
        }),
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    PlantsModule,
    AiScanModule,
    WeatherModule,
    AdminModule, 

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

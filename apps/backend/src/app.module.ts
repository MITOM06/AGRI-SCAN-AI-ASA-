import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

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

    // BUG FIX: Đã XÓA MongooseModule.forFeature([...]) khỏi AppModule.
    // Lý do: mỗi Feature Module (UsersModule, PlantsModule...) tự đăng ký
    // schema của mình bên trong module đó. Đăng ký lại ở AppModule gây
    // duplicate registration - Mongoose có thể throw lỗi hoặc dùng sai model.
    //
    // Quy tắc: AppModule chỉ chứa MongooseModule.forRoot (kết nối DB),
    // KHÔNG chứa forFeature (đăng ký schema).

    // 4. Feature Modules
    UsersModule,
    AuthModule,
    // Thêm PlantsModule, DiseasesModule, AiScanModule vào đây khi làm xong
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

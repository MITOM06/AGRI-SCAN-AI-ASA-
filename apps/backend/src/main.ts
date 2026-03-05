import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. BẬT CORS CHO FRONTEND GỌI API KHÔNG BỊ CHẶN
  app.enableCors({
      origin: [
    'http://localhost:8081',  // Expo Web
    'http://localhost:3000',  // Next.js dev
    // Thêm domain production sau khi deploy
    // 'https://agriscan.ai',
  ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
     allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 2. BẬT TỰ ĐỘNG KIỂM TRA DỮ LIỆU ĐẦU VÀO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các field rác Frontend vô tình gửi thừa
      forbidNonWhitelisted: true, // Báo lỗi nếu Frontend gửi dữ liệu không có trong thiết kế
      transform: true, // Tự động ép kiểu dữ liệu
    }),
  );

  // Lấy port từ biến môi trường, mặc định là 4000
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Backend Agri-Scan AI đang chạy tại: http://localhost:${port}`);
}
bootstrap();
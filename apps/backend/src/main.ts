import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // FIX: Kết nối RabbitMQ consumer — không có đây thì @EventPattern không bao giờ chạy
  // Backend vừa là HTTP server (NestFactory.create) vừa là RabbitMQ consumer (connectMicroservice)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
      queue: 'scan_queue',
      queueOptions: { durable: true },
      noAck: false, // Bắt buộc false để manual ack/nack hoạt động
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
      queue: 'chat_queue',
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  app.setGlobalPrefix('api');
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

  // Phải gọi trước app.listen() để RabbitMQ consumers sẵn sàng trước khi nhận HTTP request
  await app.startAllMicroservices();

  // Lấy port từ biến môi trường, mặc định là 4000
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Backend Agri-Scan AI đang chạy tại: http://localhost:${port}`);
  console.log(`📨 RabbitMQ consumers đã sẵn sàng: scan_queue | chat_queue`);
}
bootstrap();
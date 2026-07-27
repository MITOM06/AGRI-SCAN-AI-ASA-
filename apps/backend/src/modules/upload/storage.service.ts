import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage, StorageOptions } from '@google-cloud/storage';
import { extname } from 'path';

/**
 * StorageService — wrapper GCS dùng chung cho toàn hệ thống.
 *
 * Cùng cấu hình / bucket với luồng quét ảnh (ai-scan). Tách ra service riêng
 * để các module khác (garden check-in, upload chung...) tái sử dụng thay vì
 * tự khởi tạo Storage client rải rác.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  private storage: Storage;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('GCS_BUCKET_NAME', '');

    const projectId = this.configService.get<string>('GCS_PROJECT_ID');
    const clientEmail = this.configService.get<string>('GCS_CLIENT_EMAIL');
    const privateKey = this.configService.get<string>('GCS_PRIVATE_KEY');

    const storageOptions: StorageOptions = { projectId };

    // Local dùng Key trong .env; Server tự động dùng ADC (Application Default Credentials)
    if (clientEmail && privateKey) {
      try {
        const formattedPrivateKey = privateKey
          .replace(/^"|"$/g, '')
          .replace(/\\n/g, '\n');

        storageOptions.credentials = {
          client_email: clientEmail,
          private_key: formattedPrivateKey,
        };
        this.logger.log('☁️ GCS Init: Đang chạy bằng Private Key (Local Mode)');
      } catch (error) {
        this.logger.error(
          '❌ Lỗi Parse Private Key GCS. Kiểm tra lại file .env!',
          error,
        );
      }
    } else {
      this.logger.log(
        '☁️ GCS Init: Không tìm thấy Key, tự động dùng ADC (Server Mode)',
      );
    }

    this.storage = new Storage(storageOptions);
  }

  /**
   * Upload 1 file ảnh lên GCS, trả về public URL.
   * @param file   file multer (buffer + mimetype)
   * @param folder thư mục trên bucket, mặc định 'uploads' (scan dùng 'scans')
   */
  async uploadImage(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.bucketName) {
        this.logger.error('❌ GCS_BUCKET_NAME chưa được cấu hình!');
        return reject(new Error('Lỗi cấu hình máy chủ lưu trữ.'));
      }

      if (!file || !file.buffer) {
        return reject(new Error('Không tìm thấy dữ liệu ảnh để upload.'));
      }

      const bucket = this.storage.bucket(this.bucketName);

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = extname(file.originalname || '.jpg');
      const filename = `${folder}/${uniqueSuffix}${ext}`;

      const blob = bucket.file(filename);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      blobStream.on('error', (err) => {
        this.logger.error(`❌ Lỗi ghi file lên GCS: ${err.message}`, err.stack);
        reject(new Error('Quá trình lưu ảnh thất bại. Vui lòng thử lại sau.'));
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
        this.logger.log(`✅ Upload thành công: ${publicUrl}`);
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  }
}

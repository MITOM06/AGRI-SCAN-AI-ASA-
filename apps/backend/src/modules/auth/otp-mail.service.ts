import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export type OtpPurpose = 'register' | 'reset';

/**
 * Sinh mã OTP và gửi email OTP (dùng chung cho luồng đăng ký và quên mật khẩu).
 * Tách khỏi AuthService để template email không lẫn vào logic xác thực.
 */
@Injectable()
export class OtpMailService {
  constructor(private mailerService: MailerService) {}

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtpEmail(
    to: string,
    fullName: string,
    otp: string,
    purpose: OtpPurpose,
  ) {
    const subject =
      purpose === 'register'
        ? '✅ Xác thực đăng ký tài khoản - Agri-Scan AI'
        : '🔑 Khôi phục mật khẩu - Agri-Scan AI';

    await this.mailerService.sendMail({
      to,
      subject,
      html: this.buildOtpEmailHtml(fullName, otp, purpose),
    });
  }

  private buildOtpEmailHtml(
    fullName: string,
    otp: string,
    purpose: OtpPurpose,
  ): string {
    const intro =
      purpose === 'register'
        ? 'Cảm ơn bạn đã đăng ký Agri-Scan AI. Vui lòng dùng mã OTP dưới đây để hoàn tất đăng ký:'
        : 'Chúng tôi nhận được yêu cầu khôi phục mật khẩu. Vui lòng dùng mã OTP dưới đây:';
    const validity = purpose === 'register' ? '5 phút' : '60 giây';
    const footerNote =
      purpose === 'register'
        ? 'Nếu bạn không thực hiện đăng ký này, hãy bỏ qua email này.'
        : 'Nếu bạn không yêu cầu thay đổi mật khẩu, hãy bỏ qua email này.';

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #2e7d32; text-align: center;">Agri-Scan AI</h2>
        <p>Xin chào <strong>${fullName}</strong>,</p>
        <p>${intro}</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <h1 style="color: #333; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: red; font-size: 14px;"><em>* Mã OTP chỉ có hiệu lực trong ${validity}.</em></p>
        <p>${footerNote}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">Đội ngũ Agri-Scan AI - HUTECH</p>
      </div>
    `;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { User, UserDocument } from '@agri-scan/database';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  // Tìm user qua email (dùng lúc login)
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Tạo user mới (dùng lúc đăng ký)
  async create(userData: Partial<User>): Promise<UserDocument> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }
  // Cập nhật mật khẩu mới
  async updatePassword(email: string, newPassword: string): Promise<void> {
    await this.userModel.updateOne({ email }, { password: newPassword }).exec();
  }
}
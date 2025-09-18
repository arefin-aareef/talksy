import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.userModel
      .find({ isDeleted: { $ne: true } })
      .select('-password')
      .sort({ isOnline: -1, lastSeen: -1 })
      .exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('-password').exec();
  }

  async updateOnlineStatus(id: string, isOnline: boolean): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      id,
      {
        isOnline,
        lastSeen: new Date(),
      },
      { new: true },
    );
  }

  async searchUsers(query: string, currentUserId: string): Promise<User[]> {
    return this.userModel
      .find({
        _id: { $ne: currentUserId },
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      })
      .select('-password')
      .limit(10)
      .exec();
  }

  async getOnlineUsers(): Promise<User[]> {
    return this.userModel
      .find({ isOnline: true })
      .select('-password')
      .sort({ lastSeen: -1 })
      .exec();
  }
}

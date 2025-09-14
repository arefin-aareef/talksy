import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private kafkaService: KafkaService,
  ) {}

  async createMessage(
    createMessageDto: CreateMessageDto,
    senderId: string,
  ): Promise<Message> {
    const message = new this.messageModel({
      ...createMessageDto,
      sender: senderId,
    });

    const savedMessage = await message.save();

    // Populate sender and receiver details
    await savedMessage.populate([
      { path: 'sender', select: 'username avatar isOnline' },
      { path: 'receiver', select: 'username avatar isOnline' },
    ]);

    // Send to Kafka for message streaming
    await this.kafkaService.sendMessage('chat-messages', {
      messageId: savedMessage._id.toString(),
      senderId: senderId,
      receiverId: createMessageDto.receiver,
      content: createMessageDto.content,
      timestamp: savedMessage.createdAt,
    });

    return savedMessage;
  }

  async getConversation(
    userId1: string,
    userId2: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<Message[]> {
    const skip = (page - 1) * limit;

    return this.messageModel
      .find({
        $or: [
          { sender: userId1, receiver: userId2 },
          { sender: userId2, receiver: userId1 },
        ],
        isDeleted: false,
      })
      .populate([
        { path: 'sender', select: 'username avatar isOnline' },
        { path: 'receiver', select: 'username avatar isOnline' },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async markAsRead(messageId: string, userId: string): Promise<void> {
    await this.messageModel.findOneAndUpdate(
      {
        _id: messageId,
        receiver: userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageModel.countDocuments({
      receiver: userId,
      isRead: false,
      isDeleted: false,
    });
  }

  async getUserConversations(userId: string): Promise<any[]> {
    const conversations = await this.messageModel.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
          isDeleted: false,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', userId] },
              then: '$receiver',
              else: '$sender',
            },
          },
          lastMessage: { $first: '$ROOT' },
          unreadCount: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ['$receiver', userId] },
                    { $eq: ['$isRead', false] },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          user: {
            _id: '$user._id',
            username: '$user.username',
            avatar: '$user.avatar',
            isOnline: '$user.isOnline',
            lastSeen: '$user.lastSeen',
          },
          lastMessage: {
            _id: '$lastMessage._id',
            content: '$lastMessage.content',
            createdAt: '$lastMessage.createdAt',
            isRead: '$lastMessage.isRead',
          },
          unreadCount: 1,
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
    ]);

    return conversations;
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    await this.messageModel.findOneAndUpdate(
      {
        _id: messageId,
        sender: userId,
      },
      {
        isDeleted: true,
      },
    );
  }
}

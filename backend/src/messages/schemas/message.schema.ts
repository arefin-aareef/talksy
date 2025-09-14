import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type MessageDocument = Message & Document;

@Schema({
  timestamps: true,
  collection: 'messages',
})
export class Message {
  _id: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  sender: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  receiver: User;

  @Prop({
    required: true,
    maxlength: 1000,
    trim: true,
  })
  content: string;

  @Prop({
    enum: ['text', 'image', 'file'],
    default: 'text',
  })
  type: string;

  @Prop({
    default: false,
  })
  isRead: boolean;

  @Prop({
    type: Date,
    default: Date.now,
  })
  readAt: Date;

  @Prop({
    default: false,
  })
  isDeleted: boolean;

  // These will be added automatically by timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Indexes for better performance
MessageSchema.index({ sender: 1, receiver: 1 });
MessageSchema.index({ createdAt: -1 });
MessageSchema.index({ isDeleted: 1 });

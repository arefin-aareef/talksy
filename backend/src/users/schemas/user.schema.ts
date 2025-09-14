import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  _id: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  })
  email: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true,
  })
  username: string;

  @Prop({
    required: true,
    minlength: 6,
  })
  password: string;

  @Prop({
    default: false,
  })
  isOnline: boolean;

  @Prop({
    type: Date,
    default: Date.now,
  })
  lastSeen: Date;

  @Prop({
    default: 'https://ui-avatars.com/api/?background=random&name=',
  })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ isOnline: 1 });

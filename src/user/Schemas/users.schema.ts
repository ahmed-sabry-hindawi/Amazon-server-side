import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // إضافة timestamps
export class User {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: false,
    enum: ['user', 'seller', 'admin'],
    default: 'user',
  })
  role: string;
  @Prop({ required: false })
  verificationToken: string;

  @Prop({ default: true })
  isActive: boolean;
  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpires: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

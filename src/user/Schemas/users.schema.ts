import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
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

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpires: Date;

  @Prop({ default: Date.now })
  lastLoginAt: Date;

  @Prop({ default: 0 })
  loginAttempts: number;

  @Prop()
  lockUntil: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes
UserSchema.index({ email: 1 });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });

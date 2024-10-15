import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: false })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: String, required: true, default: 'paypal' })
  paymentMethod: string;

  @Prop({
    type: String,
    enum: PaymentStatus,
    required: true,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ type: Date, default: Date.now })
  paymentDate: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

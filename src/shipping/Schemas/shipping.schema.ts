import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Date, Document, Types } from 'mongoose';

export type ShippingDocument = Shipping & Document;

@Schema({ timestamps: true }) // إضافة timestamps
export class Shipping {
  @Prop({ required: true })
  address: string;

  @Prop({ required: false })
  trackingNumber: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: false })
  orderId: mongoose.Types.ObjectId;
}

// export const ShippingSchema = SchemaFactory.createForClass(Shipping);
export const ShippingSchema = SchemaFactory.createForClass(Shipping);

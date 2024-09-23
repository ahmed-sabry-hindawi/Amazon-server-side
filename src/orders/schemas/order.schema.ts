import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema()
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
    _id: false,
  })
  items: { productId: Types.ObjectId; quantity: number }[];

  @Prop({ required: true })
  totalPrice: number;

  // Localization for orderStatus
  @Prop({
    type: {
      en: { type: String, enum: OrderStatus, default: OrderStatus.PENDING },
      ar: { type: String, enum: ['قيد الانتظار', 'تم الشحن', 'تم التوصيل', 'ملغاة'], default: 'قيد الانتظار' },
    },
  })
  orderStatus: {
    en: OrderStatus;
    ar: string;
  };

  // Localization for shippingAddress
  @Prop({
    type: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
  })
  shippingAddress: {
    en: string;
    ar: string;
  };

 // Reference to the payment collection
 @Prop({ type: Types.ObjectId, ref: 'Payment', required: true })
 paymentId: Types.ObjectId;

  @Prop({ default: Date.now })
  orderDate: Date;
}


export const OrderSchema = SchemaFactory.createForClass(Order);

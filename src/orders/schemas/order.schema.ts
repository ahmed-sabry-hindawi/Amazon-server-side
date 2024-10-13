import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema({timestamps: true})
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
    _id: false,
  })
  orderStatus: {
    en: OrderStatus;
    ar: string;
  };

  // Localization for shippingAddress
  @Prop({ required: true })
  shippingAddress: string

 // Reference to the payment collection
 @Prop({ type: Types.ObjectId, ref: 'Payment', required: false })
 paymentId: Types.ObjectId;

}


export const OrderSchema = SchemaFactory.createForClass(Order);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus {
  Pending = 'pending',
  Completed = 'completed',
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

 
  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.Pending })
  orderStatus: OrderStatus;

  
  @Prop({ required: true })
  shippingAddress: string

 // Reference to the payment collection
 @Prop({ type: Types.ObjectId, ref: 'Payment', required: false })
 paymentId: Types.ObjectId;

}


export const OrderSchema = SchemaFactory.createForClass(Order);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
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

  @Prop({ required: true ,default:0})
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
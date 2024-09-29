import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Review' })
  reviews: Types.ObjectId[];

  // @Prop({ type: Types.ObjectId, ref: 'Category' })
  // categoryId: Types.ObjectId;

  // Reference to Subcategory instead of Category
  @Prop({ type: Types.ObjectId, ref: 'Subcategory', required: true })
  subcategoryId: Types.ObjectId;

  @Prop({
    required: true,
    type: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
  })
  name: {
    en: string;
    ar: string;
  };

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  discounts: number;

  @Prop({
    type: {
      en: { type: String },
      ar: { type: String },
    },
  })
  description?: {
    en: string;
    ar: string;
  };

  @Prop()
  brand?: string;

  @Prop([String])
  imageUrls: string[];

  @Prop({ default: 0 })
  stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

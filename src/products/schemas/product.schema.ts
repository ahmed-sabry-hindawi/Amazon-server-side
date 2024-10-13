import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Review' })
  reviews: Types.ObjectId[];

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

// Create a text index on the `name.en`, `name.ar`, and `description` fields
export const ProductSchema = SchemaFactory.createForClass(Product);

// Adding the text index for multilingual support
ProductSchema.index({
  'name.en': 'text',
  'name.ar': 'text',
  'description.en': 'text',
  'description.ar': 'text',
});

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';

@Schema({ timestamps: true })
export class Subcategory {
  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  categoryId: Types.ObjectId;

  @Prop({
    required: true,
    type: {
      en: String,
      ar: String,
    },
  })
  name: {
    en: string;
    ar: string;
  };

  @Prop({
    type: {
      en: String,
      ar: String,
    },
  })
  description?: {
    en: string;
    ar: string;
  };
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);

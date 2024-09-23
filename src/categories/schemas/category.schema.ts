import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop({
    required: true,
    type: {
      en: { type: String },
      ar: { type: String },
    },
  })
  name: {
    en: string;
    ar: string;
  };

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
}

export const CategorySchema = SchemaFactory.createForClass(Category);

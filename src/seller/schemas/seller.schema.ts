
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Seller extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true,unique:true})
  userId: Types.ObjectId;

  @Prop({ type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Prop({ type: [Types.ObjectId], ref: 'Product' })
  products?: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Order' })
  orders?: Types.ObjectId[];

  @Prop({ type: String, required: true, minlength: 3, maxlength: 30 })
  businessName: string;

  @Prop({ type: String, required: true, minlength: 2, maxlength: 40 })
  businessNameArabic: string;

  @Prop({ type: String, required: true, unique: true })
  registrationNumber?: string;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: String, required: true })
  addressLine: string;

  @Prop({ type: String, required: true })
  governorate: string;

  @Prop({ type: String, required: true, match: /^\+?[1-9]\d{1,14}$/ })
  phoneNumber: string;

  @Prop({ type: String, required: true, minlength: 4, maxlength: 30 })
  fullName: string;

  @Prop({ type: String, required: true })
  countryOfCitizenship: string;

  @Prop({ type: String, required: true })
  countryOfBirth: string;

  @Prop({ type: Date, required: true })
  dateOfBirth: Date;

  @Prop({ enum: ['National ID', 'Passport'], required: true })
  identityProof: 'National ID' | 'Passport';

  @Prop({ type: String, required: true })
  countryOfIssue: string;

  @Prop({ type: String, required: true })
  nationalIdOrPassport?: string;

  @Prop({ type: String, required: true })
  cardNumber: string;

  @Prop({ type: Date, required: true })
  expirationDate: Date;

  @Prop({ type: String, required: true })
  cardHolderName: string;

 
}

export const SellerSchema = SchemaFactory.createForClass(Seller);




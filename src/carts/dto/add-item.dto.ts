import { IsNotEmpty, IsMongoId, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class AddItemDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
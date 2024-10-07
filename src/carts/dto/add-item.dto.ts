import { IsNotEmpty, IsMongoId, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class AddItemDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: string; // Change to string

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
import { IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class RemoveItemDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;  // Changed from Types.ObjectId to string
}
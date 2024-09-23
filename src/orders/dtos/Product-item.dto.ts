import { IsNotEmpty, IsMongoId, IsNumber } from 'class-validator';

export class ProductItemDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

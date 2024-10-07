import { IsNotEmpty, IsMongoId, IsNumber, Min } from 'class-validator';

export class ProductItemDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1) // Ensure quantity is at least 1
  quantity: number;
}

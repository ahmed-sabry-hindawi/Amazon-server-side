import { IsNotEmpty, IsArray, ValidateNested, IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductItemDto } from 'src/orders/dto/Product-item.dto';

export class CreateCartDto {
  @IsNotEmpty()
  @IsOptional()
  @IsMongoId()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  items: ProductItemDto[];

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductNameDto {
  @IsNotEmpty()
  @IsString()
  en: string;

  @IsNotEmpty()
  @IsString()
  ar: string;
}

export class CreateProductDto {
  @IsMongoId()
  sellerId: string;

  @IsOptional()
  @IsArray()
  reviews?: string[];

  @IsMongoId()
  categoryId: string;

  @ValidateNested()
  @Type(() => ProductNameDto)
  name: ProductNameDto;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discounts?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductNameDto)
  description?: ProductNameDto;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];

  @IsNotEmpty()
  @IsNumber()
  stock: number;
}

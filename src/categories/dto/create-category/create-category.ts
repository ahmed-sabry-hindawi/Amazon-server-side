import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CategoryNameDto {
  @IsNotEmpty()
  @IsString()
  en: string;

  @IsNotEmpty()
  @IsString()
  ar: string;
}

export class CreateDescriptionDto {
  @IsOptional()
  @IsString()
  en?: string;

  @IsOptional()
  @IsString()
  ar?: string;
}

export class CreateCategoryDto {
  @ValidateNested()
  @Type(() => CategoryNameDto)
  @IsNotEmpty()
  name: CategoryNameDto;

  @ValidateNested()
  @Type(() => CreateDescriptionDto)
  @IsOptional()
  description?: CreateDescriptionDto;
}

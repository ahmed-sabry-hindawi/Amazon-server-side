import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  CategoryNameDto,
  CreateDescriptionDto,
} from 'src/categories/dto/create-category/create-category';

export class CreateSubCategoryDto {
  @ValidateNested()
  @Type(() => CategoryNameDto)
  @IsNotEmpty()
  @IsString()
  name: CategoryNameDto;

  @ValidateNested()
  @Type(() => CreateDescriptionDto)
  @IsOptional()
  description?: CreateDescriptionDto;
}

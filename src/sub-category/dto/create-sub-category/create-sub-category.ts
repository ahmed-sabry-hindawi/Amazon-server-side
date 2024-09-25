import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import {
  CategoryNameDto,
  CreateDescriptionDto,
} from 'src/categories/dto/create-category/create-category';

export class CreateSubCategoryDto {
  @IsNotEmpty()
  @IsMongoId()
  categoryId: Types.ObjectId;

  @ValidateNested()
  @Type(() => CategoryNameDto)
  @IsNotEmpty()
  name: CategoryNameDto;

  @ValidateNested()
  @Type(() => CreateDescriptionDto)
  @IsOptional()
  description?: CreateDescriptionDto;
}

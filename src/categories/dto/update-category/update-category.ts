import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from '../create-category/create-category';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from '../create-category/create-category';

export class UpdateCategory extends PartialType(CreateCategoryDto) {}

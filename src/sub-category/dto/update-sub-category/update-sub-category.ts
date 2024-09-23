import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCategoryDto } from '../create-sub-category/create-sub-category';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}

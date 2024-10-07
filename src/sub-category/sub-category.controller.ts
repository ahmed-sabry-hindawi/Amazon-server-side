import { Types } from 'mongoose';
import { CreateSubCategoryDto } from './dto/create-sub-category/create-sub-category';
import { SubCategoryService } from './sub-category.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UpdateSubCategoryDto } from './dto/update-sub-category/update-sub-category';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private subcategoriesService: SubCategoryService) {}

  // Create a new subcategory
  @Post()
  create(@Body() createSubcategoryDto: CreateSubCategoryDto) {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  // Get all subcategories, optionally filter by categoryId
  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    const categoryIdObj = categoryId
      ? new Types.ObjectId(categoryId)
      : undefined;
    return this.subcategoriesService.findAll(categoryIdObj);
  }

  // Get a specific subcategory by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoriesService.findOne(id);
  }

  // Update a subcategory by ID
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubcategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subcategoriesService.update(id, updateSubcategoryDto);
  }

  // Delete a subcategory by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoriesService.remove(id);
  }

  // Get all subcategories under a specific category
  @Get('/category/:categoryId')
  findByCategoryId(@Param('categoryId') categoryId: string) {
    return this.subcategoriesService.findByCategoryId(
      new Types.ObjectId(categoryId),
    );
  }
}

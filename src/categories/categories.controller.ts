import { CategoriesService } from './categories.service';
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
import { UpdateCategoryDto } from './dto/update-category/update-category';
import { CreateCategoryDto } from './dto/create-category/create-category';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  // Create a new category
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // Get all categories
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // Get a single category by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  // Find categories by name (optional)
  @Get('/name/:name')
  findByName(@Param('name') name: string) {
    return this.categoriesService.findByName(name);
  }

  // Search categories using a query string
  @Get('/search')
  search(@Query('query') query: string) {
    return this.categoriesService.search(query);
  }

  // Get paginated list of categories
  @Get('/paginate')
  findAllPaginated(@Query('limit') limit: number, @Query('page') page: number) {
    return this.categoriesService.findAllPaginated(limit, page);
  }

  // Count total number of categories
  @Get('/count')
  countCategories() {
    return this.categoriesService.countCategories();
  }

  // Update a category by ID
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // Soft delete a category by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}

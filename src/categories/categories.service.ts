import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category/create-category';
import { UpdateCategoryDto } from './dto/update-category/update-category';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = await this.categoryModel.create(createCategoryDto);
    return category;
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  async findByName(name: string): Promise<Category[]> {
    return await this.categoryModel.find({ 'name.en': name }).exec();
  }

  // Search categories based on partial name or description (case-insensitive)
  async search(query: string): Promise<Category[]> {
    return await this.categoryModel
      .find({
        $or: [
          { 'name.en': new RegExp(query, 'i') },
          { 'name.ar': new RegExp(query, 'i') },
          { 'description.en': new RegExp(query, 'i') },
          { 'description.ar': new RegExp(query, 'i') },
        ],
        isDeleted: false,
      })
      .exec();
  }

  // Pagination: find all categories with pagination
  async findAllPaginated(limit: number, page: number): Promise<Category[]> {
    const skip = (page - 1) * limit;
    return await this.categoryModel
      .find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // Count total number of categories
  async countCategories(): Promise<number> {
    return await this.categoryModel.countDocuments({ isDeleted: false }).exec();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schemas/review.schema';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>) {}

  // Create a new review
  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      const review = await this.reviewModel.create(createReviewDto);
      await this.productModel.findByIdAndUpdate(createReviewDto.productId, { $push: { reviews: review._id } });
      return review;
    } catch (error) {
      throw new Error('Error creating review: ' + error.message);
    }
  }

  // Get all reviews for a product
  async findByProductId(productId: string): Promise<Review[]> {
    try {
      return await this.reviewModel.find({ productId }).exec();
    } catch (error) {
      throw new Error('Error fetching reviews: ' + error.message);
    }
  }

  // Get review by ID
  async findById(id: string): Promise<Review> {
    try {
      const review = await this.reviewModel.findById(id).exec();
      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }
      return review;
    } catch (error) {
      throw new Error('Error fetching review: ' + error.message);
    }
  }

  // Update review by ID
  async updateById(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    try {
      const review = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, {
        new: true,
      });
      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }
      return review;
    } catch (error) {
      throw new Error('Error updating review: ' + error.message);
    }
  }

  // Delete review by ID
  async deleteById(id: string, userId: string): Promise<Review> {
    try {
      const review = await this.reviewModel.findByIdAndDelete(id);
      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }
      // Additional logic to check if userId matches the review.userId can be added here
      return review;
    } catch (error) {
      throw new Error('Error deleting review: ' + error.message);
    }
  }
}
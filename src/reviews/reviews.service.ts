import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schemas/review.schema';
import { Model, Types } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Product } from '../products/schemas/product.schema';
import { Order } from '../orders/schemas/order.schema';
import { OrderStatus } from '../orders/schemas/order.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  // Create a new review
  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      const review = await this.reviewModel.create(createReviewDto);
      await this.productModel.findByIdAndUpdate(createReviewDto.productId, {
        $push: { reviews: review._id },
      });
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
  async updateById(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    try {
      const review = await this.reviewModel.findByIdAndUpdate(
        id,
        updateReviewDto,
        {
          new: true,
        },
      );
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

  async createReviewForDeliveredProduct(
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    try {
      // Check if user has a delivered order containing this product
      const hasDeliveredOrder = await this.orderModel
        .findOne({
          userId: userId,
          orderStatus: {
            $regex: new RegExp('^(completed|delivered)$', 'i'),
          },
          'items.productId': new Types.ObjectId(createReviewDto.productId),
        })
        .select('orderStatus items')
        .lean()
        .exec();

      // console.log('Found order:', hasDeliveredOrder);

      if (!hasDeliveredOrder) {
        throw new HttpException(
          'You can only review products from delivered orders',
          HttpStatus.FORBIDDEN,
        );
      }

      // Check if user already reviewed this product
      const existingReview = await this.reviewModel
        .findOne({
          userId: userId,
          productId: new Types.ObjectId(createReviewDto.productId),
        })
        .lean()
        .exec();

      // console.log('Existing review:', existingReview);

      if (existingReview) {
        throw new HttpException(
          'You have already reviewed this product',
          HttpStatus.FORBIDDEN,
        );
      }

      // Create the review
      const review = await this.reviewModel.create({
        ...createReviewDto,
        userId: userId,
      });

      // Add review to product
      await this.productModel.findByIdAndUpdate(createReviewDto.productId, {
        $push: { reviews: review._id },
      });

      return review;
    } catch (error) {
      console.error('Review creation error:', error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

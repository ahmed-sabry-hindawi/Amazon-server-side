import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Patch,
  UseGuards,
  Request,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schemas/review.schema';
import { AuthenticationGuard } from 'src/common/Guards/authentication/authentication.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  // Create a new review
 // done
  @Post()
  @UseGuards(AuthenticationGuard)
  async create(
      @Request() req,
      @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
      try {
          createReviewDto.userId = req.user.id; // Set userId from the authenticated user
          return await this.reviewsService.create(createReviewDto);
      } catch (error) {
          throw new HttpException('Error creating review: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  // Get all reviews for a product
 // done
  @Get('product/:productId')
  async findByProductId(@Param('productId') productId: string): Promise<Review[]> {
      try {
          return await this.reviewsService.findByProductId(productId);
      } catch (error) {
          throw new HttpException('Error fetching reviews: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  // Get review by ID
 // done
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Review> {
      try {
          return await this.reviewsService.findById(id);
      } catch (error) {
          throw new HttpException('Error fetching review: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  // Update review by ID
  @Patch(':id')
  @UseGuards(AuthenticationGuard)
  async updateById(
      @Request() req,
      @Param('id') id: string,
      @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
      try {
          updateReviewDto.userId = req.user.id; // Set userId from the authenticated user
          return await this.reviewsService.updateById(id, updateReviewDto);
      } catch (error) {
          throw new HttpException('Error updating review: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  // Delete review by ID
  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  async deleteById(@Request() req, @Param('id') id: string): Promise<Review> {
      try {
          const userId = req.user.id;
          return await this.reviewsService.deleteById(id, userId);
      } catch (error) {
          throw new HttpException('Error deleting review: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }
}
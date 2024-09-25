import { IsOptional, IsMongoId, IsNumber, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsMongoId()
  productId?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsString()
  reviewText?: string;

  @IsOptional()
  reviewDate?: Date;
}
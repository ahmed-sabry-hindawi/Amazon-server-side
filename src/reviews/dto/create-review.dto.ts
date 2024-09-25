import { IsNotEmpty, IsMongoId, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsOptional()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  reviewText: string;
}
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateShippingDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  trackingNumber: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsMongoId()
  orderId: string;

  userId: string;
}

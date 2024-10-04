import {
  IsAlphanumeric,
  IsBoolean,
  isBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  isNotEmpty,
  IsString,
} from 'class-validator';
import { DateExpression } from 'mongoose';

export class CreateShippingDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  // @IsDateString()
  // expectedDeliveryDate: DateExpression;

  @IsString()
  @IsNotEmpty()
  trackingNumber: string;

  @IsBoolean()
  isActive: Boolean;

  @IsMongoId()
  orderId:string
}

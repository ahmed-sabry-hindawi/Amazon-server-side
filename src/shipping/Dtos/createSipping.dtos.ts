import {
  IsAlphanumeric,
  IsBoolean,
  isBoolean,
  IsDateString,
  IsNotEmpty,
  isNotEmpty,
  IsString,
} from 'class-validator';
import { DateExpression } from 'mongoose';

export class CreateShippingDto {
  @IsString()
  @IsNotEmpty()
  address: String;

  // @IsDateString()
  // expectedDeliveryDate: DateExpression;

  @IsString()
  @IsNotEmpty()
  trackingNumber: String;

  @IsBoolean()
  isActive: Boolean;
}

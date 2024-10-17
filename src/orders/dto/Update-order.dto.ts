import {
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsObject,
  IsMongoId,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../schemas/order.schema';
import { ProductItemDto } from './Product-item.dto';

export class UpdateOrderDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  items?: ProductItemDto[];

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus?: OrderStatus;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsMongoId()
  paymentId?: string;

}





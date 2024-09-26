import { IsOptional, IsArray, ValidateNested, IsEnum, IsObject, IsMongoId, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../schemas/order.schema';
import { ProductItemDto } from './product-item.dto.ts';
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
  @IsObject()
  @ValidateNested()
  @Type(() => OrderStatusDto)
  orderStatus?: {
    en?: OrderStatus; // Optional English status
    ar?: string;     // Optional Arabic status
  };

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress?: {
    en?: string; // Optional English address
    ar?: string; // Optional Arabic address
  };

  @IsOptional()
  @IsMongoId()
  paymentId?: string;

  @IsOptional()
  orderDate?: Date; // Optional date field
}

class OrderStatusDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  en?: OrderStatus; // Optional English status

  @IsOptional()
  @IsString()
  ar?: string; // Optional Arabic status
}

class AddressDto {
  @IsOptional()
  @IsString()
  en?: string; // Optional English address

  @IsOptional()
  @IsString()
  ar?: string; // Optional Arabic address
}

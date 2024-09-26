import { IsNotEmpty, IsArray, ValidateNested, IsEnum, IsObject, IsOptional, IsMongoId, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../schemas/order.schema';
import { ProductItemDto } from './Product-item.dto';

export class CreateOrderDto {
  
  @IsNotEmpty()
  @IsOptional()
  @IsMongoId()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true }) //validate nested objects within an array
  @Type(() => ProductItemDto) // used to specify the type of the nested object
  items: ProductItemDto[];

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @IsObject()
  @ValidateNested()
  @Type(() => OrderStatusDto)
  orderStatus: {
    en: OrderStatus;
    ar: string;
  };

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: {
    en: string;
    ar: string;
  };

  @IsNotEmpty()
  @IsMongoId()
  paymentId: string;
}

class OrderStatusDto {
  @IsEnum(OrderStatus)
  en: OrderStatus;

  @IsNotEmpty()
  ar: string;
}

class AddressDto {
  @IsNotEmpty()
  en: string;

  @IsNotEmpty()
  @IsString()
  ar: string;
}

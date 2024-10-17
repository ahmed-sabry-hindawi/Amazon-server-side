import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEnum,
  IsObject,
  IsOptional,
  IsMongoId,
  IsNumber,
  IsString,
} from 'class-validator';
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

  @IsEnum(OrderStatus)
  @IsOptional()
  orderStatus: OrderStatus;

  @IsString()
  @IsOptional()
  shippingAddress: string;

  @IsNotEmpty()
  @IsMongoId()
  @IsOptional()
  paymentId: string;
}

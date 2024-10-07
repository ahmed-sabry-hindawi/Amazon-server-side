// import {
//   IsMongoId,
//   IsNotEmpty,
//   IsNumber,
//   IsOptional,
//   IsString,
//   IsEnum,
// } from 'class-validator';

// export class CreatePaymentDto {
//   @IsMongoId()
//   @IsNotEmpty()
//   userId: string;

//   @IsMongoId()
//   @IsNotEmpty()
//   orderId: string;

//   @IsNumber()
//   @IsNotEmpty()
//   amount: number;

//   @IsString()
//   @IsOptional()
//   paymentMethod: string = 'paypal';

//   @IsEnum(['pending', 'completed', 'failed', 'refunded'])
//   @IsOptional()
//   status?: string;

//   @IsString()
//   @IsNotEmpty()
//   transactionId: string; // Unique PayPal transaction identifier
// }

import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  Min,
} from 'class-validator';
import { PaymentStatus } from './../../schemas/payment.schema';
export class CreatePaymentDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string = 'paypal';

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus = PaymentStatus.PENDING;

  @IsString()
  @IsNotEmpty()
  transactionId: string;
}

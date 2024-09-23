import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';

export class CreatePaymentDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  paymentMethod: string = 'paypal';

  @IsEnum(['pending', 'completed', 'failed', 'refunded'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsNotEmpty()
  transactionId: string; // Unique PayPal transaction identifier
}

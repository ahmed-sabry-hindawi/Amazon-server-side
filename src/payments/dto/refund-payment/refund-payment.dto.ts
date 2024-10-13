import {
  IsNumber,
  IsString,
  IsNotEmpty,
  MinLength,
  Min,
} from 'class-validator';

export class RefundPaymentDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  currency: string;
}

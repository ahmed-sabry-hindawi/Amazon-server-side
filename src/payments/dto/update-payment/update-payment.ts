import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from '../create-payment/create-payment';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}

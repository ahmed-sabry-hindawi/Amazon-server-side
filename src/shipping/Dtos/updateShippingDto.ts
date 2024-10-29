import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateShippingDto {
  @IsString()
  @IsNotEmpty()
  address: string;

}

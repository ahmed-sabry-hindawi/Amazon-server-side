import { IsString, Length, Matches, IsBoolean, IsNotEmpty, IsOptional, IsEnum, IsDate, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSellerDto {
  @IsOptional()
  @IsString()
  @Length(3, 30)
  businessName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 40)
  businessNameArabic?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  addressLine?: string;

  @IsOptional()
  @IsString()
  governorate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  countryOfCitizenship?: string;

  @IsOptional()
  @IsString()
  countryOfBirth?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(['National ID', 'Passport'])
  identityProof?: 'National ID' | 'Passport';

  @IsOptional()
  @IsString()
  countryOfIssue?: string;

  @IsOptional()
  @IsString()
  nationalIdOrPassport?: string;

  @IsOptional()
  @IsString()
  cardNumber?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @IsOptional()
  @IsString()
  cardHolderName?: string;
}

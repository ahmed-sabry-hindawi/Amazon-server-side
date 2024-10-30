import { IsString,Length,Matches , IsBoolean, IsNotEmpty, IsOptional, IsEnum, IsDate, IsMongoId } from 'class-validator';
// import { Types } from 'mongoose';
import { Type } from 'class-transformer';

export class CreateSellerDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  businessName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 40)
  businessNameArabic: string;

  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  addressLine: string;

  @IsString()
  @IsNotEmpty()
  governorate: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  countryOfCitizenship: string;

  @IsString()
  @IsNotEmpty()
  countryOfBirth: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsEnum(['National ID', 'Passport'])
  identityProof: 'National ID' | 'Passport';

  @IsString()
  @IsNotEmpty()
  countryOfIssue: string;

  @IsString()
  @IsNotEmpty()
  nationalIdOrPassport: string;

  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsDate()
  @Type(() => Date)
  expirationDate: Date;

  @IsString()
  cardHolderName?: string;

 
  // @IsOptional()
  // subscription?: SubscriptionDto; // Define SubscriptionDto if needed
}

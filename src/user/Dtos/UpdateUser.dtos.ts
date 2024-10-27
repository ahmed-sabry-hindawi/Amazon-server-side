import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name?: String;

  @IsOptional()
  role?: String = 'user';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = false;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean = false;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email?: String;
}

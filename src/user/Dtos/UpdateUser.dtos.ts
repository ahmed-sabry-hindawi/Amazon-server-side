import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name: String;

  @IsOptional()
  role: String='user';
  
  @IsOptional()
  isActive: boolean=true;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: String;
}

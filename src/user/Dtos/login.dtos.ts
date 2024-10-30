import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUser.dtos';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class Login {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  @IsString()
  @IsNotEmpty()
  password!: string;
}

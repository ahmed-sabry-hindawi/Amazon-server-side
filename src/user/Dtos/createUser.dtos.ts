import { IsAlphanumeric, IsNotEmpty, isNotEmpty, IsString } from 'class-validator';
import { UpdateUserDto } from './UpdateUser.dtos';

export class CreateUserDto extends UpdateUserDto {
  @IsString()
  // @IsAlphanumeric() //Checks if the string contains only letters and numbers.
  @IsNotEmpty()
  password: String;


}

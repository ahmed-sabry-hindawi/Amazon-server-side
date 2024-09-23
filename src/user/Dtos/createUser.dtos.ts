import { IsAlphanumeric, IsNotEmpty, isNotEmpty, IsString } from 'class-validator';
import { UpdateUser } from './UpdateUser.dtos';

export class CreateUser extends UpdateUser {
  @IsString()
  // @IsAlphanumeric() //Checks if the string contains only letters and numbers.
  @IsNotEmpty()
  password: String;


}

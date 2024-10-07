import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./createUser.dtos";



export class Login  extends PickType(CreateUserDto,["email","password"]){

}
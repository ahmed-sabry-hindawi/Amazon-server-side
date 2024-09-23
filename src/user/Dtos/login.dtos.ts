import { PickType } from "@nestjs/mapped-types";
import { CreateUser } from "./createUser.dtos";



export class Login  extends PickType(CreateUser,["email","password"]){

}
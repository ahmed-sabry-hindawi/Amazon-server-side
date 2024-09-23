import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './Schemas/users.schema';
import { Model, ObjectId } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { UpdateUser } from './Dtos/UpdateUser.dtos';
import { CreateUser } from './Dtos/createUser.dtos';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // this function to get all Users
  async getAllUser(): Promise<UpdateUser[]> {
    const users = await this.userModel.find().exec();
    return users;
  }

  // this function to Create new user

  async CreateNewUSer(userData: CreateUser): Promise<UpdateUser> {
    const exitingUser = await this.userModel
      .findOne({ email: userData.email })
      .exec();
    if (exitingUser) {
      throw new NotFoundException('this email is already exist');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    userData.password = hashedPassword;

    const newUser = await this.userModel.create(userData);

    return newUser.save();
  }
  // ##############################


  async updateUserPassword(userId: ObjectId, newPassword: string): Promise<any> {

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException("User with id ${userId} not found");
    }
  
   
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);
  
   
    user.password = hashedPassword;
    await user.save();
  
    return { message: 'Password updated successfully' };
  }


  // ##############################

  async getUserById(id: string): Promise<UpdateUser> {
    const foundUser = await this.userModel.findById(id).exec();
    if (!foundUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return foundUser;
  }
  async getUserByEmail(email: string): Promise<CreateUser> {
    const foundUser = await this.userModel.findOne({ email }).exec();
    if (!foundUser) {
      throw new NotFoundException(`User with id ${email} not found`);
    }
    return foundUser;
  }

  async deleteUser(id): Promise<void> {
    const userDelete = await this.userModel.findByIdAndDelete(id);
  }

  async updateUserById(id, userData): Promise<CreateUser> {
    const userUpdate = await this.userModel.findByIdAndUpdate(id, userData, {
      new: true,
    });
    if (userUpdate) {
      return userUpdate;
    } else {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}

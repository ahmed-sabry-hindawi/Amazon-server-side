import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './Schemas/users.schema';
import { Model, ObjectId } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { UpdateUserDto } from './Dtos/UpdateUser.dtos';
import { CreateUserDto } from './Dtos/createUser.dtos';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // this function to get all Users

  async getAllUsers(): Promise<UpdateUserDto[]> {
    try {
      return await this.userModel.find().lean().exec();
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  

  async createNewUser(userData: CreateUserDto): Promise<UpdateUserDto> {
    try {
      const existingUser = await this.userModel
        .findOne({ email: userData.email })
        .lean()
        .exec();
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const newUser = new this.userModel({
        ...userData,
        password: hashedPassword,
      });
      return await newUser.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
  // ##############################

  

  async updateUserPassword(
    userId: ObjectId,
    newPassword: string,
  ): Promise<void> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);
      // user.password = await this.hashPassword(newPassword);
      user.password = hashedPassword;
      await user.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update user password: ${error.message}`);
    }
  }

  // ##############################

  async getUserById(id: string): Promise<UpdateUserDto> {
    try {
      const user = await this.userModel.findById(id).lean().exec();
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to get user by id: ${error.message}`);
    }
  }

  // // this function to get user by email

  async getUserByEmail(email: string): Promise<CreateUserDto> {
    try {
      const user = await this.userModel.findOne({ email }).lean().exec();
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }
  async VerifyEmail(email: string): Promise<CreateUserDto> {
    try {
      const user = await this.userModel.findOne({ email }).lean().exec();
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }
// ############################

  async deleteUser(id: string): Promise<void> {
    try {
      const result = await this.userModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to delete user: ${error.message}`);
    }
    
  }

  // this function to update user by id
  // async updateUserById(id, userData): Promise<CreateUser> {
  //   const userUpdate = await this.userModel.findByIdAndUpdate(id, userData, {
  //     new: true,
  //   });
  //   if (userUpdate) {
  //     return userUpdate;
  //   } else {
  //     throw new NotFoundException(`User with id ${id} not found`);
  //   }
  // }

  async updateUserById(
    id: string,
    userData: Partial<UpdateUserDto>,
  ): Promise<UpdateUserDto> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, userData, {
          new: true,
          runValidators: true,
        })
        .lean()
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }


}

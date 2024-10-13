import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './Schemas/users.schema';
import { Model, ObjectId } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { UpdateUserDto } from './Dtos/UpdateUser.dtos';
import { CreateUserDto } from './Dtos/createUser.dtos';
import { EmailService } from 'src/email/email.service';
import { error } from 'console';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly emailService: EmailService,
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
      const randomToken = crypto.randomBytes(32).toString('hex');
      const verificationToken = randomToken

      const newUser = new this.userModel({
        ...userData,
        password: hashedPassword,
        verificationToken,
        isVerified: false,
      });
try{  await this.emailService.sendVerificationEmail(
        userData.email as string,
        verificationToken,
      )}catch (error) {
        if (error instanceof ConflictException) {
          throw error;
        }
        throw new Error(`this Error form send email : ${error.message}`);
      }
    

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
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException(`User not found`);
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Old password is incorrect');
      }

      if (oldPassword === newPassword) {
        throw new BadRequestException(
          'New password must be different from the old one',
        );
      }

      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);
      user.password = hashedPassword;
      await user.save();
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error(`Failed to update password: ${error.message}`);
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

  //  this function to get user by email

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

  async verifyEmail(email?: string, token?: string): Promise<void> {
    if (token) {
      // User is logging in for the first time
      const user = await this.userModel.findOne({ verificationToken: token });
      if (!user) {
        throw new NotFoundException('Invalid verification token');
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
    } else if (email) {
      // User has registered before
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('Email not found');
      }

      if (!user.isVerified) {
        throw new UnauthorizedException(
          'Please verify your email before logging in',
        );
      }
    } else {
      throw new BadRequestException(
        'Either email or verification token must be provided',
      );
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

  async initiatePasswordReset(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // Valid for one hour
    await user.save();

    await this.emailService.sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new NotFoundException(
        'Password reset token is invalid or has expired',
      );
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }
}

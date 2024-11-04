import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/Schemas/users.schema';
import * as bcrypt from 'bcryptjs';
import { Login } from 'src/user/Dtos/login.dtos';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private _JwtService: JwtService,
  ) {}

  // login logic here
  async login({ email, password }) {
    if (!email || !password) {
      throw new BadRequestException('Invalid Email OR Password');
    }
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Invalid Email OR Password');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email on Gmail before login',
      );
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Email OR Password');
    }
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
      isActive: user.isActive,
      name: user.name,
    };
    const token = this._JwtService.sign(payload);
    return {
      token,
      userName: payload.name,
      email: user.email,
      role: user.role,
    };
  }

  async adminLogin(
    user: Login,
  ): Promise<{ token: string; email: string; userName: string }> {
    if (!user.email || !user.password) {
      throw new BadRequestException('Invalid Email OR Password');
    }
    const foundUser = await this.userModel.findOne({ email: user.email });

    if (!foundUser || foundUser.role !== 'admin') {
      throw new UnauthorizedException(
        'Invalid credentials or not an admin user',
      );
    }

    if (!foundUser.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      foundUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role,
    };

    return {
      token: await this._JwtService.signAsync(payload),
      email: foundUser.email,
      userName: foundUser.name,
    };
  }
}

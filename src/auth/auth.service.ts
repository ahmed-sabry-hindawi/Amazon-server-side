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
    return { token, userName: payload.name, email: user.email,role:user.role };
  }
}

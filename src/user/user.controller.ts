import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Login } from './Dtos/login.dtos';
import { AuthService } from 'src/auth/auth.service';
import { AuthenticationGuard } from 'src/common/Guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/common/Guards/authorization/authorization.guard';
import { Roles } from 'src/common/Decorators/roles/roles.decorator';
import { UpdateUserDto } from './Dtos/UpdateUser.dtos';
import { CreateUserDto } from './Dtos/createUser.dtos';

@Controller('user')
export class UserController {
  constructor(
    private readonly _UserService: UserService,
    private readonly _AuthService: AuthService,
  ) {}

  @Get('')
  @HttpCode(HttpStatus.FOUND)
  @Roles('admin')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async getAllUser(): Promise<UpdateUserDto[]> {
    return this._UserService.getAllUsers();
  }

  @Get('/one')
  @Roles('user','admin')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @HttpCode(HttpStatus.FOUND)
  findUser( @Request() req): Promise<UpdateUserDto> {
        const userId = req.user.id; // Get user ID from the authenticated user

    return this._UserService.getUserById(userId);
  }

  // @Get('/:id')
  // @Roles('admin')
  // @UseGuards(AuthenticationGuard, AuthorizationGuard)
  // @HttpCode(HttpStatus.FOUND)
  // findUser(@Param('id') id): Promise<UpdateUserDto> {
  //   return this._UserService.getUserById(id);
  // }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async CreateUser(@Body() user: CreateUserDto): Promise<UpdateUserDto> {
    return this._UserService.createNewUser(user);
  }
  @Post('verifyEmail')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body('email')  email: string ) {
    const user = await this._UserService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Email does not exist');
    }
    return { message: 'Email verified, proceed to step 2' };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: Login): Promise<{ token: string,email:string,userName:string }> {
    return await this._AuthService.login(user);
  }

  @Patch('update/password')
  @Roles('user','admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async updatePassword(
    @Request() req,
    @Body('newPassword') newPassword: string, // Properly extract the newPassword from the request body
  ): Promise<any> {
    const userId = req.user.id; // Get user ID from the authenticated user
    console.log(userId);
    console.log(req.user.role);

    await this._UserService.updateUserPassword(userId, newPassword);
    return { message: 'Password updated successfully' };
  }

  @Delete('')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  DeleteUser(@Request() req): Promise<void> {
   const userId = req.user.id; // Get user ID from the authenticated user

    return this._UserService.deleteUser(userId);
  }
  @Patch('/:id')
  @Roles('user','admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  UpdateUserDto(
    @Request() req,
    @Body() userData: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    const userId = req.user.id; // Get user ID from the authenticated user

    return this._UserService.updateUserById(userId, userData);
  }
} // class

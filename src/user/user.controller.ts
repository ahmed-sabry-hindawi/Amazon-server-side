import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class UserController {
  constructor(
    private readonly _UserService: UserService,
    private readonly _AuthService: AuthService,
  ) {}

  @Get('')
  @HttpCode(HttpStatus.FOUND)
  async getAllUser(): Promise<UpdateUserDto[]> {
    return this._UserService.getAllUsers();
  }

  @Get('/:id')
  @Roles('admin')
  // @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @HttpCode(HttpStatus.FOUND)
  findUser(@Param('id') id): Promise<UpdateUserDto> {
    return this._UserService.getUserById(id);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async CreateUser(@Body() user: CreateUserDto): Promise<UpdateUserDto> {
    return this._UserService.createNewUser(user);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: Login): Promise<{ token: string }> {
    return await this._AuthService.login(user);
  }


  @Patch('update/password')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
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

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  DeleteUser(@Param('id') id: any): Promise<void> {
    return this._UserService.deleteUser(id);
  }
  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  UpdateUserDto(
    @Param() { id }: any,
    @Body() userData: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return this._UserService.updateUserById(id, userData);
  }
} // class

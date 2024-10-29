import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { Shipping } from './Schemas/shipping.schema';
import { AuthenticationGuard } from 'src/common/Guards/authentication/authentication.guard';
import { CreateShippingDto } from './Dtos/createSipping.dtos';
import { UpdateShippingDto } from './Dtos/updateShippingDto';
import { Types } from 'mongoose';
import { ShippingService } from './shipping.service';

@Controller('shipping')
@UseGuards(AuthenticationGuard)
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {} // Fixed naming convention

  // create address
  @Post()
  async createAddress(
    @Body() createShippingDto: CreateShippingDto,
    @Req() req,
  ): Promise<Shipping> {

    const userId = req.user.id;
  

    // Check if userId is a valid ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    createShippingDto.userId = userId; // Assign userId to the DTO
    return this.shippingService.createShipping(createShippingDto);
  }

  // get all shipping addresses of the user
  @Get('')
  async getAllAddresses(@Req() req): Promise<Shipping[]> {
    const userId = req.user.id;
    return this.shippingService.getAllShippingAddresses(userId);
  }

  // get the last shipping addresses of the user
  @Get('lastAddresses/')
  async getLastAddresses(@Req() req): Promise<Shipping[]> {
    const userId = req.user.id;
    return this.shippingService.getLastShippingAddresses(userId);
  }

  // update the shipping address by address id
  @Put('address/:id')
  async updateAddress(
    @Param('id') shippingId: string,
    @Body() updateShippingDto: UpdateShippingDto,
    @Req() req,
  ): Promise<Shipping> {
    if (!Types.ObjectId.isValid(shippingId)) {
      // التحقق من صحة الـ shippingId
      throw new BadRequestException('Invalid shipping ID');
    }
    const userId = req.user.id;
    return this.shippingService.updateShippingAddress(
      userId,
      shippingId,
      updateShippingDto,
    );
  }

  // get the active shipping address of the user
  @Get('activeAddress')
  async getActiveAddress(@Req() req): Promise<Shipping> {
    const userId = req.user.id;
    return this.shippingService.getActiveShippingAddress(userId);
  }

  // get the shipping by shipping id
  @Get(':id')
  @HttpCode(HttpStatus.FOUND)
  async getShippingById(@Param('id') id: string): Promise<Shipping> {
    if (!Types.ObjectId.isValid(id)) {
      // التحقق من صحة الـ id
      throw new BadRequestException('Invalid shipping ID');
    }
    return this.shippingService.getShippingById(id);
  }

  // update the shipping status to inactive by id
  @Put('deactivate/:id')
  async deactivateShipping(
    @Param('id') shippingId: string,
    @Req() req,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(shippingId)) {
      // التحقق من صحة الـ shippingId
      throw new BadRequestException('Invalid shipping ID');
    }
    const userId = req.user.id;
    return this.shippingService.deactivateShipping(userId, shippingId);
  }

  // update the shipping status to active by id
  @Put('activate/:id')
  async activateShipping(
    @Param('id') shippingId: string,
    @Req() req,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(shippingId)) {
      // التحقق من صحة الـ shippingId
      throw new BadRequestException('Invalid shipping ID');
    }
    const userId = req.user.id;
    return this.shippingService.activateShipping(userId, shippingId);
  }

  // get the shipping address status
  @Get('status/:id')
  async getShippingStatus(
    @Param('id') shippingId: string,
    @Req() req,
  ): Promise<string> {
    if (!Types.ObjectId.isValid(shippingId)) {
      // التحقق من ��حة ال�� shippingId
      throw new BadRequestException('Invalid shipping ID');
    }
    const userId = req.user.id;
    return this.shippingService.getShippingStatus(userId, shippingId);
  }
}

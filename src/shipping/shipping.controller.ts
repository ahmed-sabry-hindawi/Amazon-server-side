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
} from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CreateShippingDto } from './Dtos/createSipping.dtos';
import { Shipping } from './Schemas/shipping.schema';
import { ObjectId } from 'mongoose';
import { AuthenticationGuard } from 'src/common/Guards/authentication/authentication.guard';

@Controller('shipping')
@UseGuards(AuthenticationGuard)
export class ShippingController {
  constructor(private readonly _ShippingService: ShippingService) {}
  // get all shipping addresses
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllShippings(): Promise<Shipping[]> {
    return this._ShippingService.getAllShippings();
  }
  // add address
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createShipping(
    @Body() createShippingDto: CreateShippingDto,
  ): Promise<Shipping> {
    return this._ShippingService.createShipping(createShippingDto);
  }

  @Get('/userAddresses')
  @HttpCode(HttpStatus.OK)
  async getShippingById(@Req() req): Promise<Shipping[]> {
    const userId = req.user.id; // Get user ID from the authenticated user
    return this._ShippingService.getShippingByUserId(userId);
  }
  @Get('/order/:id')
  @HttpCode(HttpStatus.FOUND)
  async getShippingsByOrderId(
    @Param('id') orderId: ObjectId,
  ): Promise<Shipping[]> {
    return this._ShippingService.getShippingsByOrderId(orderId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateShipping(
    @Param('id') id: ObjectId,
    @Body() updateShippingDto: CreateShippingDto,
  ): Promise<Shipping> {
    return this._ShippingService.updateShipping(id, updateShippingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteShipping(@Param('id') id: ObjectId): Promise<void> {
    await this._ShippingService.deleteShipping(id);
  }
  @Get('status/:status')
  @HttpCode(HttpStatus.OK)
  async getShippingsByStatus(
    @Param('status') status: string,
  ): Promise<Shipping[]> {
    return this._ShippingService.getShippingsByStatus(status);
  }

  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateShippingStatus(
    @Param('id') id: ObjectId,
    @Body('status') status: string,
  ): Promise<Shipping> {
    return this._ShippingService.updateShippingStatus(id, status);
  }
}

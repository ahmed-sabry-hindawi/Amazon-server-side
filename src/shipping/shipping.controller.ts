import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CreateShippingDto } from './Dtos/createSipping.dtos';
import { Shipping } from './Schemas/shipping.schema';
import { ObjectId } from 'mongoose';
import { Roles } from 'src/common/Decorators/roles/roles.decorator';
import { AuthenticationGuard } from 'src/common/Guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/common/Guards/authorization/authorization.guard';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly _ShippingService:ShippingService) {}
  @Get()
  @HttpCode(HttpStatus.FOUND)
  @Roles('admin')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  async getAllShippings(): Promise<Shipping[]> {
    return  this._ShippingService.getAllShippings();
  }
@Post()
@HttpCode(HttpStatus.FOUND)
@Roles('admin')
@UseGuards(AuthenticationGuard,AuthorizationGuard)
  async createShipping(@Body() createShippingDto: CreateShippingDto): Promise<Shipping> {
    return this._ShippingService.createShipping(createShippingDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.FOUND)
  @Roles('admin')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  async getShippingById(@Param('id') id: ObjectId): Promise<Shipping> {
    return this._ShippingService.getShippingById(id);
  }
  @Get('/order/:id')
  @HttpCode(HttpStatus.FOUND)
  @Roles('admin')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  async getShippingsByOrderId(@Param('id') orderId: ObjectId): Promise<Shipping[]> {
    return this._ShippingService.getShippingsByOrderId(orderId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.FOUND)
  @Roles('admin')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  async updateShipping(@Param('id') id: ObjectId, @Body() updateShippingDto: CreateShippingDto): Promise<Shipping> {
    return this._ShippingService.updateShipping(id, updateShippingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.FOUND)
  @Roles('admin')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  async deleteShipping(@Param('id') id: ObjectId): Promise<void> {
    await this._ShippingService.deleteShipping(id);
  }
  @Get('status/:status')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async getShippingsByStatus(@Param('status') status: string): Promise<Shipping[]> {
    return this._ShippingService.getShippingsByStatus(status);
  }

  @Put(':id/status')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async updateShippingStatus(
    @Param('id') id: ObjectId,
    @Body('status') status: string
  ): Promise<Shipping> {
    return this._ShippingService.updateShippingStatus(id, status);
  }


}

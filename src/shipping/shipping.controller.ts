import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CreateShippingDto } from './Dtos/createSipping.dtos';
import { Shipping } from './Schemas/shipping.schema';
import { ObjectId } from 'mongoose';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly _ShippingService:ShippingService) {}
  @Get()
  async getAllShippings(): Promise<Shipping[]> {
    return  this._ShippingService.getAllShippings();
  }
@Post()
  async createShipping(@Body() createShippingDto: CreateShippingDto): Promise<Shipping> {
    return this._ShippingService.createShipping(createShippingDto);
  }

  @Get(':id')
  async getShippingById(@Param('id') id: ObjectId): Promise<Shipping> {
    return this._ShippingService.getShippingById(id);
  }

  @Put(':id')
  async updateShipping(@Param('id') id: ObjectId, @Body() updateShippingDto: CreateShippingDto): Promise<Shipping> {
    return this._ShippingService.updateShipping(id, updateShippingDto);
  }

  @Delete(':id')
  async deleteShipping(@Param('id') id: ObjectId): Promise<Shipping> {
    return this._ShippingService.deleteShipping(id);
  }


}

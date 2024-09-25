import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Shipping } from './Schemas/shipping.schema';
import { CreateShippingDto } from './Dtos/createSipping.dtos';

@Injectable()
export class ShippingService {
  constructor(
    @InjectModel(Shipping.name) private readonly shippingModel: Model<Shipping>,
  ) {}

  async createShipping(createShippingDto: any): Promise<Shipping> {
    try {
      // Ensure the DTO is valid before passing it to the model
      const createdShipping = new this.shippingModel(createShippingDto);

      // Save the shipping document and return the result
      return await createdShipping.save();
    } catch (error) {
      // Add proper error handling, for example, logging the error or specifying the error type
      console.error('Error occurred while creating shipping:', error.message);

      // Handle specific errors (e.g., validation errors) and provide more helpful messages
      if (error.name === 'ValidationError') {
        throw new Error('Invalid data provided for shipping creation');
      }
      throw new Error('Failed to create shipping');
    }
  }

  async getShippingById(id: ObjectId): Promise<Shipping> {
    try {
      const shipping = await this.shippingModel.findById(id).exec();
      if (!shipping) {
        throw new NotFoundException('Shipping not found');
      }
      return shipping;
    } catch (error) {
      throw new Error('Failed to get shipping by id');
    }
  }

  async updateShipping(
    id: ObjectId,
    updateShippingDto: CreateShippingDto,
  ): Promise<Shipping> {
    try {
      const updatedShipping = await this.shippingModel
        .findByIdAndUpdate(id, updateShippingDto, { new: true })
        .exec();
      if (!updatedShipping) {
        throw new NotFoundException('Shipping not found');
      }
      return updatedShipping;
    } catch (error) {
      // Perform error handling
      throw new Error('Failed to update shipping');
    }
  }

  async deleteShipping(id: ObjectId): Promise<Shipping> {
    try {
      const deletedShipping = await this.shippingModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedShipping) {
        throw new NotFoundException('Shipping not found');
      }
      return deletedShipping;
    } catch (error) {
      // Perform error handling
      throw new Error('Failed to delete shipping');
    }
  }

  async getAllShippings(): Promise<Shipping[]> {
    try {
      const shippings = await this.shippingModel.find().exec();
      return shippings;
    } catch (error) {
      throw new Error('Failed to get all shippings');
    }
  }
}

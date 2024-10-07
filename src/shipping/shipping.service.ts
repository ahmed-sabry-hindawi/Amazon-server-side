import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Shipping } from './Schemas/shipping.schema';
import { CreateShippingDto } from './Dtos/createSipping.dtos';

@Injectable()
export class ShippingService {
  constructor(
    @InjectModel(Shipping.name) private readonly shippingModel: Model<Shipping>,
  ) {}
// create shipping
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
  // get shipping by id

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
  // update shipping

  async updateShipping(
    id: ObjectId,
    updateShippingDto: CreateShippingDto,
  ): Promise<Shipping> {
    try {
      const updatedShipping = await this.shippingModel
        .findByIdAndUpdate(id, updateShippingDto, {
          new: true,
          runValidators: true,
        })
        .lean()
        .exec();
      if (!updatedShipping) {
        throw new NotFoundException(`Shipping with id ${id} not found`);
      }
      return updatedShipping;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      throw new Error(`Failed to update shipping: ${error.message}`);
    }
  }
// delete shipping
  async deleteShipping(id: ObjectId): Promise<void> {
    try {
      const result = await this.shippingModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Shipping with id ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to delete shipping: ${error.message}`);
    }
  }
// get all shippings
  async getAllShippings(): Promise<Shipping[]> {
    try {
      const shippings = await this.shippingModel
        .find()
        .populate('orderId')
        .exec();
      return shippings;
    } catch (error) {
      throw new Error('Failed to get all shippings');
    }
  }
  // get shippings by status
  async getShippingsByStatus(status: string): Promise<Shipping[]> {
    try {
      return await this.shippingModel.find({ status }).lean().exec();
    } catch (error) {
      throw new Error(`فشل في الحصول على الشحنات حسب الحالة: ${error.message}`);
    }
  }

  // get shippings by order id
  async getShippingsByOrderId(orderId: ObjectId): Promise<Shipping[]> {
    try {
      return await this.shippingModel.find({ orderId }).lean().exec();
    } catch (error) {
      throw new Error(`فشل في الحصول على الشحنات حسب رقم الطلب: ${error.message}`);
    }
  }
  // update shipping status

  async updateShippingStatus(id: ObjectId, status: string): Promise<Shipping> {
    try {
      const updatedShipping = await this.shippingModel
        .findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
        .lean()
        .exec();
      if (!updatedShipping) {
        throw new NotFoundException(`لم يتم العثور على شحنة برقم ${id}`);
      }
      return updatedShipping;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`فشل في تحديث حالة الشحنة: ${error.message}`);
    }
  }
}

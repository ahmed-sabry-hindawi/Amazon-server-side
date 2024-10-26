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
  async createShipping(
    createShippingDto: CreateShippingDto,
  ): Promise<Shipping> {
    const newShipping = new this.shippingModel(createShippingDto);
    return newShipping.save();
  }

  // get shipping addresses for user by id
  async getShippingByUserId(userId: string): Promise<Shipping[]> {
    return this.shippingModel.find({ userId }).exec();
  }

  // update shipping
  async updateShipping(
    id: ObjectId,
    updateShippingDto: CreateShippingDto,
  ): Promise<Shipping> {
    return this.shippingModel
      .findByIdAndUpdate(id, updateShippingDto, { new: true })
      .exec();
  }
  // delete shipping
  async deleteShipping(id: ObjectId): Promise<void> {
    await this.shippingModel.findByIdAndDelete(id).exec();
  }
  // get all shippings
  async getAllShippings(): Promise<Shipping[]> {
    return this.shippingModel.find().exec();
  }
  // get shippings by status
  async getShippingsByStatus(status: string): Promise<Shipping[]> {
    return this.shippingModel.find({ isActive: status === 'active' }).exec();
  }

  // get shippings by order id
  async getShippingsByOrderId(orderId: ObjectId): Promise<Shipping[]> {
    return this.shippingModel.find({ orderId }).lean().exec();
  }
  // update shipping status

  async updateShippingStatus(id: ObjectId, status: string): Promise<Shipping> {
    const updatedShipping = await this.shippingModel
      .findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
      .lean()
      .exec();
    if (!updatedShipping) {
      throw new NotFoundException(`لم يتم العثور على شحنة برقم ${id}`);
    }
    return updatedShipping;
  }
}

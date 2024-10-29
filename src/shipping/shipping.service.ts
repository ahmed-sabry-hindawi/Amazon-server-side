import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Shipping } from './Schemas/shipping.schema';
import { CreateShippingDto } from './Dtos/createSipping.dtos';
import { UpdateShippingDto } from './Dtos/updateShippingDto';

@Injectable()
export class ShippingService {
  constructor(
    @InjectModel(Shipping.name) private readonly shippingModel: Model<Shipping>,
  ) {}

  async createShipping(
    createShippingDto: CreateShippingDto,
  ): Promise<Shipping> {
    const shipping = new this.shippingModel({
      ...createShippingDto,
    });
    return shipping.save();
  }

  async deleteShipping(id: string): Promise<void> {
    const result = await this.shippingModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Shipping not found');
    }
  }

  // get the last shipping addresses of the user
  async getLastShippingAddresses(userId: string): Promise<Shipping[]> {
    const shippingAddresses = await this.shippingModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();
    if (shippingAddresses.length === 0) {
      throw new NotFoundException('No shipping addresses found');
    }
    return shippingAddresses;
  }

  // update the shipping address by id
  async updateShippingAddress(
    userId: string,
    shippingId: string,
    updateShippingDto: UpdateShippingDto,
  ): Promise<Shipping> {
    const shipping = await this.shippingModel.findByIdAndUpdate(
      shippingId,
      updateShippingDto,
      { new: true },
    );
    if (!shipping) {
      throw new NotFoundException('Shipping not found');
    }
    if (shipping.userId.toString() !== userId) {
      throw new BadRequestException(
        'Unauthorized to update this shipping address',
      );
    }
    return shipping;
  }
  // get the active address for the user
  async getActiveShippingAddress(userId: string): Promise<Shipping> {
    const shipping = await this.shippingModel.findOne({
      userId,
      isActive: true,
    });
    if (!shipping) {
      throw new NotFoundException('No active shipping address found');
    }
    return shipping;
  }
  // get the shipping address by id
  async getShippingById(id: string): Promise<Shipping> {
    const shipping = await this.shippingModel.findById(id);
    if (!shipping) {
      throw new NotFoundException('Shipping not found');
    }
    return shipping;
  }

  // get all addresses for user
  async getAllShippingAddresses(userId: string): Promise<Shipping[]> {
    const shippingAddresses = await this.shippingModel.find({ userId }).exec();
    if (shippingAddresses.length === 0) {
      throw new NotFoundException('No shipping addresses found');
    }
    return shippingAddresses;
  }
  // update the shipping status to inactive by id
  async deactivateShipping(userId: string, shippingId: string): Promise<void> {
    const shipping = await this.shippingModel.findByIdAndUpdate(
      shippingId,
      { isActive: false },
      { new: true },
    );
    if (!shipping) {
      throw new NotFoundException('Shipping not found');
    }
    if (shipping.userId.toString() !== userId) {
      throw new BadRequestException(
        'Unauthorized to deactivate this shipping address',
      );
    }
  }

  // update the shipping status to active by id
  async activateShipping(userId: string, shippingId: string): Promise<void> {
    const shipping = await this.shippingModel.findByIdAndUpdate(
      shippingId,
      { isActive: true },
      { new: true },
    );
    if (!shipping) {
      throw new NotFoundException('Shipping not found');
    }
    if (shipping.userId.toString() !== userId) {
      throw new BadRequestException(
        'Unauthorized to activate this shipping address',
      );
    }
  }

  // get the shipping address status
  async getShippingStatus(userId: string, shippingId: string): Promise<string> {
    const shipping = await this.shippingModel.findById(shippingId);
    if (!shipping) {
      throw new NotFoundException('Shipping not found');
    }
    if (shipping.userId.toString() !== userId) {
      throw new BadRequestException(
        'Unauthorized to view this shipping address',
      );
    }
    return shipping.isActive ? 'Active' : 'Inactive';
  }
}

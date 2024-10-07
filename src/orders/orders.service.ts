import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/Update-order.dto';
import { User } from 'src/user/Schemas/users.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Create a new order
  async create(createOrder: CreateOrderDto): Promise<Order> {
    return await this.orderModel.create(createOrder);
  }

  // Get all orders (for admin)
  async findAll(): Promise<Order[]> {
    return await this.orderModel
      .find()
      .populate('userId')
      .populate('paymentId')
      .exec();
  }

  // Get order by ID
  async findById(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('userId')
      .populate('paymentId')
      .exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  // Get orders by user ID
  async findByUserId(userId: string): Promise<Order[]> {
    return await this.orderModel.find({ userId }).populate('paymentId').exec();
  }

  // Get orders by status (for Admin)
  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return await this.orderModel
      .find({ 'orderStatus.en': status })
      .populate('userId')
      .populate('paymentId')
      .exec();
  }

  // Update order by ID
  async updateById(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, {
        new: true,
      })
      .populate('userId');
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  // Delete order by ID
  async deleteById(id: string): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndDelete(id)
      .populate('userId');
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  /////////////////////////

  // Update order status by ID (for Admin)
  async updateStatus(
    id: string,
    statusDto: { en: OrderStatus; ar: string },
  ): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { orderStatus: statusDto },
      { new: true }, // return the updated document
    );
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  // Get recent orders
  async findRecent(limit: number = 10): Promise<Order[]> {
    return await this.orderModel
      .find()
      .sort({ orderDate: -1 })
      .limit(limit)
      .populate('userId')
      .populate('paymentId')
      .exec();
  }
}

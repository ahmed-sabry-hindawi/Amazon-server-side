import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/Update-order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  // Create a new order
  async create(createOrder: CreateOrderDto): Promise<Order> {
    return await this.orderModel.create(createOrder); 
  }

  // Get all orders (for admin)
  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('userId').populate('paymentId').exec();
  }

  // Get order by ID
  async findById(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).populate('userId').populate('paymentId').exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  // Update order by ID
  async updateById(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }


//   async updateById(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
//     const order = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true });
//     if (!order) {
//       throw new NotFoundException(`Order with ID ${id} not found`);
//     }
//     return order;
//   }

  // Delete order by ID
  async deleteById(id: string): Promise<Order> {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  /////////////////////////

  // Get orders by user ID
async findByUserId(userId: string): Promise<Order[]> {
    return await this.orderModel.find({ userId }).populate('paymentId').exec();
  }

  // Get orders by status (for Admin)
async findByStatus(status: OrderStatus): Promise<Order[]> {
    return await this.orderModel.find({ 'orderStatus.en': status }).populate('userId').populate('paymentId').exec();
  }

  // Update order status by ID (for Admin)
async updateStatus(id: string, statusDto: { en: OrderStatus; ar: string }): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(id, { orderStatus: statusDto }, { new: true });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  // Get recent orders
async findRecent(limit: number = 10): Promise<Order[]> {
    return this.orderModel.find().sort({ orderDate: -1 }).limit(limit).populate('userId').populate('paymentId').exec();
  }

}

import { Controller, Get, Post, Put, Delete, Param, Body, Query, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/Update-order.dto';
import { Order } from './schemas/order.schema';
import { OrderStatus } from './schemas/order.schema';

@Controller('orders')
export class OrdersController {
  constructor(private  ordersService: OrdersService) {}

  // Create a new order
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  // Get all orders
  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  // Get order by ID
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findById(id);
  }

  // Update order by ID
  @Patch(':id')  
  async updateById(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.ordersService.updateById(id, updateOrderDto);
  }


//   @Put(':id')
//   async updateById(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
//     return this.ordersService.updateById(id, updateOrderDto);
//   }

  // Delete order by ID
  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<Order> {
    return this.ordersService.deleteById(id);
  }

  // Get orders by user ID
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<Order[]> {
    return this.ordersService.findByUserId(userId);
  }

  // Get orders by status
  @Get('status/:status')
  async findByStatus(@Param('status') status: OrderStatus): Promise<Order[]> {
    return this.ordersService.findByStatus(status);
  }

  // Update order status
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() statusDto: { en: OrderStatus; ar: string }): Promise<Order> {
    return this.ordersService.updateStatus(id, statusDto);
  }

  // Get recent orders
  @Get('recent')
  async findRecent(@Query('limit') limit: number): Promise<Order[]> {
    return this.ordersService.findRecent(limit);
  }
}
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Patch,
  UseGuards,
  Request,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/Update-order.dto';
import { Order } from './schemas/order.schema';
import { OrderStatus } from './schemas/order.schema';
import { AuthenticationGuard } from 'src/common/Guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/common/Guards/authorization/authorization.guard';
import { Roles } from 'src/common/Decorators/roles/roles.decorator';
import { CartsService } from '../carts/carts.service';
import { Types } from 'mongoose';

@Controller('orders')
@UseGuards(AuthenticationGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService, private cartService: CartsService) {}


  @Post()
  
  async create(
    @Request() req,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const userId = req.user.id; // Get user ID from the authenticated user
    createOrderDto.userId = userId;
    const order = await this.ordersService.create(createOrderDto);
    if (!order) {
      throw new HttpException('Failed to create order', HttpStatus.BAD_REQUEST);
    }
    await this.cartService.deleteCartByUserId(userId); // Delete the cart after order creation
    return order;
  }

  // Initiate a new order without deleting the cart

  @Post('initiate')
  async initiateOrder(
    @Request() req,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const userId = req.user.id; // Get user ID from the authenticated user
    createOrderDto.userId = userId;
    // placeholders for address and paymentId
    createOrderDto.shippingAddress = "Placeholder Address";
    createOrderDto.paymentId = new Types.ObjectId().toString(); 
    const order = await this.ordersService.create(createOrderDto);
    if (!order) {
      throw new HttpException('Failed to initiate order', HttpStatus.BAD_REQUEST);
    }
    return order;
  }

  // Complete the order by adding address and payment ID, then delete the cart

  @Patch('complete/:id')
  
  async completeOrder(
    @Param('id') orderId: string,
    @Request() req,
    @Body() updateOrderDto: UpdateOrderDto, // Assuming this DTO includes address and paymentId
  ): Promise<Order> {
    const userId = req.user.id;

    // Check if shippingAddress and paymentId are provided
    if (!updateOrderDto.shippingAddress || !updateOrderDto.paymentId) {
      throw new HttpException('Shipping address and payment ID are required', HttpStatus.BAD_REQUEST);
    }
    // Set the order status to completed
    updateOrderDto.orderStatus = OrderStatus.Completed;

    // Update the order with the address, payment ID, and status
    const updatedOrder = await this.ordersService.updateById(orderId, updateOrderDto);
    if (!updatedOrder) {
      throw new HttpException('Failed to complete order', HttpStatus.BAD_REQUEST);
    }

    // Delete the cart after order completion
    await this.cartService.deleteCartByUserId(userId);
    return updatedOrder;
  }

  // Get all orders
  // done
  @Get()
  @Roles('admin')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async findAll(): Promise<Order[]> {
    return await this.ordersService.findAll();
  }

  // Get recent orders
  // done
  @Get('recent')
  @Roles('admin')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async findRecent(@Query('limit') limit: number): Promise<Order[]> {
    return await this.ordersService.findRecent(limit);
  }

  // Get orders by user ID
  // done
  @Get('user')
  
  async findByUserId(@Request() req): Promise<Order[]> {
    const userId = req.user.id; // Get user ID from the authenticated use
    return await this.ordersService.findByUserId(userId);
  }

  // Get order by ID
  // done
  @Get(':id')
  
  async findById(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.findById(id);
  }

  // Get orders by status
  // done
  @Get('status/:status')
  
  async findByStatus(@Param('status') status: OrderStatus): Promise<Order[]> {
    return await this.ordersService.findByStatus(status);
  }

  ////////////////// stoppp

  // Update order by ID
  @Patch(':id')
  
  async updateById(@Request() req,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    //first check if the order created by this user
    const userId = req.user.id; 
    const userOrders =await this.ordersService.findByUserId(userId);
    const isBelongTo=userOrders.find(order => order.userId === userId)
    if (!isBelongTo) {
      throw new ForbiddenException('You are not authorized to update this order');
    }
    return this.ordersService.updateById(id, updateOrderDto);
  }

  // Update order status
  @Patch(':id/status')
  @Roles('admin') // may be seller ??
  
  async updateStatus( @Param('id') id: string, @Body() status: OrderStatus ): Promise<Order> {
    return this.ordersService.updateStatus(id, status);
  }

  // Delete order by ID
  @Delete(':id')
  
  async deleteById (@Request() req,@Param('id') id: string): Promise<Order> {
    //first check if the order created by this user
    const userId = req.user.id; 
    const userRole = req.user.role; 
    console.log(userRole);
    if (userRole === 'admin') {
      return await this.ordersService.deleteById(id);
    }
    const userOrders =await this.ordersService.findByUserId(userId);
    const isBelongTo=userOrders.find(order => order.userId === userId)
    if (!isBelongTo) {
      throw new ForbiddenException('You are not authorized to Delete this order');
    }
    return this.ordersService.deleteById(id);
  }

  @Patch(':id/cancel')
  
  async cancelOrder(@Param('id') id: string): Promise<Order> {
    return this.ordersService.updateStatus(id, OrderStatus.CANCELLED);
  }

  @Get('cancelled')
  @Roles('admin')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async findCancelled(): Promise<Order[]> {
    return await this.ordersService.findByStatus(OrderStatus.CANCELLED);
  }

  @Patch('user/:id/cancel')
  
  async cancelUserOrder(@Request() req, @Param('id') id: string): Promise<Order> {
    const userId = req.user.id;
    const order = await this.ordersService.findById(id);
    if (order.userId !== userId) {
      throw new ForbiddenException('You are not authorized to cancel this order');
    }
    return this.ordersService.updateStatus(id, OrderStatus.CANCELLED);
  }

  @Get('user/cancelled')
  
  async findUserCancelledOrders(@Request() req): Promise<Order[]> {
    const userId = req.user.id;
    return await this.ordersService.findUserOrdersByStatus(userId, OrderStatus.CANCELLED);
  }

  // Get user active orders
  @Get('user/active')
  @UseGuards(AuthenticationGuard)
  async findUserActiveOrders(@Request() req): Promise<Order[]> {
    const userId = req.user.id;
    return await this.ordersService.findAllExceptCancelled(userId);
  }
}

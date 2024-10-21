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
  ParseEnumPipe,
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


  // Initiate a new order without deleting the cart
  // done
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
  // done
  @Patch('complete/:id')
  async completeOrder(
    @Param('id') orderId: string,
    @Request() req,
    @Body() updateOrderDto: UpdateOrderDto, // Assuming this DTO includes address and paymentId
  ): Promise<Order> {
    const userId = req.user.id;

    // Check if shippingAddress and paymentId are provided
    // if (!updateOrderDto.shippingAddress || !updateOrderDto.paymentId) {
    //   throw new HttpException('Shipping address and payment ID are required', HttpStatus.BAD_REQUEST);
    // }
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
  // @Roles('admin')
  // @UseGuards( AuthorizationGuard)
  async findAll(): Promise<Order[]> {
    return await this.ordersService.findAll();
  }

  // Get recent orders
  // done
  @Get('recent')
  @Roles('admin')
  @UseGuards(AuthorizationGuard)
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
  @Roles('admin')
  @UseGuards(AuthorizationGuard)
  async findByStatus(@Param('status') status: OrderStatus): Promise<Order[]> {
    return await this.ordersService.findByStatus(status);
  }

  ////////////////// stoppp

  // Update order by ID
  // need to check the update criteria
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
  // user not allowed to update all status just can cancel this why he is not included in the update status
  // done
  @Patch('status/:id')
  @Roles('admin','seller')
  @UseGuards(AuthorizationGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus
  ): Promise<Order> {
    try {
      const order = await this.ordersService.updateStatus(id, status);
      return order;
    } catch (error) {
      throw new HttpException('Failed to update order status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Delete order by ID
  // done
  @Delete(':id')
  @Roles('admin','user')
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

  // cancel order for user and admin
  // done
  @Patch('cancel/:id')
  @Roles('admin','user')
  @UseGuards(AuthorizationGuard)
  async cancelOrder(@Request() req, @Param('id') id: string): Promise<Order> {
    const userId = req.user.id;
    const userRole = req.user.role;
    const order = await this.ordersService.findById(id);
    if (userRole === 'user' && order.userId._id != userId) {
      throw new ForbiddenException('You are not authorized to cancel this order');
    };
    if (userRole === 'admin') {
      return this.ordersService.updateStatus(id, OrderStatus.CANCELLED);
    };
    return this.ordersService.updateStatus(id, OrderStatus.CANCELLED);
  }

  // Get user cancelled orders
  // done
  @Get('user/cancelled')
  @Roles('user')
  async findUserCancelledOrders(@Request() req): Promise<Order[]> {
    const userId = req.user.id;
    return await this.ordersService.findUserOrdersByStatus(userId, OrderStatus.CANCELLED);
  }

  // Get user active orders
  // done
  @Get('user/active')
  @Roles('user')
  async findUserActiveOrders(@Request() req): Promise<Order[]> {
    const userId = req.user.id;
    return await this.ordersService.findAllExceptCancelled(userId);
  }
}

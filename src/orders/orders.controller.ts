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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/Update-order.dto';
import { Order } from './schemas/order.schema';
import { OrderStatus } from './schemas/order.schema';
import { AuthenticationGuard } from 'src/common/Guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/common/Guards/authorization/authorization.guard';
import { Roles } from 'src/common/Decorators/roles/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // Create a new order
  // done
  @Post()
  @UseGuards(AuthenticationGuard)
  async create(
    @Request() req,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const userId = req.user.id; // Get user ID from the authenticated use
    createOrderDto.userId = userId;
    return await this.ordersService.create(createOrderDto);
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
  @UseGuards(AuthenticationGuard)
  async findByUserId(@Request() req): Promise<Order[]> {
    const userId = req.user.id; // Get user ID from the authenticated use
    return await this.ordersService.findByUserId(userId);
  }

  // Get order by ID
  // done
  @Get(':id')
  @UseGuards(AuthenticationGuard)
  async findById(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.findById(id);
  }

  // Get orders by status
  // done
  @Get('status/:status')
  @UseGuards(AuthenticationGuard)
  async findByStatus(@Param('status') status: OrderStatus): Promise<Order[]> {
    return await this.ordersService.findByStatus(status);
  }

  ////////////////// stoppp

  // Update order by ID
  @Patch(':id')
  @UseGuards(AuthenticationGuard)
  async updateById(@Request() req,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    //fisrt check if the order created by this user
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
  @UseGuards(AuthenticationGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() statusDto: { en: OrderStatus; ar: string },
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, statusDto);
  }

  // Delete order by ID
  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  async deleteById (@Request() req,@Param('id') id: string): Promise<Order> {
    //fisrt check if the order created by this user
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
}

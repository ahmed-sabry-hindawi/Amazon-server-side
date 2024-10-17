import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Request,
  InternalServerErrorException,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { RemoveItemDto } from './dto/remove-item.dto';
import { Cart } from './schemas/cart.schema';
import { AuthenticationGuard } from 'src/common/Guards/authentication/authentication.guard';
import { Order } from 'src/orders/schemas/order.schema';
import { Types } from 'mongoose';
import { ProductItemDto } from 'src/orders/dto/Product-item.dto';
import { Roles } from 'src/common/Decorators/roles/roles.decorator';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}


  // Add item to cart
  //done
  @Patch('user/add-item')
  @UseGuards(AuthenticationGuard)
  @Roles('user')
  async addItem(@Request() req, @Body() addItemDto: AddItemDto): Promise<Cart> {
    try {
      const userId = req.user.id;
      return await this.cartsService.addItem(userId, addItemDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to add item to cart');
    }
  }

  // Remove item from cart
  //done
  @Patch('user/remove-item')
  @UseGuards(AuthenticationGuard)
  @Roles('user')
  async removeItem(
    @Request() req,
    @Body() removeItemDto: RemoveItemDto,
  ): Promise<Cart> {
    try {
      const userId = req.user.id;
      const productId = new Types.ObjectId(removeItemDto.productId);
      return await this.cartsService.removeItem(userId, productId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to remove item from cart');
    }
  }



  // Get cart by user ID
  //done
  @Get('user')
  @UseGuards(AuthenticationGuard)
  @Roles('user')
  async findByUserId(@Request() req): Promise<Cart> {
    try {
      const userId = req.user.id;
      return await this.cartsService.findByUserId(userId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve cart');
    }
  }

  // Update cart by user ID
  // done 
  @Patch('user')
  @UseGuards(AuthenticationGuard)
  @Roles('user')
  async updateByUserId(
    @Request() req,
    @Body() productItemDto: ProductItemDto,
  ): Promise<Cart> {
    try {
      const userId = req.user.id;
      return await this.cartsService.updateByUserId(userId, productItemDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update cart');
    }
  }

  // Delete cart by user ID
  @Delete('user')
  @UseGuards(AuthenticationGuard)
  async deleteByUserId(@Request() req): Promise<Cart> {
    try {
      const userId = req.user.id;
      return await this.cartsService.deleteCartByUserId(userId);
    } catch (error) {
      throw new InternalServerErrorException('No cart Found');
    }
  }
}

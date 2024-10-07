import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { Product } from 'src/products/schemas/product.schema';
import { Order } from 'src/orders/schemas/order.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { ProductItemDto } from 'src/orders/dto/Product-item.dto';
import { ObjectId } from 'mongodb'; // Import ObjectId from the appropriate package

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  // Create a new cart

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    try {
      const cart = await this.cartModel.findOne({
        userId: createCartDto.userId,
      });
      if (cart) {
        throw new Error('Cart already exists for this user');
      }
      return await this.cartModel.create(createCartDto);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create cart: ${error.message}`,
      );
    }
  }

  // Get cart by user ID
  async findByUserId(userId: string): Promise<Cart> {
    try {
      const cart = await this.cartModel
        .findOne({ userId })
        .populate('userId')
        .populate({ path: 'items.productId', model: 'Product' }); // Populating productId within items array
      if (!cart) {
        throw new NotFoundException(`Cart for user ID ${userId} not found`);
      }
      return cart;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve cart');
    }
  }

  // Update cart by user ID
  async updateByUserId(
    userId: string,
    productItemDto: ProductItemDto,
  ): Promise<Cart> {
    try {
      // Ensure the cart exists
      const cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        throw new NotFoundException(`Cart for user ID ${userId} not found`);
      }

      // Find the product in the cart
      const productId = new Types.ObjectId(productItemDto.productId);
      const existingItemIndex = cart.items.findIndex((i) =>
        i.productId.equals(productId),
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        cart.items[existingItemIndex].quantity = productItemDto.quantity;
      } else {
        // Add new item if it does not exist
        cart.items.push({ productId, quantity: productItemDto.quantity });
      }

      // Recalculate the total price
      cart.totalPrice = await this.calculateTotalPrice(
        cart.items.map((item) => ({
          productId: item.productId.toString(),
          quantity: item.quantity,
        })),
      );

      // Save the updated cart
      return await cart.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update cart: ${error.message}`,
      );
    }
  }

  // Remove item from cart
  async removeItem(userId: string, productId: Types.ObjectId): Promise<Cart> {
    try {
      const cart = await this.cartModel.findOne({ userId });
      if (!cart)
        throw new NotFoundException(`Cart for user ID ${userId} not found`);

      // const productId = new Types.ObjectId(removeItemDto.productId);
      cart.items = cart.items.filter(
        (item) => !item.productId.equals(productId),
      );

      cart.totalPrice = await this.calculateTotalPrice(
        cart.items.map((item) => ({
          productId: item.productId.toString(),
          quantity: item.quantity,
        })),
      );
      return await cart.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to remove item from cart');
    }
  }

  // Add item to cart
  async addItem(userId: string, addItemDto: AddItemDto): Promise<Cart> {
    try {
      // Attempt to find the user's cart
      let cart = await this.cartModel
        .findOne({ userId })
        .populate('userId')
        .populate({ path: 'items.productId', model: 'Product' });

      // If no cart exists, create a new one
      if (!cart) {
        cart = await this.create({
          userId,
          items: [],
          totalPrice: 0,
        } as CreateCartDto);
      }

      const productId = addItemDto.productId;
      const existingItem = cart.items.find((item) =>
        item.productId.equals(productId),
      );

      if (existingItem) {
        existingItem.quantity += addItemDto.quantity; // Update quantity
      } else {
        cart.items.push({
          productId: new ObjectId(productId),
          quantity: addItemDto.quantity,
        }); // Add new item
      }

      const product = await this.productModel.findById(productId);
      if (!product)
        throw new NotFoundException(`Product with ID ${productId} not found`);

      cart.totalPrice += addItemDto.quantity * product.price; // Update totalPrice
      return await cart.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to add item to cart');
    }
  }

  // Checkout process
  // need to confirm
  async checkout(userId: string): Promise<Order> {
    try {
      const cart = await this.cartModel.findOne({ userId });
      if (!cart || cart.items.length === 0) {
        throw new NotFoundException(`Cart for user ID ${userId} is empty`);
      }

      const order = new this.orderModel({
        userId,
        items: cart.items,
        totalPrice: cart.totalPrice,
        shippingAddress: 'Shipping address',
        paymentId: new Types.ObjectId(), // Placeholder for payment ID
      });

      await order.save();
      await this.cartModel.deleteOne({ userId });
      return order;
    } catch (error) {
      throw new InternalServerErrorException('Failed to checkout');
    }
  }

  // Delete cart by user ID
  //done
  async deleteByUserId(userId: string): Promise<Cart> {
    try {
      const cart = await this.cartModel.findOneAndDelete({ userId });
      if (!cart) {
        throw new NotFoundException(`Cart for user ID ${userId} not found`);
      }
      return cart;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete cart');
    }
  }

  // Helper method to calculate total price
  private async calculateTotalPrice(items: ProductItemDto[]): Promise<number> {
    let total = 0;
    for (const item of items) {
      const product = await this.productModel.findById(item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }
    return total;
  }
}

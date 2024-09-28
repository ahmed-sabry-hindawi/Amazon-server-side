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
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { RemoveItemDto } from './dto/remove-item.dto';
import { ProductItemDto } from 'src/orders/dto/Product-item.dto';

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
      throw new InternalServerErrorException('Failed to create cart');
    }
  }

  // Get cart by user ID
  async findByUserId(userId: string): Promise<Cart> {
    try {
      const cart = (await this.cartModel.findOne({ userId })).populate(
        'userId',
      );
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
    updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    try {
      // Find the cart for the user
      let cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        throw new NotFoundException(`Cart for user ID ${userId} not found`);
      }

      // Check if the items array is provided in the update DTO
      if (updateCartDto.items) {
        for (const updateItem of updateCartDto.items) {
          // Convert the productId to ObjectId
          const productIdObjectId = new Types.ObjectId(updateItem.productId);

          // Find the existing item in the cart by productId (ObjectId comparison)
          const existingItem = cart.items.find((item) =>
            item.productId.equals(productIdObjectId),
          );

          // If the item exists, update its quantity; otherwise, add it as a new item
          if (existingItem) {
            existingItem.quantity = updateItem.quantity;
          } else {
            // Add the new item to the cart if it doesn't exist
            cart.items.push({
              productId: productIdObjectId, // Use ObjectId here
              quantity: updateItem.quantity,
            });
          }
        }
      }

      // Recalculate the total price based on updated items
      cart.totalPrice = await this.calculateTotalPrice(
        cart.items.map((item) => ({
          productId: item.productId.toString(),
          quantity: item.quantity,
        })),
      );

      // Save the updated cart and return it
      return await cart.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to update cart');
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
      let cart = await this.cartModel.findOne({ userId });

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
        cart.items.push({ productId, quantity: addItemDto.quantity }); // Add new item
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
        shippingAddress: { en: 'Shipping address', ar: 'عنوان الشحن' },
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

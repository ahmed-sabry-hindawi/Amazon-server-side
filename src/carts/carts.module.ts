import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';
import { Order, OrderSchema } from 'src/orders/schemas/order.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), // Ensure this is included
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), // Ensure this is included
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
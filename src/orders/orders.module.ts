import { User, UserSchema } from 'src/user/Schemas/users.schema';
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { UserModule } from 'src/user/user.module';
import { CartsService } from '../carts/carts.service';
import { Cart, CartSchema } from 'src/carts/schemas/cart.schema';
import { CartsModule } from 'src/carts/carts.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Order.name,schema:OrderSchema},{name:Cart.name,schema:CartSchema},{name:User.name,schema:UserSchema}]),UserModule,CartsModule],
  controllers: [OrdersController],
  providers: [OrdersService, CartsService],
  exports: [MongooseModule, OrdersService],
})
export class OrdersModule{}

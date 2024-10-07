import { User } from 'src/user/Schemas/users.schema';
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { UserModule } from 'src/user/user.module';
// import { UserModule } from 'src/user/user.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Order.name,schema:OrderSchema},{name:User.name,schema:User}]),UserModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [MongooseModule],
})
export class OrdersModule{}
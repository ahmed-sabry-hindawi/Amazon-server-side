import { Module } from '@nestjs/common';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipping, ShippingSchema } from './Schemas/shipping.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Shipping.name, schema: ShippingSchema }])],
  controllers: [ShippingController],
  providers: [ShippingService]
})
export class ShippingModule {}

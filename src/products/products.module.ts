import { forwardRef, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CloudinaryModule,
    forwardRef(() => OrdersModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [MongooseModule],
})
export class ProductsModule {}

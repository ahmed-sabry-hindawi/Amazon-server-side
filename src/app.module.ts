import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { PaymentsModule } from './payments/payments.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategoryModule } from './sub-category/sub-category.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://ahmedsaprey1:Ahmed41%23@iticluster.9tvoi6h.mongodb.net/amazon',
    ),
    ProductsModule,
    CategoriesModule,
    PaymentsModule,
    SubCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

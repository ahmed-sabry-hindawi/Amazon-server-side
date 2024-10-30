import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Seller, SellerSchema } from './schemas/seller.schema';
import { User, UserSchema } from 'src/user/Schemas/users.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Seller.name, schema: SellerSchema },{name:User.name,schema:UserSchema}])],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [MongooseModule],
})
export class SellerModule {}

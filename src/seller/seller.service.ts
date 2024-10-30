import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { Seller } from './schemas/seller.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/Schemas/users.schema';
@Injectable()
export class SellerService {
  constructor(
    @InjectModel('Seller') private sellerModel: Model<Seller>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async createSeller(
    createSellerDto: CreateSellerDto,
    userId: string,
    status: 'pending' = 'pending',
  ): Promise<Seller> {
    try {
      return await this.sellerModel.create({ ...createSellerDto, userId, status });
    } catch (error) {
      throw new HttpException('Error creating seller: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateSellerStatus(id: string, status: 'approved' | 'rejected'): Promise<Seller> {
    try {
      const seller = await this.sellerModel.findById(id);
      if (!seller) {
        throw new NotFoundException(`Seller with ID ${id} not found`);
      }

      seller.status = status;
      await seller.save();

      if (status === 'approved') {
        const user = await this.userModel.findById(seller.userId);
        if (!user) {
          throw new NotFoundException(`User with ID ${seller.userId} not found`);
        }
        user.role = 'seller';
        await user.save();
      }

      return seller;
    } catch (error) {
      throw new HttpException('Error updating seller status: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async checkUserSellerStatus(userId: string): Promise<{ role: string; sellerStatus?: string }> {
    const seller = await this.sellerModel.findOne({ userId: userId });
    if (seller) {
      return { role: 'user', sellerStatus: seller.status };
    }

    return { role: 'user' };
  }
}

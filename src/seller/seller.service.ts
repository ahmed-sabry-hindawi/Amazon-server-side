import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
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

  async getAllSellers(): Promise<Seller[]> {
    try {
      return await this.sellerModel.find().exec();
    } catch (error) {
      throw new HttpException('Error fetching sellers: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getSellersByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Seller[]> {
    try {
      return await this.sellerModel.find({ status }).exec();
    } catch (error) {
      throw new HttpException('Error fetching sellers by status: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getSellerById(id: string): Promise<Seller> {
    try {
      const seller = await this.sellerModel.findById(id);
      if (!seller) {
        throw new NotFoundException(`Seller with ID ${id} not found`);
      }
      return seller;
    } catch (error) {
      throw new HttpException('Error fetching seller: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getSellerByUserId(userId: string): Promise<Seller> {
    try {
      const seller = await this.sellerModel.findOne({ userId });
      if (!seller) {
        throw new NotFoundException(`Seller with user ID ${userId} not found`);
      }
      return seller;
    } catch (error) {
      throw new HttpException('Error fetching seller: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateSellerProfile(id: string, updateData: UpdateSellerDto): Promise<Seller> {
    try {
      const seller = await this.sellerModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
      if (!seller) {
        throw new NotFoundException(`Seller with ID ${id} not found`);
      }
      return seller;
    } catch (error) {
      throw new HttpException('Error updating seller: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteSeller(id: string): Promise<void> {
    try {
      const seller = await this.sellerModel.findById(id);
      if (!seller) {
        throw new NotFoundException(`Seller with ID ${id} not found`);
      }
      // Reset user role if seller is approved
      if (seller.status === 'approved') {
        const user = await this.userModel.findById(seller.userId);
        if (user) {
          user.role = 'user';
          await user.save();
        }
      }
      await this.sellerModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException('Error deleting seller: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getSellerStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }> {
    try {
      const [total, pending, approved, rejected] = await Promise.all([
        this.sellerModel.countDocuments(),
        this.sellerModel.countDocuments({ status: 'pending' }),
        this.sellerModel.countDocuments({ status: 'approved' }),
        this.sellerModel.countDocuments({ status: 'rejected' }),
      ]);
      
      return { total, pending, approved, rejected };
    } catch (error) {
      throw new HttpException('Error fetching seller stats: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

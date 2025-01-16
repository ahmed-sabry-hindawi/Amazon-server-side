import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { Seller } from './schemas/seller.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/Schemas/users.schema';
import { OrderStatus } from '../orders/schemas/order.schema';
import { Product } from '../products/schemas/product.schema';
import { Order } from '../orders/schemas/order.schema';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel('Seller') private sellerModel: Model<Seller>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectModel('Product') private productModel: Model<Product>,
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
      const seller = await this.sellerModel.findOne({ userId }).populate({ path: 'userId', select: '-password' });
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

  async getSellerDashboardStats(sellerId: string) {
    try {
      // Get all orders that contain products from this seller
      const orders = await this.orderModel.aggregate([
        {
          $unwind: '$items'  // Unwind the items array to work with individual items
        },
        {
          $lookup: {
            from: 'products',
            let: { productId: '$items.productId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$productId'] },
                      { $eq: ['$sellerId', new Types.ObjectId(sellerId)] }
                    ]
                  }
                }
              }
            ],
            as: 'sellerProduct'
          }
        },
        {
          $match: {
            'sellerProduct': { $ne: [] }  // Only keep orders with products from this seller
          }
        },
        {
          $group: {
            _id: '$_id',
            orderStatus: { $first: '$orderStatus' },
            items: { $push: '$items' },
            createdAt: { $first: '$createdAt' },
            products: { $push: { $arrayElemAt: ['$sellerProduct', 0] } }
          }
        }
      ]);

      // Get all products from this seller
      const products = await this.productModel.find({ 
        sellerId: new Types.ObjectId(sellerId) 
      });

      // Calculate statistics
      const stats = {
        orders: {
          total: orders.length,
          pending: orders.filter(o => o.orderStatus === OrderStatus.Pending).length,
          completed: orders.filter(o => o.orderStatus === OrderStatus.Completed).length,
          shipped: orders.filter(o => o.orderStatus === OrderStatus.SHIPPED).length,
          delivered: orders.filter(o => o.orderStatus === OrderStatus.DELIVERED).length,
          cancelled: orders.filter(o => o.orderStatus === OrderStatus.CANCELLED).length,
        },
        products: {
          total: products.length,
          inStock: products.filter(p => p.stock > 0).length,
          outOfStock: products.filter(p => p.stock === 0).length,
          lowStock: products.filter(p => p.stock <= 5).length, // Assuming 5 is low stock threshold
        },
        revenue: {
          total: orders
            .filter(o => o.orderStatus !== OrderStatus.CANCELLED)
            .reduce((acc, order) => {
              const sellerItems = order.items.filter(item => 
                order.products.some(p => 
                  p._id.equals(item.productId) && p.sellerId.equals(sellerId)
                )
              );
              return acc + sellerItems.reduce((sum, item) => {
                const product = order.products.find(p => p._id.equals(item.productId));
                return sum + (product.price * item.quantity);
              }, 0);
            }, 0),
        },
        recentOrders: orders
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 5),
        topProducts: await this.productModel.aggregate([
          {
            $match: { sellerId: new Types.ObjectId(sellerId) }
          },
          {
            $lookup: {
              from: 'orders',
              localField: '_id',
              foreignField: 'items.productId',
              as: 'orders'
            }
          },
          {
            $project: {
              name: 1,
              totalSold: {
                $size: '$orders'
              }
            }
          },
          {
            $sort: { totalSold: -1 }
          },
          {
            $limit: 5
          }
        ])
      };

      return stats;
    } catch (error) {
      throw new HttpException(
        'Error fetching seller dashboard stats: ' + error.message,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}

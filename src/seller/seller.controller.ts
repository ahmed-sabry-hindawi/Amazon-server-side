import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Get,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { Seller } from './schemas/seller.schema';
import { Roles } from 'src/common/Decorators/roles/roles.decorator';
import { AuthenticationGuard } from 'src/common/Guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/common/Guards/authorization/authorization.guard';
// import { User } from '@/user/schemas/user.schema';

@Controller('sellers')
export class SellerController {
  constructor(private sellerService: SellerService) {}

  // register the seller
  //done 
  @Post('register')
  @UseGuards(AuthenticationGuard)
  @Roles('user')
  async registerSeller(
    @Body() createSellerDto: CreateSellerDto,
    @Request() req,
  ): Promise<Seller> {
    if (!req.user || !req.user.id) {
      throw new Error('User not authenticated or user ID not found');
    }
    const userId = req.user.id;
    try {
      return await this.sellerService.createSeller(
        createSellerDto,
        userId,
        'pending',
      );
    } catch (error) {
      throw new HttpException(
        'Error registering seller: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  // accept or reject the seller
  //done
  @Patch('approve-seller/:id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles('admin')
  async updateSellerStatus(@Param('id') id: string, @Body('status') status: 'approved' | 'rejected') {
    // id is the _id in the seller collection
    try {
      return await this.sellerService.updateSellerStatus(id, status);
    } catch (error) {
      throw new Error(`Error updating seller status: ${error.message}`);
    }
  } 

  // check the seller status , pending, approved , rejected
  // depend on this i will redirect the seller to register or to waiting for approval page
  //done
  @Get('status')
  @UseGuards(AuthenticationGuard)
  async getUserSellerStatus(@Request() req) {
    const userId = req.user.id;
    return await this.sellerService.checkUserSellerStatus(userId);
  }

  // get All sellers
  // done
  @Get()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles('admin')
  async getAllSellers(): Promise<Seller[]> {
    try {
      return await this.sellerService.getAllSellers();
    } catch (error) {
      throw new HttpException(
        'Error fetching sellers: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  

  // get sellers by approve status
  // done
  @Get('by-status/:status')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles('admin')
  async getSellersByStatus(
    @Param('status') status: 'pending' | 'approved' | 'rejected',
  ): Promise<Seller[]> {
    try {
      return await this.sellerService.getSellersByStatus(status);
    } catch (error) {
      throw new HttpException(
        'Error fetching sellers by status: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

     // get seller by user id for user
     //done
     @Get('seller')
     @UseGuards(AuthenticationGuard,AuthorizationGuard)
     @Roles('seller')
     async getSellerByUserId(@Request() req): Promise<Seller> {
       const userId = req.user.id;
       console.log(userId);
       
       return this.sellerService.getSellerByUserId(userId);
     }


  //get seller by id for admin
  //done
  @Get(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles('admin')
  async getSellerById(@Param('id') id: string): Promise<Seller> {
    return this.sellerService.getSellerById(id);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles('admin')
  async deleteSeller(@Param('id') id: string): Promise<void> {
    return this.sellerService.deleteSeller(id);
  }

  @Get('stats/overview')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles('admin')
  async getSellerStats() {
    return this.sellerService.getSellerStats();
  }
}

import { Controller, Post, Body, Patch, Param, Req, UseGuards, Request, HttpException, HttpStatus, Get } from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { Seller } from './schemas/seller.schema';
import { Roles } from 'src/common/Decorators/roles/roles.decorator';
import { AuthenticationGuard } from 'src/common/Guards/authentication/authentication.guard';

@Controller('sellers')
export class SellerController {
  constructor(private  sellerService: SellerService) {}

  @Post('register')
  @UseGuards(AuthenticationGuard)
  @Roles('user')
  async registerSeller(@Body() createSellerDto: CreateSellerDto, @Request() req):Promise<Seller> {
    console.log(req.user);
    
    if (!req.user || !req.user.id) {
      throw new Error('User not authenticated or user ID not found');
    }
    
    const userId = req.user.id;
    try {
      return await this.sellerService.createSeller(createSellerDto, userId, 'pending');
    } catch (error) {
      throw new HttpException('Error registering seller: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id/approve')
  @Roles('admin')
  async approveSeller(@Param('id') id: string) {
    try {
      return await this.sellerService.updateSellerStatus(id, 'approved');
    } catch (error) {
      throw new Error('Error approving seller: ' + error.message);
    }
  }
  
  @Patch(':id/reject')
  @Roles('admin')
  async rejectSeller(@Param('id') id: string):Promise<Seller> {
    // id is the _id in the seller collection
    try {
      return await this.sellerService.updateSellerStatus(id, 'rejected');
    } catch (error) {
      throw new Error('Error rejecting seller: ' + error.message);
    }
  }

  @Get('status')
  @UseGuards(AuthenticationGuard)
  async getUserSellerStatus(@Request() req) {
    const userId = req.user.id; 
    return await this.sellerService.checkUserSellerStatus(userId);
  }
}

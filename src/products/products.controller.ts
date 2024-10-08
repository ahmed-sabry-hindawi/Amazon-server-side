import { ProductsService } from './products.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto/update-product.dto';
import { AuthenticationGuard } from 'src/common/Guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/common/Guards/authorization/authorization.guard';
import { Roles } from 'src/common/Decorators/roles/roles.decorator';
import { Types } from 'mongoose';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // Routes with specific paths should come first
  @Get('sort')
  async getProductsWithSorting(
    @Query('sortBy') sortBy: string,
    @Query('order') order: 'asc' | 'desc',
  ): Promise<Product[]> {
    return this.productsService.getProductsWithSorting(sortBy, order);
  }

  @Get('pagination')
  async getProductsWithPagination(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<{ products: Product[]; totalCount: number }> {
    return this.productsService.getProductsWithPagination(page, limit);
  }

  @Get('filter')
  async getProductsWithFiltering(
    @Query() x: { [key: string]: any },
  ): Promise<Product[]> {
    console.log(x);

    return this.productsService.getProductsWithFiltering(x);
  }
  /************************************************************************* */

  @Get('filterCatName')
  async filterCatName(
    @Query('subcategoryId') subcategoryId?: string,
    @Query('name') name?: string,
  ): Promise<Product[]> {
    if (!subcategoryId && !name) {
      throw new BadRequestException(
        'At least one of subcategoryId or name must be provided',
      );
    }

    try {
      const products = await this.productsService.findBySubcategoryIdAndName(
        subcategoryId,
        name,
      );
      return products;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while filtering products',
      );
    }
  }

  @Get('advanced-filter')
  async getProductsWithAdvancedFiltering(
    @Query('filters') filters: { [key: string]: any },
    @Query('pagination') pagination: { page: number; limit: number },
    @Query('sorting') sorting: { sortBy: string; order: 'asc' | 'desc' },
  ): Promise<{ products: Product[]; totalCount: number }> {
    return this.productsService.getProductsWithAdvancedFiltering(
      filters,
      pagination,
      sorting,
    );
  }

  @Get('search')
  async getProductsBySearchQuery(
    @Query('query') query: string,
  ): Promise<Product[]> {
    return this.productsService.getProductsBySearchQuery(query);
  }

  @Get('category/:subcategoryId')
  async getProductsByCategory(
    @Param('subcategoryId') subcategoryId: string,
  ): Promise<Product[]> {
    return this.productsService.getProductsByCategory(subcategoryId);
  }

  @Get('seller/:sellerId')
  async getProductsBySeller(
    @Param('sellerId') sellerId: string,
  ): Promise<Product[]> {
    return this.productsService.getProductsBySeller(sellerId);
  }

  @Get('highlighted-reviews/:id')
  async getProductsWithHighlightedReviews(
    @Param('id') productId: string,
  ): Promise<Product> {
    return this.productsService.getProductsWithHighlightedReviews(productId);
  }

  // General product routes
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') productId: string): Promise<Product> {
    return this.productsService.getProductById(productId);
  }

  @Post()
  @Roles('seller')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() req: any,
  ): Promise<Product> {
    const sellerId = req.user.id;

    if (!Types.ObjectId.isValid(sellerId)) {
      throw new BadRequestException('Invalid sellerId');
    }

    return this.productsService.createProduct(
      createProductDto,
      new Types.ObjectId(sellerId),
    );
  }

  @Put(':id')
  @Roles('seller')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async updateProduct(
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.updateProduct(productId, updateProductDto);
  }

  @Delete(':id')
  @Roles('seller')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async deleteProduct(@Param('id') productId: string): Promise<void> {
    return this.productsService.deleteProduct(productId);
  }

  @Post(':id/reviews')
  @Roles('user')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async addReviewToProduct(
    @Param('id') productId: string,
    @Body('reviewId') reviewId: string,
  ): Promise<Product> {
    return this.productsService.addReviewToProduct(productId, reviewId);
  }

  @Delete(':id/reviews/:reviewId')
  @Roles('admin')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async removeReviewFromProduct(
    @Param('id') productId: string,
    @Param('reviewId') reviewId: string,
  ): Promise<Product> {
    return this.productsService.removeReviewFromProduct(productId, reviewId);
  }

  @Post(':id/images')
  @Roles('seller')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async addImageToProduct(
    @Param('id') productId: string,
    @Body('imageUrl') imageUrl: string,
  ): Promise<Product> {
    return this.productsService.addImageToProduct(productId, imageUrl);
  }

  @Delete(':id/images')
  @Roles('seller')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async removeImageFromProduct(
    @Param('id') productId: string,
    @Body('imageUrl') imageUrl: string,
  ): Promise<Product> {
    return this.productsService.removeImageFromProduct(productId, imageUrl);
  }

  @Put(':id/stock')
  @Roles('seller')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async updateProductStock(
    @Param('id') productId: string,
    @Body('stock') stock: number,
  ): Promise<Product> {
    return this.productsService.updateProductStock(productId, stock);
  }
}

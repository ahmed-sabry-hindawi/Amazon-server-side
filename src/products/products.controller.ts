import { ProductsService } from './products.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') productId: string): Promise<Product> {
    return this.productsService.getProductById(productId);
  }

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.createProduct(createProductDto);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.updateProduct(productId, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') productId: string): Promise<void> {
    return this.productsService.deleteProduct(productId);
  }

  @Post(':id/reviews')
  async addReviewToProduct(
    @Param('id') productId: string,
    @Body('reviewId') reviewId: string,
  ): Promise<Product> {
    return this.productsService.addReviewToProduct(productId, reviewId);
  }

  @Delete(':id/reviews/:reviewId')
  async removeReviewFromProduct(
    @Param('id') productId: string,
    @Param('reviewId') reviewId: string,
  ): Promise<Product> {
    return this.productsService.removeReviewFromProduct(productId, reviewId);
  }

  @Post(':id/images')
  async addImageToProduct(
    @Param('id') productId: string,
    @Body('imageUrl') imageUrl: string,
  ): Promise<Product> {
    return this.productsService.addImageToProduct(productId, imageUrl);
  }

  @Delete(':id/images')
  async removeImageFromProduct(
    @Param('id') productId: string,
    @Body('imageUrl') imageUrl: string,
  ): Promise<Product> {
    return this.productsService.removeImageFromProduct(productId, imageUrl);
  }

  @Put(':id/stock')
  async updateProductStock(
    @Param('id') productId: string,
    @Body('stock') stock: number,
  ): Promise<Product> {
    return this.productsService.updateProductStock(productId, stock);
  }

  @Get('seller/:sellerId')
  async getProductsBySeller(
    @Param('sellerId') sellerId: string,
  ): Promise<Product[]> {
    return this.productsService.getProductsBySeller(sellerId);
  }

  @Get('category/:categoryId')
  async getProductsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Product[]> {
    return this.productsService.getProductsByCategory(categoryId);
  }

  @Get('search')
  async getProductsBySearchQuery(
    @Query('query') query: string,
  ): Promise<Product[]> {
    return this.productsService.getProductsBySearchQuery(query);
  }

  @Get('pagination')
  async getProductsWithPagination(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<{ products: Product[]; totalCount: number }> {
    return this.productsService.getProductsWithPagination(page, limit);
  }

  @Get('sort')
  async getProductsWithSorting(
    @Query('sortBy') sortBy: string,
    @Query('order') order: 'asc' | 'desc',
  ): Promise<Product[]> {
    return this.productsService.getProductsWithSorting(sortBy, order);
  }

  @Get('filter')
  async getProductsWithFiltering(
    @Query() filters: { [key: string]: any },
  ): Promise<Product[]> {
    return this.productsService.getProductsWithFiltering(filters);
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

  @Get('highlighted-reviews/:id')
  async getProductsWithHighlightedReviews(
    @Param('id') productId: string,
  ): Promise<Product> {
    return this.productsService.getProductsWithHighlightedReviews(productId);
  }
}

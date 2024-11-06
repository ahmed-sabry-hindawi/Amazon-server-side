import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto/update-product.dto';
import { Order, OrderStatus } from 'src/orders/schemas/order.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}
  /*
  async getAllProducts(): Promise<Product[]> {
    try {
      const products = await this.productModel.find().populate('reviews').exec(); // Use `.exec()` for proper query execution
      if (!products) {
        throw new HttpException('No products found', HttpStatus.NOT_FOUND);
      }
      await products.populate(['sellerId', 'reviews', 'categoryId']);
      return products;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }*/
  async getAllProducts(): Promise<Product[]> {
    try {
      // Chain the populate method to the query before executing it
      const products = await this.productModel
        .find()
        .populate(['sellerId', 'reviews', 'subcategoryId']) // Apply populate here
        .exec(); // Then execute the query

      if (!products) {
        throw new HttpException('No products found', HttpStatus.NOT_FOUND);
      }

      return products;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getProductById(productId: string): Promise<Product> {
    try {
      const product = await this.productModel
        .findById(productId)
        .populate(['sellerId', 'reviews', 'subcategoryId'])
        .exec();
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async createProduct(product: CreateProductDto): Promise<Product> {
  //   try {
  //     const createdProduct = await this.productModel.create(product);

  //     return createdProduct;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async createProduct(
    product: CreateProductDto,
    sellerId: Types.ObjectId,
  ): Promise<Product> {
    try {
      const newProduct = {
        ...product,
        sellerId,
        isVerified: false,
      };
      const createdProduct = await this.productModel.create(newProduct);
      return createdProduct;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateProduct(
    productId: string,
    product: UpdateProductDto,
  ): Promise<Product> {
    try {
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(productId, product, { new: true })
        .exec();
      if (!updatedProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return updatedProduct;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.productModel.findByIdAndDelete(productId).exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addReviewToProduct(
    productId: string,
    reviewId: string,
  ): Promise<Product> {
    try {
      const product = await this.productModel
        .findByIdAndUpdate(
          productId,
          { $push: { reviews: reviewId } },
          { new: true },
        )
        .exec();
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeReviewFromProduct(
    productId: string,
    reviewId: string,
  ): Promise<Product> {
    try {
      const product = await this.productModel
        .findByIdAndUpdate(
          productId,
          { $pull: { reviews: reviewId } },
          { new: true },
        )
        .exec();
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async addImageToProduct(
  //   productId: string,
  //   imageUrl: string,
  // ): Promise<Product> {
  //   try {
  //     const product = await this.productModel
  //       .findByIdAndUpdate(
  //         productId,
  //         { $push: { imageUrls: imageUrl } },
  //         { new: true },
  //       )
  //       .exec();
  //     if (!product) {
  //       throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  //     }
  //     return product;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async addImageToProduct(
    productId: string,
    imageUrl: string,
  ): Promise<Product> {
    try {
      const product = await this.productModel
        .findByIdAndUpdate(
          productId,
          { $push: { imageUrls: imageUrl } },
          { new: true },
        )
        .exec();
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeImageFromProduct(
    productId: string,
    imageUrl: string,
  ): Promise<Product> {
    try {
      const product = await this.productModel
        .findByIdAndUpdate(
          productId,
          { $pull: { imageUrls: imageUrl } },
          { new: true },
        )
        .exec();
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async updateProductStock(productId: string, stock: number): Promise<Product> {
    try {
      const product = await this.productModel
        .findByIdAndUpdate(productId, { $set: { stock } }, { new: true })
        .exec();
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    try {
      const products = await this.productModel.find({ sellerId }).exec();
      if (!products) {
        throw new HttpException(
          'No products found for this seller',
          HttpStatus.NOT_FOUND,
        );
      }
      return products;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProductsByCategory(subcategoryId: string): Promise<Product[]> {
    try {
      const products = await this.productModel
        .find({ subcategoryId })
        .populate('subcategoryId');
      if (!products) {
        throw new HttpException(
          'No products found in this category',
          HttpStatus.NOT_FOUND,
        );
      }
      return products;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProductsBySearchQuery(query: string): Promise<Product[]> {
    try {
      const products = await this.productModel
        .find({ $text: { $search: query } })
        .exec();
      if (!products) {
        throw new HttpException(
          'No products found matching the query',
          HttpStatus.NOT_FOUND,
        );
      }
      return products;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProductsWithPagination(
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; totalCount: number }> {
    try {
      const totalCount = await this.productModel.countDocuments().exec();
      const products = await this.productModel
        .find()
        .populate(['sellerId', 'reviews', 'subcategoryId'])
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      return { products, totalCount };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSellerProductsWithPagination(
    sellerId: string,
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; totalCount: number }> {
    try {
      const totalCount = await this.productModel
        .countDocuments({ sellerId: new Types.ObjectId(sellerId) })
        .exec();

      const products = await this.productModel
        .find({ sellerId: new Types.ObjectId(sellerId) })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      return { products, totalCount };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProductsWithSorting(
    sortBy: string,
    order: 'asc' | 'desc',
  ): Promise<Product[]> {
    try {
      const products = await this.productModel
        .find()
        .sort({ [sortBy]: order })
        .exec();
      return products;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProductsWithFiltering(filters: {
    [key: string]: any;
  }): Promise<Product[]> {
    try {
      const products = await this.productModel.find(filters).exec();
      return products;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findBySubcategoryIdAndName(
    subcategoryId?: string,
    name?: string,
  ): Promise<Product[]> {
    try {
      console.log(
        `Searching for products with subcategoryId: ${subcategoryId || 'not provided'} and name: ${name || 'not provided'}`,
      );

      const query: any = {};

      if (subcategoryId) {
        query.subcategoryId = subcategoryId;
      }

      if (name) {
        query.$or = [
          { 'name.en': { $regex: name, $options: 'i' } },
          { 'name.ar': { $regex: name, $options: 'i' } },
        ];
      }

      console.log('Query:', JSON.stringify(query, null, 2));

      const products = await this.productModel.find(query).exec();

      console.log(`Found ${products.length} products`);
      if (products.length === 0) {
        console.log(
          'No products found. Dumping first 5 products in the database:',
        );
        const sampleProducts = await this.productModel.find().limit(5).exec();
        console.log(JSON.stringify(sampleProducts, null, 2));
      }

      return products;
    } catch (error) {
      console.error('Error in findBySubcategoryIdAndName:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async getProductsWithAdvancedFiltering(
  //   filters: { [key: string]: any },
  //   pagination: { page: number; limit: number },
  //   sorting: { sortBy: string; order: 'asc' | 'desc' },
  // ): Promise<{ products: Product[]; totalCount: number }> {
  //   try {
  //     const totalCount = await this.productModel.countDocuments(filters).exec();
  //     const products = await this.productModel
  //       .find(filters)
  //       .sort({ [sorting.sortBy]: sorting.order })
  //       .skip((pagination.page - 1) * pagination.limit)
  //       .limit(pagination.limit)
  //       .exec();
  //     return { products, totalCount };
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async getProductsWithAdvancedFiltering(
    filters: { [key: string]: any },
    pagination: { page: number; limit: number },
    sorting: { sortBy: string; order: 'asc' | 'desc' },
  ): Promise<{ products: Product[]; totalCount: number }> {
    try {
      // Validate pagination
      if (pagination.page < 1 || pagination.limit < 1) {
        throw new HttpException(
          'Invalid pagination values',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate sorting
      const validSortFields = ['name', 'price', 'createdAt', 'updatedAt']; // Add valid sort fields here
      if (!validSortFields.includes(sorting.sortBy)) {
        throw new HttpException(
          `Invalid sort field: ${sorting.sortBy}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!['asc', 'desc'].includes(sorting.order)) {
        throw new HttpException(
          `Invalid sort order: ${sorting.order}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Count total documents matching filters
      const totalCount = await this.productModel.countDocuments(filters).exec();

      // Retrieve products with filtering, sorting, and pagination
      const products = await this.productModel
        .find(filters)
        .sort({ [sorting.sortBy]: sorting.order })
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit)
        .exec();

      return { products, totalCount };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async filterProductsByPrice() {
    try {
      const products = await this.productModel
        .find()
        .sort({ price: -1 })
        .exec();
      return products;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProductsWithHighlightedReviews(productId: string): Promise<Product> {
    try {
      const product = await this.productModel
        .findById(productId)
        .populate({
          path: 'reviews',
          match: { highlighted: true },
          options: { sort: { createdAt: -1 } },
        })
        .exec();
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*async getProductsWithAverageRating(productId: string): Promise<Product> {
    try {
      const product = await this.productModel
        .findById(productId)
        .populate({
          path: 'reviews',
          options: {
            sort: { createdAt: -1 },
            select: 'rating',
          },
        })
        .exec();
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      const totalRatings = product.reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      const averageRating = totalRatings / product.reviews.length;
      return { ...product._doc, averageRating };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }*/

  /*
  async getProductsWithAverageRating(productId: string): Promise<Product> {
    try {
      const product = await this.productModel
        .findById(productId)
        .populate({
          path:'reviews',
          options: {
            sort: { createdAt: -1 },
            select: 'rating',
          },
        })
        .exec();
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      const totalRatings = product.reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      const averageRating = totalRatings / product.reviews.length;
      return {...product._doc, averageRating };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  */

  async getFilteredProducts(
    categoryId?: string,
    brand?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy: 'price' | 'name' = 'price',
    sortOrder: 'asc' | 'desc' = 'desc',
    page: number = 1,
    limit: number = 12,
  ): Promise<{ products: Product[]; totalCount: number }> {
    try {
      let query = this.productModel.find();

      if (categoryId) {
        query = query.where('subcategoryId', categoryId);
      }

      if (brand) {
        query = query.where('brand', brand);
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        let priceQuery = {};
        if (minPrice !== undefined) priceQuery['$gte'] = minPrice;
        if (maxPrice !== undefined) priceQuery['$lte'] = maxPrice;
        query = query.where('price', priceQuery);
      }

      query = query.sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

      const totalCount = await this.productModel
        .countDocuments(query.getFilter())
        .exec();
      const products = await query
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('subcategoryId')
        .exec();

      return { products, totalCount };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // for admin
  async updateProductVerification(
    productId: string,
    isVerified: boolean,
  ): Promise<Product> {
    try {
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(productId, { isVerified }, { new: true })
        .exec();
      if (!updatedProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return updatedProduct;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyAllProducts(): Promise<{ modifiedCount: number }> {
    try {
      const result = await this.productModel
        .updateMany(
          {}, // Empty filter to match all products
          { isVerified: true }, // Set isVerified to true for all products
        )
        .exec();

      return { modifiedCount: result.modifiedCount };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getReviewsForCompletedOrderProducts(): Promise<
    { productId: string; reviews: any[] }[]
  > {
    try {
      // First, get all completed orders
      const completedOrders = await this.orderModel
        .find({ orderStatus: OrderStatus.Completed })
        .populate({
          path: 'items.productId',
          select: '_id name',
        })
        .exec();

      if (!completedOrders.length) {
        return [];
      }

      // Extract product IDs from completed orders
      const productIds = completedOrders.flatMap((order) =>
        order.items.map((item) => new Types.ObjectId(item.productId._id)),
      );

      // Get unique product IDs
      const uniqueProductIds = [
        ...new Set(productIds.map((id) => id.toString())),
      ];

      // Get products with their reviews
      const productsWithReviews = await this.productModel
        .find({
          _id: { $in: uniqueProductIds.map((id) => new Types.ObjectId(id)) },
        })
        .populate({
          path: 'reviews',
          populate: {
            path: 'userId',
            select: 'name email',
          },
        })
        .select('_id name reviews')
        .lean()
        .exec();

      return productsWithReviews.map((product) => ({
        productId: product._id.toString(),
        productName: product.name,
        reviews: product.reviews || [],
      }));
    } catch (error) {
      throw new HttpException(
        `Error fetching reviews: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProductReviews(productId: string): Promise<any> {
    try {
      const product = await this.productModel
        .findById(productId)
        .populate({
          path: 'reviews',
          populate: {
            path: 'userId',
            select: 'name email',
          },
        })
        .select('reviews')
        .lean()
        .exec();

      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return {
        productId,
        reviews: product.reviews || [],
      };
    } catch (error) {
      throw new HttpException(
        `Error fetching product reviews: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

import { AuthenticationGuard } from 'src/common/Guards/authentication/authentication.guard';
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { AuthorizationGuard } from 'src/common/Guards/authorization/authorization.guard';
import { Roles } from 'src/common/Decorators/roles/roles.decorator';

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @Roles('admin', 'seller')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    const url = await this.cloudinaryService.uploadImage(file);
    return { url };
  }
}

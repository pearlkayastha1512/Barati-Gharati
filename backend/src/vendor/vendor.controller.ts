import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  Patch,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { SearchVendorDto } from './dto/search-vendor.dto';
import { imageFileFilter } from '../common/file-filter';

@ApiTags('Vendor')
@ApiBearerAuth()
@Controller('vendor')
export class VendorController {
  constructor(
    private readonly vendorService: VendorService,
  ) {}

  // ===========================
  // CREATE VENDOR PROFILE
  // ===========================

  @Post('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async createVendor(
    @Req() req: any,
    @Body() createVendorDto: CreateVendorDto,
  ) {
    return this.vendorService.createVendor(
      req.user.sub,
      createVendorDto,
    );
  }

  // ===========================
  // MY PROFILE
  // ===========================

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  async getMyVendorProfile(
    @Req() req: any,
  ) {
    return this.vendorService.getMyVendorProfile(
      req.user.sub,
    );
  }

  // ===========================
  // UPDATE PROFILE
  // ===========================

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  async updateVendorProfile(
    @Req() req: any,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorService.updateVendorProfile(
      req.user.sub,
      updateVendorDto,
    );
  }

  // ===========================
  // GET ALL VENDORS (PUBLIC)
  // ===========================

  @Get('all')
  async getAllVendors() {
    return this.vendorService.getAllVendors();
  }

  // ===========================
  // SEARCH VENDORS (PUBLIC)
  // ===========================

  @Get('search')
  async searchVendors(
    @Query() searchVendorDto: SearchVendorDto,
  ) {
    return this.vendorService.searchVendors(
      searchVendorDto,
    );
  }

  // ===========================
  // VENDOR DASHBOARD
  // ===========================

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  async getDashboard(
    @Req() req: any,
  ) {
    return this.vendorService.getDashboard(
      req.user.sub,
    );
  }

  // ===========================
  // GET VENDOR BY ID (PUBLIC)
  // ===========================

  @Get(':id')
  async getVendorById(
    @Param('id') id: string,
  ) {
    return this.vendorService.getVendorById(id);
  }

  // ===========================
  // UPLOAD LOGO
  // ===========================

  @Post('upload-logo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  
  @UseInterceptors(
  FileInterceptor('image', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: imageFileFilter,
  }),
)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadVendorLogo(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.vendorService.uploadVendorLogo(
      req.user.sub,
      file,
    );
  }

  // ===========================
  // UPLOAD COVER
  // ===========================

  @Post('upload-cover')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  @UseInterceptors(
  FileInterceptor('image', {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: imageFileFilter,
  }),
)
  async uploadVendorCover(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.vendorService.uploadVendorCover(
      req.user.sub,
      file,
    );
  }

  // ===========================
  // UPLOAD GALLERY
  // ===========================

  @Post('gallery')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  @UseInterceptors(
  FilesInterceptor('images', 10, {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: imageFileFilter,
  }),
)
  async uploadGallery(
    @Req() req: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.vendorService.uploadGallery(
      req.user.sub,
      files,
    );
  }

  // ===========================
  // GET MY GALLERY
  // ===========================

  @Get('gallery')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  async getGallery(
    @Req() req: any,
  ) {
    return this.vendorService.getGallery(
      req.user.sub,
    );
  }

  // ===========================
  // DELETE GALLERY IMAGE
  // ===========================

  @Delete('gallery/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  async deleteGalleryImage(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.vendorService.deleteGalleryImage(
      req.user.sub,
      id,
    );
  }
}
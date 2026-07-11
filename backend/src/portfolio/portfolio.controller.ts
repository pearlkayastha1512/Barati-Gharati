import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
} from "@nestjs/swagger";

import { FileInterceptor } from "@nestjs/platform-express";

import { Role } from "@prisma/client";

import { PortfolioService } from "./portfolio.service";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";

import { imageFileFilter } from "../common/file-filter";

@ApiTags("Portfolio")
@ApiBearerAuth()
@Controller("portfolio")
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
  ) {}

  // ==========================================
  // Upload Portfolio
  // ==========================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  @UseInterceptors(
    FileInterceptor("image", {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: imageFileFilter,
    }),
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
        },
        category: {
          type: "string",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
        },
        description: {
          type: "string",
        },
        image: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  create(
    @Req() req: any,
    @Body() dto: CreatePortfolioDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.portfolioService.create(
      req.user.sub,
      dto,
      file,
    );
  }

  // ==========================================
  // Logged In Vendor Portfolio
  // ==========================================

  @Get("my")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  getMyPortfolio(
    @Req() req: any,
  ) {
    return this.portfolioService.getMyPortfolio(
      req.user.sub,
    );
  }

  // ==========================================
  // Public Vendor Portfolio
  // frontend vendor id
  // ==========================================

  @Get("vendor/:vendorId")
  getVendorPortfolio(
    @Param("vendorId")
    vendorId: string,
  ) {
    return this.portfolioService.getVendorPortfolio(
      Number(vendorId),
    );
  }

  // ==========================================
  // Update Portfolio
  // ==========================================

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  update(
    @Param("id") id: string,
    @Req() req: any,
    @Body() dto: UpdatePortfolioDto,
  ) {
    return this.portfolioService.update(
      id,
      req.user.sub,
      dto,
    );
  }

  // ==========================================
  // Delete Portfolio
  // ==========================================

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  remove(
    @Param("id") id: string,
    @Req() req: any,
  ) {
    return this.portfolioService.remove(
      id,
      req.user.sub,
    );
  }
}

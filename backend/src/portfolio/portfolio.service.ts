import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // ==========================================
  // Mapper
  // ==========================================

  private mapPortfolio(item: any) {
    return {
      id: item.id,

      vendorId: item.vendor.frontendVendorId,

      title: item.title,

      category: item.category,

      description: item.description ?? "",

      image: item.imageUrl,

      createdAt: item.createdAt,

      updatedAt: item.updatedAt,
    };
  }

  // ==========================================
  // Upload Portfolio
  // ==========================================

  async create(
    userId: string,
    dto: CreatePortfolioDto,
    file: Express.Multer.File,
  ) {
    const vendor =
      await this.prisma.vendor.findUnique({
        where: {
          userId,
        },
      });

    if (!vendor) {
      throw new ForbiddenException(
        "Vendor profile not found.",
      );
    }

    const uploaded =
      (await this.cloudinary.uploadImage(
        file,
      )) as any;

    const portfolio =
      await this.prisma.portfolio.create({
        data: {
          title: dto.title,

          category: dto.category,

          description:
            dto.description ?? "",

          imageUrl:
            uploaded.secure_url,

          vendorId: vendor.id,
        },

        include: {
          vendor: true,
        },
      });

    return {
      success: true,

      data: this.mapPortfolio(
        portfolio,
      ),
    };
  }

  // ==========================================
  // Logged In Vendor Portfolio
  // ==========================================

  async getMyPortfolio(
    userId: string,
  ) {
    const vendor =
      await this.prisma.vendor.findUnique({
        where: {
          userId,
        },
      });

    if (!vendor) {
      throw new ForbiddenException(
        "Vendor profile not found.",
      );
    }

    const portfolio =
      await this.prisma.portfolio.findMany({
        where: {
          vendorId: vendor.id,
        },

        include: {
          vendor: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return {
      success: true,

      data: portfolio.map((item) =>
        this.mapPortfolio(item),
      ),
    };
  }

  // ==========================================
  // Public Vendor Portfolio
  // frontendVendorId
  // ==========================================

  async getVendorPortfolio(
    frontendVendorId: number,
  ) {
    const vendor =
      await this.prisma.vendor.findFirst({
        where: {
          frontendVendorId,
        },
      });

    if (!vendor) {
      throw new NotFoundException(
        "Vendor not found.",
      );
    }

    const portfolio =
      await this.prisma.portfolio.findMany({
        where: {
          vendorId: vendor.id,
        },

        include: {
          vendor: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return {
      success: true,

      data: portfolio.map((item) =>
        this.mapPortfolio(item),
      ),
    };
  }

  // ==========================================
  // Update
  // ==========================================

  async update(
    id: string,
    userId: string,
    dto: UpdatePortfolioDto,
  ) {
    const vendor =
      await this.prisma.vendor.findUnique({
        where: {
          userId,
        },
      });

    if (!vendor) {
      throw new ForbiddenException(
        "Vendor profile not found.",
      );
    }

    const portfolio =
      await this.prisma.portfolio.findUnique({
        where: {
          id,
        },
      });

    if (!portfolio) {
      throw new NotFoundException(
        "Portfolio not found.",
      );
    }

    if (
      portfolio.vendorId !==
      vendor.id
    ) {
      throw new ForbiddenException(
        "Unauthorized.",
      );
    }

    const updated =
      await this.prisma.portfolio.update({
        where: {
          id,
        },

        data: {
          title: dto.title,

          category:
            dto.category,

          description:
            dto.description,
        },

        include: {
          vendor: true,
        },
      });

    return {
      success: true,

      data: this.mapPortfolio(
        updated,
      ),
    };
  }

  // ==========================================
  // Delete
  // ==========================================

  async remove(
    id: string,
    userId: string,
  ) {
    const vendor =
      await this.prisma.vendor.findUnique({
        where: {
          userId,
        },
      });

    if (!vendor) {
      throw new ForbiddenException(
        "Vendor profile not found.",
      );
    }

    const portfolio =
      await this.prisma.portfolio.findUnique({
        where: {
          id,
        },
      });

    if (!portfolio) {
      throw new NotFoundException(
        "Portfolio not found.",
      );
    }

    if (
      portfolio.vendorId !==
      vendor.id
    ) {
      throw new ForbiddenException(
        "Unauthorized.",
      );
    }

    await this.prisma.portfolio.delete({
      where: {
        id,
      },
    });

    return {
      success: true,

      message:
        "Portfolio deleted successfully.",
    };
  }
}
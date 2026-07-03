import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { VendorStatus } from '@prisma/client';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePackageDto) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new ForbiddenException('Only vendors can create packages');
    if (vendor.status !== VendorStatus.APPROVED) {
  throw new ForbiddenException(
    'Vendor is not approved by admin',
  );
}
    return this.prisma.package.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        categoryId: dto.categoryId,
        vendorId: vendor.id,
        //inclusions: dto.inclusions ?? [],
      },
      include: { category: true, vendor: true },
    });
  }

  async findAll(categoryId?: string) {
    return this.prisma.package.findMany({
     where: {
  ...(categoryId && { categoryId }),
  vendor: {
    status: VendorStatus.APPROVED,
  },
},
      include: { category: true, vendor: { include: { user: { select: { name: true, email: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { id },
      include: { category: true, vendor: { include: { user: { select: { name: true, email: true } } } } },
      
    });
    if (!pkg) {
    throw new NotFoundException('Package not found');
  }

  if (pkg.vendor.status !== VendorStatus.APPROVED) {
    throw new NotFoundException('Package not found');
  }

  return pkg;
  }

  async findMyPackages(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new ForbiddenException('Only vendors can view their packages');
    if (vendor.status !== VendorStatus.APPROVED) {
  throw new ForbiddenException(
    'Vendor is not approved by admin',
  );
}
    return this.prisma.package.findMany({
      where: { vendorId: vendor.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, userId: string, dto: UpdatePackageDto) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new ForbiddenException('Only vendors can update packages');
    if (vendor.status !== VendorStatus.APPROVED) {
  throw new ForbiddenException(
    'Vendor is not approved by admin',
  );
}
    const pkg = await this.findOne(id);
    if (pkg.vendorId !== vendor.id) throw new ForbiddenException('You can only update your own packages');

    return this.prisma.package.update({
      where: { id },
      data: {
        ...dto,
        price: dto.price ? dto.price : undefined,
      },
      include: { category: true },
    });
  }

  async remove(id: string, userId: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new ForbiddenException('Only vendors can delete packages');
    if (vendor.status !== VendorStatus.APPROVED) {
  throw new ForbiddenException(
    'Vendor is not approved by admin',
  );
}
    const pkg = await this.findOne(id);
    if (pkg.vendorId !== vendor.id) throw new ForbiddenException('You can only delete your own packages');

    return this.prisma.package.delete({ where: { id } });
  }
}

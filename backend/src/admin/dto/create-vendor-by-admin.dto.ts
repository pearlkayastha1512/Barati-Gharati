import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VendorBadge, VendorBadgeBillingCycle } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateVendorByAdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ownerName!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  businessName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: VendorBadge, default: VendorBadge.BRONZE })
  @IsOptional()
  @IsEnum(VendorBadge)
  badge: VendorBadge = VendorBadge.BRONZE;

  @ApiPropertyOptional({
    enum: VendorBadgeBillingCycle,
    default: VendorBadgeBillingCycle.MONTHLY,
  })
  @IsOptional()
  @IsEnum(VendorBadgeBillingCycle)
  badgeBillingCycle: VendorBadgeBillingCycle = VendorBadgeBillingCycle.MONTHLY;
}

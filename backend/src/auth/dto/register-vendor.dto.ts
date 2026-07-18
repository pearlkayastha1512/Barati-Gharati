import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MinLength,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { VendorBadge, VendorBadgeBillingCycle } from '@prisma/client';

export class RegisterVendorDto {

  @ApiProperty()
  @IsUUID()
  registrationVerificationId!: string;

  
  // Account

  @ApiProperty({
    example: 'Pearl',
  })
  @IsString()
  @IsNotEmpty()
  ownerName!: string;

  @ApiProperty({
    example: 'pearl@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '7302752630',
  })
  @IsString()
  phone!: string;

  @ApiProperty({
    example: '12345678',
  })
  @IsString()
  @MinLength(8)
  password!: string;

  // Business

  @ApiProperty({
    example: 'Pearl Wedding Studio',
  })
  @IsString()
  businessName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  // Socials

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  youtube?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gstNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ protocols: ['https'], require_protocol: true })
  profileImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ protocols: ['https'], require_protocol: true })
  coverImage?: string;

  @ApiProperty({
    enum: VendorBadge,
    example: VendorBadge.SILVER,
  })
  @IsEnum(VendorBadge)
  selectedBadge!: VendorBadge;

  @ApiPropertyOptional({
    enum: VendorBadgeBillingCycle,
    default: VendorBadgeBillingCycle.MONTHLY,
  })
  @IsOptional()
  @IsEnum(VendorBadgeBillingCycle)
  badgeBillingCycle: VendorBadgeBillingCycle = VendorBadgeBillingCycle.MONTHLY;

  @ApiProperty()
  @IsOptional()
  @IsString()
  badgePaymentOrderId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  badgePaymentId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  badgePaymentSignature?: string;
}

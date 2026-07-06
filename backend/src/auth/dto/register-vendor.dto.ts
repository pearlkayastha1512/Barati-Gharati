import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class RegisterVendorDto {
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
}
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePackageDto {
  @ApiProperty({
    example: 'Premium Photography',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Photographer',
  })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Full Day',
    required: false,
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({
    example: 25000,
  })
  @Type(() => Number)
  @IsNumber()
  price!: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    required: false,
    example: [
      '4 Hours Coverage',
      'Drone',
      'Album',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includes?: string[];
}
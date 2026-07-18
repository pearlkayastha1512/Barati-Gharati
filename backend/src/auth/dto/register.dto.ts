import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CustomerMembership } from '@prisma/client';

export class RegisterDto {

  @ApiProperty({
    example: 'Pearl',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'pearl@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '9876543210',
  })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty({
    example: '12345678',
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ enum: CustomerMembership, default: CustomerMembership.FREE })
  @IsOptional()
  @IsEnum(CustomerMembership)
  membership: CustomerMembership = CustomerMembership.FREE;

  @IsOptional()
  @IsString()
  membershipPaymentOrderId?: string;

  @IsOptional()
  @IsString()
  membershipPaymentId?: string;

  @IsOptional()
  @IsString()
  membershipPaymentSignature?: string;

}

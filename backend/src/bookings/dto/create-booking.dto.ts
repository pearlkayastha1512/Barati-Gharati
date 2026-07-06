import {
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

import {
  BookingStatus,
  PaymentStatus,
} from '@prisma/client';

export class CreateBookingDto {
  @IsString()
  bookingNumber!: string;

  // Frontend Vendor ID
  @IsNumber()
  vendorId!: number;

  @IsString()
  vendorName!: string;

  @IsString()
  category!: string;

  @IsString()
  packageName!: string;

  @IsString()
  customerName!: string;

  @IsString()
  customerEmail!: string;

  @IsString()
  customerPhone!: string;

  @IsString()
  eventType!: string;

  @IsDateString()
  eventDate!: string;

  @IsOptional()
  @IsString()
  eventTime?: string;

  @IsOptional()
  @IsString()
  venue?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsNumber()
  guests!: number;

  @IsOptional()
  @IsString()
  brideName?: string;

  @IsOptional()
  @IsString()
  groomName?: string;

  @IsOptional()
  @IsString()
  specialRequirements?: string;

  @IsNumber()
  amount!: number;

  @IsNumber()
  advancePaid!: number;

  @IsNumber()
  remainingAmount!: number;

  @IsEnum(PaymentStatus)
  paymentStatus!: PaymentStatus;

  @IsEnum(BookingStatus)
  bookingStatus!: BookingStatus;
}
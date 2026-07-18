import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class StartVendorRegistrationVerificationDto {
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
}

export class VerifyVendorRegistrationOtpDto {
  @ApiProperty()
  @IsUUID()
  verificationId!: string;

  @ApiProperty()
  @IsString()
  @Length(6, 6)
  otp!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';

export class SendLoginOtpDto {
  @ApiProperty({
    example: '9876543210',
    description: '10-digit mobile phone number registered with account',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be a valid 10-digit number.',
  })
  phone!: string;
}

export class VerifyLoginOtpDto {
  @ApiProperty({
    example: '9876543210',
    description: '10-digit mobile phone number',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be a valid 10-digit number.',
  })
  phone!: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit OTP code',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, {
    message: 'OTP must be exactly 6 digits.',
  })
  otp!: string;
}

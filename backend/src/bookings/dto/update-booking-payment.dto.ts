import { IsNumber, Min } from 'class-validator';

export class UpdateBookingPaymentDto {
  @IsNumber()
  @Min(1)
  amount!: number;
}

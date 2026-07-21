import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum StandbyResponse {
  AVAILABLE = 'AVAILABLE',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export class StandbyRespondDto {
  @IsEnum(StandbyResponse)
  response!: StandbyResponse;
}

export class VendorRejectDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

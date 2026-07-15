import { AdminRole } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ALL_ADMIN_PERMISSIONS } from '../admin-permissions';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEnum(AdminRole)
  adminRole?: AdminRole;

  @IsOptional()
  @IsArray()
  @IsIn(ALL_ADMIN_PERMISSIONS, { each: true })
  permissions?: string[];

  @IsOptional()
  @IsBoolean()
  adminIsActive?: boolean;
}

export class ResetAdminPasswordDto {
  @IsString()
  @MinLength(8)
  password: string;
}

export class ChangeOwnAdminPasswordDto {
  @IsString()
  @MinLength(8)
  password: string;
}

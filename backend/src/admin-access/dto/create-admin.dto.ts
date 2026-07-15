import { AdminRole } from '@prisma/client';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ALL_ADMIN_PERMISSIONS } from '../admin-permissions';

export class CreateAdminDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(AdminRole)
  adminRole: AdminRole;

  @IsOptional()
  @IsArray()
  @IsIn(ALL_ADMIN_PERMISSIONS, { each: true })
  permissions?: string[];
}

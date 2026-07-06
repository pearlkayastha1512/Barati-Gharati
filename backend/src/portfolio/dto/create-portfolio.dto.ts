import {
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";

export enum PortfolioCategory {
  WEDDING = "Wedding",
  RECEPTION = "Reception",
  ENGAGEMENT = "Engagement",
  HALDI = "Haldi",
  MEHENDI = "Mehendi",
  PRE_WEDDING = "Pre Wedding",
  BRIDAL_MAKEUP = "Bridal Makeup",
  DECORATION = "Decoration",
  OTHER = "Other",
}

export class CreatePortfolioDto {
  @IsString()
  title!: string;

  @IsEnum(PortfolioCategory)
  category!: PortfolioCategory;

  @IsOptional()
  @IsString()
  description?: string;
}
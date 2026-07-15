import {
  IsEnum,
  IsArray,
  IsOptional,
  IsString,
} from "class-validator";
import { Transform } from "class-transformer";

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
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return value;
  })
  @IsArray()
  @IsEnum(PortfolioCategory, {
    each: true,
  })
  categories?: PortfolioCategory[];

  @IsOptional()
  @IsString()
  description?: string;
}

export type PortfolioCategory =
  | "Wedding"
  | "Reception"
  | "Engagement"
  | "Haldi"
  | "Mehendi"
  | "Pre Wedding"
  | "Bridal Makeup"
  | "Decoration"
  | "Other";

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  "Wedding",
  "Reception",
  "Engagement",
  "Haldi",
  "Mehendi",
  "Pre Wedding",
  "Bridal Makeup",
  "Decoration",
  "Other",
];

export interface PortfolioItemRecord {
  id: string;
  vendorId: number;

  title: string;

  category: PortfolioCategory;

  description: string;

  image: string;

  createdAt: string;

  updatedAt: string;
}
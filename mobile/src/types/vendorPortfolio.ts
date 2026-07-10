export type PortfolioCategory =
  | "Wedding"
  | "Pre-Wedding"
  | "Reception"
  | "Engagement"
  | "Decor"
  | "Other";

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  "Wedding",
  "Pre-Wedding",
  "Reception",
  "Engagement",
  "Decor",
  "Other",
];

export interface PortfolioItemRecord {
  id: string;
  title: string;
  category: PortfolioCategory;
  description: string;
  imageUri: string | null;
  createdAt: string; // ISO date string
}
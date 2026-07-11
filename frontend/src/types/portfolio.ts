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

export interface Portfolio {
  id: string;

  vendorId: number;

  title: string;

  category: PortfolioCategory;

  categories?: PortfolioCategory[];

  description: string;

  image: string;

  createdAt: string;

  updatedAt: string;
}

import { Portfolio } from "@/types/portfolio";

import {
  createPortfolioApi,
  deletePortfolioApi,
  getMyPortfolioApi,
  getVendorPortfolioApi,
  updatePortfolioApi,
} from "@/services/api/portfolio.api";

// ========================================
// Logged-in Vendor Portfolio
// ========================================

export async function getPortfolio(): Promise<
  Portfolio[]
> {
  const result =
    await getMyPortfolioApi();

  if (
    !result.ok ||
    !result.data?.success
  ) {
    return [];
  }

  return result.data.data as Portfolio[];
}

// ========================================
// Public Vendor Portfolio
// ========================================

export async function getVendorPortfolio(
  vendorId: number
): Promise<Portfolio[]> {
  const result =
    await getVendorPortfolioApi(
      vendorId
    );

  if (
    !result.ok ||
    !result.data?.success
  ) {
    return [];
  }

  return result.data.data as Portfolio[];
}

// ========================================
// Upload Portfolio
// ========================================

export async function createPortfolio(
  formData: FormData
): Promise<{
  success: boolean;
  error?: string;
}> {
  const result =
    await createPortfolioApi(
      formData
    );

  if (!result.ok) {
    return {
      success: false,
      error: result.error,
    };
  }

  if (!result.data?.success) {
    return {
      success: false,
      error: "Portfolio upload could not be completed.",
    };
  }

  return { success: true };
}

// ========================================
// Update Portfolio
// ========================================

export async function updatePortfolio(
  portfolio: Portfolio
): Promise<boolean> {
  const result =
    await updatePortfolioApi(
      portfolio.id,
      {
        title: portfolio.title,
        category:
          portfolio.category,
        categories:
          portfolio.categories ??
          [portfolio.category],
        description:
          portfolio.description,
      }
    );

  return (
    result.ok &&
    result.data?.success
  );
}

// ========================================
// Delete Portfolio
// ========================================

export async function deletePortfolio(
  id: string
): Promise<boolean> {
  const result =
    await deletePortfolioApi(id);

  return (
    result.ok &&
    result.data?.success
  );
}

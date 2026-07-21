/**
 * Calculates advance percentage and advance amount based on booking total amount slab rules:
 * - Up to ₹20,000  -> 50%
 * - Up to ₹50,000  -> 40%
 * - Up to ₹100,000 -> 30%
 * - Up to ₹300,000 -> 25%
 * - Up to ₹500,000 -> 20%
 * - Above ₹500,000 -> 15%
 */
export function getAdvancePercentage(totalAmount: number): number {
  if (totalAmount <= 20000) return 50;
  if (totalAmount <= 50000) return 40;
  if (totalAmount <= 100000) return 30;
  if (totalAmount <= 300000) return 25;
  if (totalAmount <= 500000) return 20;
  return 15;
}

export function getAdvanceAmountDue(totalAmount: number): number {
  const percentage = getAdvancePercentage(totalAmount);
  return Math.round((totalAmount * percentage) / 100);
}

import api from "./axios";

export type WishlistItem = {
  id: string;
  customerId: string;
  vendorId: number;
  vendorName: string;
  category: string;
  city: string;
  image: string;
  rating: number;
  startingPrice: number;
  addedAt: string;
};

export const getWishlist = async () => {
  const response = await api.get<WishlistItem[]>("/wishlist");
  return response.data;
};

export const addWishlistVendor = async (vendorId: string) => {
  const response = await api.post<WishlistItem>("/wishlist", {
    vendorId: Number(vendorId),
  });
  return response.data;
};

export const removeWishlistVendor = async (vendorId: string) => {
  await api.delete(`/wishlist/${vendorId}`);
};

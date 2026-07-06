// import { WishlistItem } from "@/types/wishlist";

// const STORAGE_KEY = "wishlist";

// export function getWishlist(
//   customerId: string
// ): WishlistItem[] {
//   const data = localStorage.getItem(STORAGE_KEY);

//   if (!data) {
//     return [];
//   }

//   const wishlist: WishlistItem[] = JSON.parse(data);

//   return wishlist.filter(
//     (item) => item.customerId === customerId
//   );
// }

// export function addToWishlist(
//   item: WishlistItem
// ): void {
//   const data = localStorage.getItem(STORAGE_KEY);

//   const wishlist: WishlistItem[] = data
//     ? JSON.parse(data)
//     : [];

//   const exists = wishlist.some(
//     (wishlistItem) =>
//       wishlistItem.customerId === item.customerId &&
//       wishlistItem.vendorId === item.vendorId
//   );

//   if (exists) {
//     return;
//   }

//   wishlist.push(item);

//   localStorage.setItem(
//     STORAGE_KEY,
//     JSON.stringify(wishlist)
//   );
// }

// export function removeFromWishlist(
//   customerId: string,
//   vendorId: number
// ): void {
//   const data = localStorage.getItem(STORAGE_KEY);

//   if (!data) {
//     return;
//   }

//   const wishlist: WishlistItem[] = JSON.parse(data);

//   const updatedWishlist = wishlist.filter(
//     (item) =>
//       !(
//         item.customerId === customerId &&
//         item.vendorId === vendorId
//       )
//   );

//   localStorage.setItem(
//     STORAGE_KEY,
//     JSON.stringify(updatedWishlist)
//   );
// }

// export function isWishlisted(
//   customerId: string,
//   vendorId: number
// ): boolean {
//   const wishlist = getWishlist(customerId);

//   return wishlist.some(
//     (item) => item.vendorId === vendorId
//   );
// }

// export function clearWishlist(
//   customerId: string
// ): void {
//   const data = localStorage.getItem(STORAGE_KEY);

//   if (!data) {
//     return;
//   }

//   const wishlist: WishlistItem[] = JSON.parse(data);

//   const updatedWishlist = wishlist.filter(
//     (item) => item.customerId !== customerId
//   );

//   localStorage.setItem(
//     STORAGE_KEY,
//     JSON.stringify(updatedWishlist)
//   );
// }



import { WishlistItem } from "@/types/wishlist";

import {
  getWishlistApi,
  addWishlistApi,
  removeWishlistApi,
  checkWishlistApi,
} from "@/services/api/wishlist.api";

export async function getWishlist() {
  const result =
    await getWishlistApi();

  if (!result.ok || !result.data) {
    return [];
  }

  return result.data as WishlistItem[];
}

export async function addToWishlist(
  vendorId: number
) {
  const result =
    await addWishlistApi(vendorId);

  return result.ok;
}

export async function removeFromWishlist(
  vendorId: number
) {
  const result =
    await removeWishlistApi(
      vendorId
    );

  return result.ok;
}

export async function isWishlisted(
  vendorId: number
) {
  const result =
    await checkWishlistApi(
      vendorId
    );

  return (
    result.data?.wishlisted ??
    false
  );
}
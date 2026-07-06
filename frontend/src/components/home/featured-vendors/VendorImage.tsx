// "use client";

// import Image from "next/image";
// import { BadgeCheck } from "lucide-react";

// import { Vendor } from "@/types/vendor";

// import WishlistButton from "./WishlistButton";
// import { useWishlist } from "@/hooks/useWishlist";

// interface VendorImageProps {
//   vendor: Vendor;
// }

// export default function VendorImage({
//   vendor,
// }: VendorImageProps) {
//   const {
//     isWishlisted,
//     handleToggleWishlist,
//   } = useWishlist(vendor);

//   return (
//     <div className="relative h-60 overflow-hidden rounded-t-3xl">
//       <Image
//         src={vendor.image}
//         alt={vendor.name}
//         fill
//         sizes="(max-width:640px)100vw,
//                (max-width:1024px)50vw,
//                (max-width:1280px)33vw,
//                25vw"
//         className="object-cover transition-transform duration-700 group-hover:scale-110"
//       />

//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

//       {/* Wishlist */}
//       <WishlistButton
//         isWishlisted={isWishlisted}
//         onClick={handleToggleWishlist}
//       />

//       {/* Rating */}
//       <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-gray-700 backdrop-blur">
//         ⭐ {vendor.rating} ({vendor.reviews})
//       </div>

//       {/* Featured */}
//       {vendor.featured && (
//         <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
//           <BadgeCheck size={16} />
//           Featured
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { BadgeCheck } from "lucide-react";

import { Vendor } from "@/types/vendor";

import WishlistButton from "./WishlistButton";
import { useWishlist } from "@/hooks/useWishlist";

interface VendorImageProps {
  vendor: Vendor;
}

export default function VendorImage({
  vendor,
}: VendorImageProps) {
  const {
    isWishlisted,
    handleToggleWishlist,
  } = useWishlist(vendor);

  return (
    <div className="relative h-60 overflow-hidden rounded-t-3xl">
      <Image
        src={vendor.image}
        alt={vendor.name}
        fill
        sizes="
          (max-width:640px) 100vw,
          (max-width:1024px) 50vw,
          (max-width:1280px) 33vw,
          25vw
        "
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* Wishlist */}
      <WishlistButton
        isWishlisted={isWishlisted}
        onClick={handleToggleWishlist}
      />

      {/* Rating */}
      <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-gray-700 backdrop-blur">
        ⭐ {vendor.rating} ({vendor.reviews})
      </div>

      {/* Featured Badge */}
      {vendor.featured && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
          <BadgeCheck size={16} />
          Featured
        </div>
      )}
    </div>
  );
}
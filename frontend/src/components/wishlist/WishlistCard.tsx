// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import {
//   MapPin,
//   Star,
//   Heart,
//   ArrowRight,
// } from "lucide-react";

// interface WishlistCardProps {
//   vendorName: string;
//   category: string;
//   city: string;
//   rating: number;
//   startingPrice: number;
//   image: string;
// }

// export default function WishlistCard({
//   vendorName,
//   category,
//   city,
//   rating,
//   startingPrice,
//   image,
// }: WishlistCardProps) {
//   return (
//     <div className="overflow-hidden rounded-3xl border border-[#ffb3bf] bg-[#fffdf0] shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

//       <div className="relative h-60">

//         <Image
//           src={image}
//           alt={vendorName}
//           fill
//           className="object-cover"
//         />

//         <button className="absolute right-4 top-4 rounded-full bg-[#fffdf0] p-3 shadow">

//           <Heart
//             size={18}
//             className="fill-[#ff4d6d] text-[#ff4d6d]"
//           />

//         </button>

//       </div>

//       <div className="p-6">

//         <div className="flex items-center justify-between">

//           <h3 className="text-2xl font-bold text-[#3f1d2f]">
//             {vendorName}
//           </h3>

//           <span className="flex items-center gap-1 text-[#111111]">

//             <Star
//               size={18}
//               className="fill-current"
//             />

//             {rating}

//           </span>

//         </div>

//         <p className="mt-2 text-[#8d6171]">
//           {category}
//         </p>

//         <div className="mt-4 flex items-center gap-2 text-[#8d6171]">

//           <MapPin size={18} />

//           {city}

//         </div>

//         <p className="mt-6 text-3xl font-bold text-[#3f1d2f]">
//           ₹{startingPrice.toLocaleString()}
//         </p>

//         <div className="mt-6 flex gap-3">

//           <Link
//             href="/vendors/1"
//             className="flex-1 rounded-2xl border border-[#ffb3bf] py-3 text-center font-semibold transition hover:bg-[#fffdf0] text-[#6c2d45]"
//           >
//             View
//           </Link>

//           <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#ff4d6d] py-3 font-semibold text-white transition hover:bg-[#e63b5f]">

//             Book Now

//             <ArrowRight size={18} />

//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  Heart,
  ArrowRight,
} from "lucide-react";

import { toast } from "sonner";

import { useWishlistStore } from "@/store/wishlistStore";

interface WishlistCardProps {
  vendorId: number;

  vendorName: string;

  category: string;

  city: string;

  rating: number;

  startingPrice: number;

  image: string;
}

export default function WishlistCard({
  vendorId,
  vendorName,
  category,
  city,
  rating,
  startingPrice,
  image,
}: WishlistCardProps) {
  const { removeVendor } =
    useWishlistStore();

  const imageSrc =
    image?.trim() || "/images/why-choose-us.jpg";

  return (
    <div className="overflow-hidden rounded-3xl border border-[#ffb3bf] bg-[#fffdf0] shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="relative h-60">
        <Image
          src={imageSrc}
          alt={vendorName || "Wishlist vendor"}
          fill
          className="object-cover"
        />

        <button
          onClick={async () => {
            const success =
              await removeVendor(
                vendorId
              );

            if (success) {
              toast.success(
                "Removed from wishlist"
              );
            }
          }}
          className="absolute right-4 top-4 rounded-full bg-[#fffdf0] p-3 shadow"
        >
          <Heart
            size={18}
            className="fill-[#ff4d6d] text-[#ff4d6d]"
          />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-[#3f1d2f]">
            {vendorName}
          </h3>

          <span className="flex items-center gap-1 text-[#111111]">
            <Star
              size={18}
              className="fill-current"
            />

            {rating}
          </span>
        </div>

        <p className="mt-2 text-[#8d6171]">
          {category}
        </p>

        <div className="mt-4 flex items-center gap-2 text-[#8d6171]">
          <MapPin size={18} />

          {city}
        </div>

        <p className="mt-6 text-3xl font-bold text-[#3f1d2f]">
          ₹{startingPrice.toLocaleString()}
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href={`/vendors/${vendorId}`}
            className="flex-1 rounded-2xl border border-[#ffb3bf] py-3 text-center font-semibold text-[#6c2d45] transition hover:bg-[#fffdf0]"
          >
            View
          </Link>

          <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#ff4d6d] py-3 font-semibold text-white transition hover:bg-[#e63b5f]">
            Book Now

            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
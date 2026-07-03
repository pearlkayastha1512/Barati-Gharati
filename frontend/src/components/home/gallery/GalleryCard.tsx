

import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

interface GalleryCardProps {
  id: number;
  image: string;
  title: string;
  location: string;
}

export default function GalleryCard({
  id,
  image,
  title,
  location,
}: GalleryCardProps) {
  return (
    <Link
      href={`/stories/${id}`}
      className="
       group
relative
block
overflow-hidden
rounded-[32px]
h-[360px]
shadow-lg

      "
    >
      <Image
        src={image}
        alt={title}
        fill
        className="
          object-cover
          transition-transform
          duration-700
          group-hover:scale-110
        "
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute left-0 right-0 bottom-0 p-6 text-white">
        <Heart
          size={22}
          className="mb-4 fill-white text-white"
        />

        <h3 className="text-3xl font-bold">
          {title}
        </h3>

        <p className="mt-2 text-gray-200">
          {location}
        </p>

        <div className="mt-5 flex items-center gap-2 font-medium opacity-0 transition duration-300 group-hover:opacity-100">
          View Story
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
}
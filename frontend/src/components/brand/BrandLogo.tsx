import Image from "next/image";

const BRAND_LOGO_SRC =
  "/brand/barati-gharati-logo.png?v=20260710";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export default function BrandLogo({
  className = "h-14 w-48",
  imageClassName = "object-contain",
  priority = false,
}: BrandLogoProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={BRAND_LOGO_SRC}
        alt="Barati Gharati"
        fill
        sizes="(max-width: 768px) 180px, 240px"
        className={imageClassName}
        priority={priority}
        unoptimized
      />
    </div>
  );
}

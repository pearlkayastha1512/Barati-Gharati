import Image from "next/image";

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
        src="/brand/barati-gharati-logo.png"
        alt="Barati Gharati"
        fill
        sizes="(max-width: 768px) 180px, 240px"
        className={imageClassName}
        priority={priority}
      />
    </div>
  );
}

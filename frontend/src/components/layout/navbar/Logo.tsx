import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center"
      aria-label="Barati Gharati home"
    >
      <BrandLogo
        className="h-16 w-44 sm:w-56"
        priority
      />
    </Link>
  );
}

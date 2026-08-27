import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTAButton() {
  return (
    <Link href="/vendors">
      <Button className="group shrink-0 h-auto rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-4 xl:px-5 py-2 text-xs xl:text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
        Start Planning

        <ArrowRight
          size={16}
          className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1"
        />
      </Button>
    </Link>
  );
}
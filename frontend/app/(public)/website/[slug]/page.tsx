import { notFound } from "next/navigation";

import { getWeddingWebsiteBySlug } from "@/services/api/wedding-website.api";

import WeddingHero from "@/components/wedding-website/WeddingHero";
import WeddingCountdown from "@/components/wedding-website/WeddingCountdown";
import WeddingDetails from "@/components/wedding-website/WeddingDetails";
import WeddingGallery from "@/components/wedding-website/WeddingGallery";
import WeddingStory from "@/components/wedding-website/WeddingStory";
import WeddingFooter from "@/components/wedding-website/WeddingFooter";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WeddingWebsitePage({
  params,
}: Props) {
  const { slug } = await params;

  try {
    const website =
      await getWeddingWebsiteBySlug(slug);

    return (
      <div className="overflow-hidden bg-[#faf7f5] text-slate-900">
        {/* Hero */}

        <WeddingHero
          brideName={website.brideName}
          groomName={website.groomName}
          weddingDate={website.weddingDate}
          image={website.heroImage}
        />

        {/* Countdown */}

        <WeddingCountdown
          weddingDate={website.weddingDate}
        />

        {/* Story */}

        <WeddingStory
          brideName={website.brideName}
          groomName={website.groomName}
          story={website.story}
          image={website.coverImage}
        />

        {/* Wedding Details */}

        <WeddingDetails
          weddingDate={website.weddingDate}
          venueName={website.venueName}
          venueAddress={website.venueAddress}
        />

        {/* Gallery */}

        <WeddingGallery
          galleryImages={website.galleryImages}
        />

        {/* Footer */}

        <WeddingFooter
          groomName={website.groomName}
          brideName={website.brideName}
        />
      </div>
    );
  } catch {
    notFound();
  }
}
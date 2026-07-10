import ProfileHero from "@/components/vendor/profile/ProfileHero";
import BusinessProfileCard from "@/components/vendor/profile/BusinessProfileCard";
import OwnerInformation from "@/components/vendor/profile/OwnerInformation";
import BusinessDetails from "@/components/vendor/profile/BusinessDetails";
import SocialLinks from "@/components/vendor/profile/SocialLinks";
import VerificationCard from "@/components/vendor/profile/VerificationCard";
import VendorProfileShell from "@/components/vendor/profile/VendorProfileShell";

export default function VendorProfilePage() {
  return (
    <VendorProfileShell>
      <div className="space-y-8">

      <ProfileHero />

      <BusinessProfileCard />

      <section className="grid gap-6 xl:grid-cols-2">
 
        <OwnerInformation />
        <BusinessDetails /> 

        

      </section>


      <section className="grid gap-6 xl:grid-cols-2">

        <SocialLinks />

        <VerificationCard />

      </section>

      </div>
    </VendorProfileShell>
  );
}

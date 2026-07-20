import AboutHero from "@/components/about/hero/AboutHero";
import OurStory from "@/components/about/story/OurStory";
import MissionVision from "@/components/about/mission/MissionVision";
import CoreValues from "@/components/about/values/CoreValues";
import AboutStats from "@/components/about/stats/AboutStats";
import MeetTeam from "@/components/about/team/MeetTeam";
import AboutCTA from "@/components/about/cta/AboutCTA";

export default function AboutPage() {
  return (
    <main className="bg-white">

      <AboutHero />

      <OurStory />

      <MissionVision />
      <CoreValues />

      <AboutStats />

      <MeetTeam />

      <AboutCTA />

    </main>
  );
}

"use client";
import HeroContent from "./HeroContent";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
  autoPlay
  muted
  loop
  playsInline
  className="absolute inset-0 h-full w-full object-cover scale-110 animate-[slowZoom_18s_linear_infinite]"
>
        <source src="/videos/wedding.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />

      {/* Hero Content */}
      
      <div className="relative  flex h-full items-start justify-center pt-16 lg:pt-20">
       
       <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 1,
  }}
  className="relative  flex h-full items-center justify-center"
>
  <HeroContent />
</motion.div>
      </div>
      <div className="absolute -bottom-px left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          className="block h-auto w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="#efb8bf"
            d="M0,96L80,90.7C160,85,320,75,480,69.3C640,64,800,64,960,69.3C1120,75,1280,85,1360,90.7L1440,96L1440,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
}

import { Mouse } from "lucide-react";

export default function ScrollIndicator() {
  return (
    <div className="mt-16 flex flex-col items-center">
      <Mouse
        className="animate-bounce text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]"
        size={34}
      />

      <p className="mt-3 text-sm font-medium text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
        Scroll to Explore
      </p>
    </div>
  );
}

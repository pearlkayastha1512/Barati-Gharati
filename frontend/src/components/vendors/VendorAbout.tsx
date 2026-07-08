import {
  CheckCircle2,
  Building2,
  Car,
  Wifi,
  Trees,
  UtensilsCrossed,
} from "lucide-react";

interface VendorAboutProps {
  description: string;
  amenities: string[];
}

const iconMap: Record<string, React.ReactNode> = {
  Parking: <Car size={20} />,
  "Luxury Rooms": <Building2 size={20} />,
  "AC Banquet": <Building2 size={20} />,
  "Outdoor Lawn": <Trees size={20} />,
  Catering: <UtensilsCrossed size={20} />,
  Decoration: <CheckCircle2 size={20} />,
  "Wi-Fi": <Wifi size={20} />,
};

export default function VendorAbout({
  description,
  amenities,
}: VendorAboutProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-xl shadow-black/20 backdrop-blur">

      <h2 className="text-3xl font-bold text-white">
        About
      </h2>

      <p className="mt-5 leading-8 text-rose-100/75">
        {description}
      </p>

      <div className="mt-10">
{/* 
        <h3 className="mb-6 text-2xl font-semibold text-gray-900">
          Amenities
        </h3> */}

        <div className="grid gap-5 sm:grid-cols-2">

          {amenities.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-rose-300/15 bg-rose-400/10 p-4"
            >
              <div className="text-rose-300">
                {iconMap[item] ?? <CheckCircle2 size={20} />}
              </div>

              <span className="font-medium text-rose-50">
                {item}
              </span>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

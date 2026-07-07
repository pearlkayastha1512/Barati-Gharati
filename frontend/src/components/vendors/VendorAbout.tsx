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
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="text-3xl font-bold text-gray-900">
        About
      </h2>

      <p className="mt-5 leading-8 text-gray-600">
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
              className="flex items-center gap-3 rounded-2xl bg-rose-50 p-4"
            >
              <div className="text-rose-500">
                {iconMap[item] ?? <CheckCircle2 size={20} />}
              </div>

              <span className="font-medium text-gray-700">
                {item}
              </span>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}
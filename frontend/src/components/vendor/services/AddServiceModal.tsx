"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { X, Check, CreditCard, Sparkles, HelpCircle } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { useServiceStore } from "@/store/serviceStore";
import { VENDOR_CATEGORIES } from "@/constants/categories";
import { uploadServiceImageApi } from "@/services/api/service.api";
import { getMyVendorProfileApi } from "@/services/api/vendor.api";

interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
  editMode?: boolean;
}

const SERVICE_SUGGESTIONS: Record<
  string,
  Array<{ name: string; defaultUnit: string; description: string }>
> = {
  "Cake Designer": [
    {
      name: "Custom Tier Wedding Cake",
      defaultUnit: "Per Kg",
      description: "A beautifully hand-crafted multi-tier wedding cake with custom fondant decoration, floral work, and premium flavors of your choice."
    },
    {
      name: "Minimalist Fondant Cake",
      defaultUnit: "Per Kg",
      description: "Sleek and modern single or double tier fondant cake with elegant detailing, perfect for intimate receptions or engagements."
    },
    {
      name: "Bridal Theme Cupcakes & Dessert Platter",
      defaultUnit: "Flat Rate",
      description: "A custom set of 12 or 24 cupcakes, macarons, and cake pops decorated in colors matching your wedding theme."
    },
    {
      name: "Traditional Floral Wedding Cake",
      defaultUnit: "Per Kg",
      description: "A classic tiered cake adorned with edible or fresh flowers matching the wedding venue's floral arrangements."
    },
    {
      name: "Engagement / Roka Ring Theme Cake",
      defaultUnit: "Per Kg",
      description: "Custom design cake with ring box replicas, gold leaf detailing, and elegant engagement themed decorations."
    }
  ],
  "Photography": [
    {
      name: "Candid Wedding Photography",
      defaultUnit: "Per Day",
      description: "Full day coverage of all wedding ceremonies by senior candid photographers. Includes high-resolution edited digital copies."
    },
    {
      name: "Traditional Cinematography & Video",
      defaultUnit: "Per Day",
      description: "Complete video coverage of ceremonies, multi-cam setup, full documentary film, and highlights reel."
    },
    {
      name: "Pre-Wedding Couple Shoot",
      defaultUnit: "Flat Rate",
      description: "A creative outdoor shoot at premium locations with multiple outfit changes. Includes a 2-minute pre-wedding teaser video."
    },
    {
      name: "Drone Coverage & Aerial Cinematic Video",
      defaultUnit: "Per Day",
      description: "Add cinematic drone shots to your wedding footage. High-definition aerial coverage of the venue and guest entries."
    },
    {
      name: "Bridal & Groom Portrait Session",
      defaultUnit: "Flat Rate",
      description: "Dedicated portrait session capturing the bride and groom in their ceremonial wedding attire prior to the main events."
    }
  ],
  "Catering": [
    {
      name: "Premium Buffet Catering (Veg & Non-Veg)",
      defaultUnit: "Per Plate / Guest",
      description: "Exquisite multi-cuisine wedding buffet menu including 3 starters, 2 soups, 6 main course items, and 3 premium desserts."
    },
    {
      name: "Live Food & Snacks Counters",
      defaultUnit: "Per Plate / Guest",
      description: "Interactive live cooking stations featuring chaat, pasta, wood-fired pizza, and sizzling appetizers served fresh to guests."
    },
    {
      name: "Signature Mocktail & Bar Setup",
      defaultUnit: "Per Plate / Guest",
      description: "Stylish bar layout serving customized theme mocktails, soft beverages, shakes, and fresh fruit juices by professional bartenders."
    },
    {
      name: "Traditional High-Tea & Snacks Spread",
      defaultUnit: "Per Plate / Guest",
      description: "Mehendi or Haldi high-tea service with assorted teas, coffees, artisanal cookies, mini sliders, and localized snacks."
    }
  ],
  "Venue": [
    {
      name: "Luxury AC Banquet Hall Rental",
      defaultUnit: "Per Day",
      description: "Spacious fully air-conditioned indoor banquet space with sound system, basic stage backdrop, and elegant seating arrangement."
    },
    {
      name: "Outdoor Marriage Lawn / Garden",
      defaultUnit: "Per Day",
      description: "Lush green manicured lawn space ideal for grand outdoor wedding setups, mandap designs, and open-air receptions."
    },
    {
      name: "Poolside Cocktail & Party Space",
      defaultUnit: "Per Day",
      description: "Modern poolside deck area perfect for hosting bachelor parties, cocktail nights, sangeet, or close family gatherings."
    },
    {
      name: "Destination Resort / Villa Booking",
      defaultUnit: "Per Day",
      description: "Rent the entire boutique resort or heritage villa property for a private destination wedding experience with family stays."
    }
  ],
  "Decoration": [
    {
      name: "Royal Floral Mandap Decor",
      defaultUnit: "Flat Rate",
      description: "Exquisite mandap setup featuring fresh imported flowers, cascading drapes, temple-style pillars, and traditional dome lighting."
    },
    {
      name: "Vibrant Haldi & Mehendi Backdrop",
      defaultUnit: "Flat Rate",
      description: "Colorful canopy setup decorated with marigolds, fairy lights, traditional umbrellas, and comfortable seating lounges."
    },
    {
      name: "LED Stage Light & Sound Decor",
      defaultUnit: "Flat Rate",
      description: "Grand reception stage setup with high-end LED screen backdrops, customized ambient wash lights, and stage audio."
    },
    {
      name: "Grand Entrance Walkway Decor",
      defaultUnit: "Flat Rate",
      description: "Stunning entry passage design adorned with floral arches, crystal chandeliers, mirror floors, and warm fairy lights."
    }
  ]
};

const getSuggestionsForCategory = (cat: any) => {
  if (!cat || typeof cat !== "string") return [];
  const normalized = cat.toLowerCase().trim();
  if (normalized.includes("cake") || normalized.includes("baker")) return SERVICE_SUGGESTIONS["Cake Designer"];
  if (normalized.includes("photograph") || normalized.includes("video") || normalized.includes("media") || normalized.includes("cinema")) return SERVICE_SUGGESTIONS["Photography"];
  if (normalized.includes("cater")) return SERVICE_SUGGESTIONS["Catering"];
  if (normalized.includes("venue") || normalized.includes("hall") || normalized.includes("lawn")) return SERVICE_SUGGESTIONS["Venue"];
  if (normalized.includes("decor") || normalized.includes("theme") || normalized.includes("flor")) return SERVICE_SUGGESTIONS["Decoration"];
  return [];
};

export default function AddServiceModal({
  open,
  onClose,
}: AddServiceModalProps) {
  const { user } = useAuthStore();
  const {
    addService,
    selectedService,
    updateExistingService,
    setSelectedService,
    loadMyServices,
  } = useServiceStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [vendorCategory, setVendorCategory] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(""); // duration stores selected Billing Unit
  const [customUnit, setCustomUnit] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // Load Vendor Profile to auto-detect Category
  useEffect(() => {
    if (open && user) {
      getMyVendorProfileApi().then((res) => {
        if (res.ok && res.data) {
          const profile = res.data as any;
          if (profile.category) {
            setVendorCategory(profile.category);
            if (!selectedService) {
              setCategory(profile.category);
            }
          }
        }
      });
    }
  }, [open, user, selectedService]);

  // Click outside suggestions list
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;

    if (selectedService) {
      setName(selectedService.name);
      setCategory(selectedService.category);
      setDescription(selectedService.description);
      
      const standardUnits = ["Per Kg", "Per Plate / Guest", "Per Day", "Per Hour", "Flat Rate"];
      if (standardUnits.includes(selectedService.duration)) {
        setDuration(selectedService.duration);
        setCustomUnit("");
      } else {
        setDuration("Custom");
        setCustomUnit(selectedService.duration);
      }
      
      setPrice(selectedService.price.toString());
      setImage(selectedService.image);
    } else {
      setName("");
      setCategory(vendorCategory || "");
      setDescription("");
      setDuration("");
      setCustomUnit("");
      setPrice("");
      setImage("");
    }

    setImageFile(null);
    setImagePreviewUrl("");
  }, [open, selectedService, vendorCategory]);

  const activeSuggestions = useMemo(() => {
    const allSuggs = getSuggestionsForCategory(category);
    if (!name) return allSuggs;
    return allSuggs.filter((s) => s.name.toLowerCase().includes(name.toLowerCase()));
  }, [category, name]);

  const finalDuration = useMemo(() => {
    if (duration === "Custom") {
      return customUnit || "Custom Unit";
    }
    return duration;
  }, [duration, customUnit]);

  const handleSelectSuggestion = (sugg: { name: string; defaultUnit: string; description: string }) => {
    setName(sugg.name);
    setDuration(sugg.defaultUnit);
    setDescription(sugg.description);
    setShowSuggestions(false);
    toast.info(`Auto-filled details for "${sugg.name}"`);
  };

  const handleSave = async () => {
    const finalUnit = finalDuration;
    if (!name || !category || !description || !finalUnit || !price || (!image && !imageFile)) {
      toast.error("Please fill all fields, including the service image.");
      return;
    }

    if (!user) {
      toast.error("Please login.");
      return;
    }

    setIsSaving(true);

    try {
      let savedImage = image;

      if (imageFile) {
        const upload = await uploadServiceImageApi(imageFile);

        if (!upload.ok || !upload.image) {
          toast.error(upload.error ?? "Unable to upload service image.");
          return;
        }

        savedImage = upload.image;
      }

      if (selectedService) {
        const success = await updateExistingService({
          ...selectedService,
          name,
          category,
          description,
          duration: finalUnit,
          price: Number(price),
          image: savedImage,
          includes: selectedService.includes ?? [],
        });

        if (!success) {
          toast.error("Unable to update service.");
          return;
        }

        toast.success("Service updated successfully.");
      } else {
        const success = await addService({
          id: "",
          vendorId: 0,
          name,
          category,
          description,
          duration: finalUnit,
          price: Number(price),
          rating: 5,
          reviews: 0,
          image: savedImage,
          includes: [],
          status: "active",
          createdAt: "",
          updatedAt: "",
        });

        if (!success) {
          toast.error("Unable to create service.");
          return;
        }

        toast.success("Service created successfully.");
      }

      await loadMyServices();
      setName("");
      setCategory("");
      setDescription("");
      setDuration("");
      setCustomUnit("");
      setPrice("");
      setImage("");
      setImageFile(null);
      setImagePreviewUrl("");
      setSelectedService(null);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="text-[#e4005a]" size={24} />
            {selectedService ? "Edit Service Detail" : "Add New Service Offer"}
          </h2>

          <button
            onClick={() => {
              setSelectedService(null);
              onClose();
            }}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-8">
          {/* Category Dropdown */}
          <div>
            <label className="mb-2 block font-semibold text-gray-700 text-sm">
              Business Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e4005a] transition"
            >
              <option value="">Select Category</option>
              {VENDOR_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Service Name with Autocomplete suggestions */}
          <div className="relative" ref={suggestionsRef}>
            <label className="mb-2 block font-semibold text-gray-700 text-sm">
              Service Name / Title
            </label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="e.g. Traditional Fresh Flower Mandap, Pre-Wedding Shoot"
              className="h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e4005a] transition"
            />
            {showSuggestions && activeSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                <p className="px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50">
                  💡 Suggested for {category || "your category"}
                </p>
                {activeSuggestions.map((sugg) => (
                  <button
                    key={sugg.name}
                    type="button"
                    onClick={() => handleSelectSuggestion(sugg)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-900 transition"
                  >
                    <span className="font-semibold">{sugg.name}</span>
                    <span className="rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                      {sugg.defaultUnit}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block font-semibold text-gray-700 text-sm">
              Service Description & Inclusions
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what is included in this service (e.g., number of high-quality edited photos, setup dimensions, flavor options)..."
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e4005a] transition"
            />
          </div>

          {/* Billing Unit & Pricing container */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Billing Model / Rate type */}
            <div>
              <label className="mb-2 block font-semibold text-gray-700 text-sm">
                Billing Model / Rate Type
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e4005a] transition"
              >
                <option value="">Select Rate Unit</option>
                <option value="Per Kg">Per Kg (Baking/Cakes)</option>
                <option value="Per Plate / Guest">Per Plate / Guest (Catering)</option>
                <option value="Per Day">Per Day (Venue/Photo/Decor)</option>
                <option value="Per Hour">Per Hour (Music/Entertainment)</option>
                <option value="Flat Rate">Flat Rate (Per Event)</option>
                <option value="Custom">Custom / Specific Billing</option>
              </select>
              {duration === "Custom" && (
                <input
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                  placeholder="e.g. Per 12 Pieces, Per Backdrop"
                  className="mt-2.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#e4005a]"
                />
              )}
            </div>

            {/* Price input field with ₹ Currency Symbol */}
            <div>
              <label className="mb-2 block font-semibold text-gray-700 text-sm">
                Standard Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-extrabold text-base">₹</span>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter base price amount"
                  className="h-12 w-full rounded-xl border border-gray-300 pl-8 pr-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e4005a] transition font-bold"
                />
              </div>
            </div>
          </div>

          {/* Pricing Preview helper hint */}
          {price && finalUnitDesc(duration, customUnit) && (
            <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-3.5 text-xs text-rose-950 font-bold flex items-center gap-2">
              <CreditCard size={16} className="text-[#e4005a]" />
              <span>
                ✨ Listed Rate: <span className="text-[#e4005a] text-sm">₹{Number(price).toLocaleString("en-IN")}</span> / {finalUnitDesc(duration, customUnit)}
              </span>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="mb-3 block font-semibold text-gray-700 text-sm">
              Service Showcase Image
            </label>

            <div className="rounded-2xl border-2 border-dashed border-gray-300 p-5 bg-slate-50/50">
              {imagePreviewUrl || image ? (
                <div className="relative mx-auto h-56 w-full overflow-hidden rounded-xl shadow-xs">
                  <img
                    src={imagePreviewUrl || image}
                    alt="Service Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-56 flex-col items-center justify-center rounded-xl bg-slate-50 text-gray-400 border border-slate-200">
                  <HelpCircle size={32} className="text-slate-300" />
                  <p className="mt-2 text-xs font-semibold">No high-quality image selected yet</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSaving}
                className="mt-5 block w-full text-xs text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-rose-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-8 py-6">
          <button
            onClick={() => {
              setSelectedService(null);
              onClose();
            }}
            className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-[#e4005a] px-6 py-3 font-bold text-white shadow-md hover:bg-[#c0004c] disabled:opacity-60 transition"
          >
            {isSaving ? "Saving Service..." : selectedService ? "Update Offer" : "List New Service"}
          </button>
        </div>
      </div>
    </div>
  );
}

function finalUnitDesc(duration: string, customUnit: string): string {
  if (duration === "Custom") {
    return customUnit || "Custom Unit";
  }
  return duration;
}

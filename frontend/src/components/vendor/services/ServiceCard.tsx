"use client";

import Image from "next/image";
import {
  Pencil,
  Trash2,
  IndianRupee,
  Star,
  Clock3,
} from "lucide-react";

import { Service } from "@/types/service";
import { useServiceStore } from "@/store/serviceStore";

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
}

export default function ServiceCard({
  service,
  onEdit,
}: ServiceCardProps) {
  const {
    setSelectedService,
    deleteExistingService,
  } = useServiceStore();

  const handleEdit = () => {
    setSelectedService(service);

    onEdit();
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Image */}

      <div className="relative h-48 overflow-hidden rounded-2xl">
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover transition duration-300 hover:scale-105"
        />
      </div>

      {/* Details */}

      <div className="mt-5">

        <div className="flex items-center justify-between">

          <h3 className="text-xl font-bold text-slate-900">
            {service.name}
          </h3>

          <div className="flex items-center gap-1 text-yellow-500">
            <Star
              size={16}
              fill="currentColor"
            />

            <span className="text-sm font-semibold">
              {service.rating}
            </span>
          </div>

        </div>

        <p className="mt-2 text-slate-500">
          {service.category}
        </p>

        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">

          <Clock3 size={16} />

          {service.duration}

        </div>

        <div className="mt-6 flex items-center gap-2 font-bold text-[#e4005a]">

          <IndianRupee size={18} />

          ₹{service.price.toLocaleString("en-IN")}

        </div>

      </div>

      {/* Actions */}

      <div className="mt-6 flex gap-3">

        <button
          onClick={handleEdit}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#e4005a] py-3 font-semibold text-white transition hover:bg-[#e4005a]"
        >
          <Pencil size={18} />

          Edit
        </button>

        <button
          onClick={() =>
            deleteExistingService(service.id)
          }
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition hover:bg-red-100"
        >
          <Trash2 size={18} />
        </button>

      </div>

    </div>
  );
}
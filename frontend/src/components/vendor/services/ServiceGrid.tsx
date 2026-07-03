"use client";

import ServiceCard from "./ServiceCard";

import { Service } from "@/types/service";

interface ServiceGridProps {
  services: Service[];

  onEdit: () => void;
}

export default function ServiceGrid({
  services,
  onEdit,
}: ServiceGridProps) {
  if (services.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <h3 className="text-2xl font-bold text-slate-900">
          No Services Found
        </h3>

        <p className="mt-3 text-slate-500">
          No services match your current filters.
        </p>
      </div>
    );
  }

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onEdit={onEdit}
        />
      ))}
    </section>
  );
}
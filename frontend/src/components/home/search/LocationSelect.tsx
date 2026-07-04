"use client";

import { FaMapMarkerAlt } from "react-icons/fa";

import { CITIES } from "@/constants/cities";
import SearchDropdown from "./SearchDropdown";

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LocationSelect({
  value,
  onChange,
}: LocationSelectProps) {
  return (
    <SearchDropdown
      label="Location"
      placeholder="Select your city"
      value={value}
      items={CITIES}
      icon={<FaMapMarkerAlt />}
      onChange={onChange}
    />
  );
}
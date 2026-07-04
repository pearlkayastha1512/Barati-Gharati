"use client";

import { FaMagic } from "react-icons/fa";

import { VENDOR_CATEGORIES } from "@/constants/categories";
import SearchDropdown from "./SearchDropdown";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CategorySelect({
  value,
  onChange,
}: CategorySelectProps) {
  return (
    <SearchDropdown
      label="Category"
      placeholder="Select category"
      value={value}
      items={[...VENDOR_CATEGORIES]}
      icon={<FaMagic />}
      onChange={onChange}
    />
  );
}
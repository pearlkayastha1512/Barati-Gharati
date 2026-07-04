


"use client";

import { validateAccountStep } from "@/lib/validations/vendorRegistration";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useVendorRegistrationStore } from "@/store/vendorRegistrationStore";

export default function AccountStep() {
  const {
    formData,
    updateField,
    nextStep,
  } = useVendorRegistrationStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = () => {
    const result = validateAccountStep(formData);

    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    nextStep();
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-700">
          Account Information
        </h2>

        <p className="mt-2 text-gray-500">
          Let's create your vendor account first.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Owner Name */}
        <div>
          <label className="mb-2 block font-medium text-gray-600">
            Owner Name
          </label>

          <div className="relative">
            <User
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="John Doe"
              value={formData.ownerName}
              onChange={(e) =>
                updateField("ownerName", e.target.value)
              }
              className={`h-12 w-full rounded-xl border bg-white pl-12 pr-4 text-gray-700 placeholder:text-gray-400 outline-none transition ${
                errors.ownerName
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              }`}
            />
          </div>

          {errors.ownerName && (
            <p className="mt-2 text-sm text-red-500">
              {errors.ownerName}
            </p>
          )}
        </div>

        {/* Business Email */}
        <div>
          <label className="mb-2 block font-medium text-gray-600">
            Business Email
          </label>

          <div className="relative">
            <Mail
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              placeholder="vendor@email.com"
              value={formData.email}
              onChange={(e) =>
                updateField("email", e.target.value)
              }
              className={`h-12 w-full rounded-xl border bg-white pl-12 pr-4 text-gray-700 placeholder:text-gray-400 outline-none transition ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              }`}
            />
          </div>

          {errors.email && (
            <p className="mt-2 text-sm text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="mb-2 block font-medium text-gray-600">
            Phone Number
          </label>

          <div className="relative">
            <Phone
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) =>
                updateField("phone", e.target.value)
              }
              className={`h-12 w-full rounded-xl border bg-white pl-12 pr-4 text-gray-700 placeholder:text-gray-400 outline-none transition ${
                errors.phone
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              }`}
            />
          </div>

          {errors.phone && (
            <p className="mt-2 text-sm text-red-500">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block font-medium text-gray-600">
            Password
          </label>

          <div className="relative">
            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                updateField("password", e.target.value)
              }
              className={`h-12 w-full rounded-xl border bg-white pl-12 pr-12 text-gray-700 placeholder:text-gray-400 outline-none transition ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-2 text-sm text-red-500">
              {errors.password}
            </p>
          )}
        </div>
      </div>

      {/* Confirm Password */}
      <div className="mt-6">
        <label className="mb-2 block font-medium text-gray-600">
          Confirm Password
        </label>

        <div className="relative">
          <Lock
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              updateField(
                "confirmPassword",
                e.target.value
              )
            }
            className={`h-12 w-full rounded-xl border bg-white pl-12 pr-12 text-gray-700 placeholder:text-gray-400 outline-none transition ${
              errors.confirmPassword
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            }`}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
          >
            {showConfirmPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-500">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Continue Button */}
      <div className="mt-10 flex justify-end">
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center gap-3 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
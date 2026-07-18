


"use client";

import { validateAccountStep } from "@/lib/validations/vendorRegistration";
import { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useVendorRegistrationStore } from "@/store/vendorRegistrationStore";
import {
  startVendorRegistrationVerificationApi,
  verifyVendorRegistrationOtpApi,
} from "@/services/api/auth.api";

export default function AccountStep() {
  const {
    formData,
    updateField,
    nextStep,
    registrationVerificationId,
    setRegistrationVerificationId,
  } = useVendorRegistrationStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingVerificationId, setPendingVerificationId] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const requestInFlight = useRef(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const sendOtp = async () => {
    if (requestInFlight.current || resendCooldown > 0) return;
    const result = validateAccountStep(formData);

    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setVerificationError("");
    setLoading(true);
    requestInFlight.current = true;
    try {
      const response = await startVendorRegistrationVerificationApi({
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
      });
      setPendingVerificationId(response.data.verificationId);
      setOtp("");
      setResendCooldown(60);
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : "Unable to send OTP.");
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (requestInFlight.current) return;
    if (!pendingVerificationId || !/^\d{6}$/.test(otp)) {
      setVerificationError("Enter the 6-digit OTP sent to your email.");
      return;
    }
    setLoading(true);
    requestInFlight.current = true;
    setVerificationError("");
    try {
      await verifyVendorRegistrationOtpApi(pendingVerificationId, otp);
      setRegistrationVerificationId(pendingVerificationId);
      nextStep();
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : "OTP verification failed.");
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (registrationVerificationId) {
      nextStep();
      return;
    }
    void sendOtp();
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
      {pendingVerificationId && !registrationVerificationId && (
        <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <p className="font-semibold text-slate-900">Verify business email</p>
          <p className="mt-1 text-sm text-slate-600">
            Enter the 6-digit OTP sent to {formData.email}. Your phone number availability has also been checked.
          </p>
          <input
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
              setVerificationError("");
            }}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            className="mt-4 h-14 w-full rounded-xl border border-rose-200 bg-white px-4 text-center text-2xl font-bold tracking-[0.4em] text-slate-900 outline-none focus:border-rose-500"
          />
          <div className="mt-4 flex gap-3">
            <button type="button" disabled={loading} onClick={() => void verifyOtp()} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 font-semibold text-white disabled:opacity-60">
              {loading && <Loader2 size={18} className="animate-spin" />}
              Verify & Continue
            </button>
            <button type="button" disabled={loading || resendCooldown > 0} onClick={() => void sendOtp()} className="rounded-xl border border-rose-300 px-4 font-semibold text-rose-600 disabled:opacity-60">
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
            </button>
          </div>
        </div>
      )}

      {registrationVerificationId && (
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 font-semibold text-green-700">
          <CheckCircle2 size={20} /> Email verified
        </div>
      )}

      {verificationError && <p className="mt-4 text-sm font-medium text-red-600">{verificationError}</p>}

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          onClick={handleContinue}
          disabled={loading || Boolean(pendingVerificationId && !registrationVerificationId)}
          className="inline-flex items-center gap-3 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl"
        >
          {loading ? "Sending OTP..." : registrationVerificationId ? "Continue" : "Verify Email"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

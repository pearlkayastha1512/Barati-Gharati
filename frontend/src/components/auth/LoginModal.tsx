

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";

import { loginApi, resendEmailOtpApi, verifyEmailOtpApi, sendLoginOtpApi, verifyLoginOtpApi } from "@/services/api/auth.api";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { getDashboardRoute } from "@/lib/auth";

export default function LoginModal() {
  const {
    isLoginOpen,
    closeLogin,
    openRegister,
    openForgot,
    login,
  } = useAuthStore();



    const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [needsOtp, setNeedsOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const [loginMethod, setLoginMethod] = useState<"password" | "phone">("password");
  const [phone, setPhone] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleSendPhoneOtp = async () => {
    const cleanPhone = phone.trim();
    if (!/^\d{10}$/.test(cleanPhone)) {
      setPhoneError("Enter a valid 10-digit mobile phone number.");
      return;
    }
    setPhoneError("");
    try {
      setLoading(true);
      const res = await sendLoginOtpApi(cleanPhone);
      setPhoneOtpSent(true);
      if (res.otp) {
        toast.success(`OTP Code: ${res.otp}`, { duration: 10000 });
      } else {
        toast.success(res.message || "OTP sent to your registered phone!");
      }
    } catch (err: unknown) {
      setPhoneError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!/^\d{6}$/.test(phoneOtp)) {
      setPhoneError("Enter the 6-digit OTP code.");
      return;
    }
    setPhoneError("");
    try {
      setLoading(true);
      const result = await verifyLoginOtpApi(phone.trim(), phoneOtp);
      login(result.user, result.accessToken);
      closeLogin();
      toast.success("Logged in successfully!");
      router.push(getDashboardRoute(result.user.role));
    } catch (err: unknown) {
      setPhoneError(err instanceof Error ? err.message : "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLogin();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeLogin]);

  

 const handleLogin = async () => {
  const newErrors = {
    email: "",
    password: "",
  };

  if (!email.trim()) {
    newErrors.email = "Email is required.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    newErrors.email = "Enter a valid email.";
  }

  if (!password) {
    newErrors.password = "Password is required.";
  }

  setErrors(newErrors);

  if (Object.values(newErrors).some(Boolean)) {
    return;
  }

  try {
    setLoading(true);

    const result = await loginApi({
      email,
      password,
    });

    login(
      result.user,
      result.accessToken
    );

    closeLogin();

    router.push(
      getDashboardRoute(
        result.user.role
      )
    );
  } catch (error: unknown) {
  const message = error instanceof Error ? error.message : "Login failed.";
  if (message.toLowerCase().includes("verify your email")) setNeedsOtp(true);
  setErrors({
    email: message,
    password: "",
  });
} finally {
    setLoading(false);
  }
};

const verifyLoginOtp = async () => {
  if (!/^\d{6}$/.test(otp)) return setErrors((current) => ({ ...current, email: "Enter the 6-digit OTP." }));
  try {
    setLoading(true);
    await verifyEmailOtpApi(email, otp);
    setNeedsOtp(false);
    setOtp("");
    setErrors({ email: "", password: "" });
    toast.success("Email verified. Login will be available after admin approval.");
  } catch (error: unknown) {
    setErrors((current) => ({ ...current, email: error instanceof Error ? error.message : "OTP verification failed." }));
  } finally {
    setLoading(false);
  }
};

const resendLoginOtp = async () => {
  try {
    setLoading(true);
    await resendEmailOtpApi(email);
    toast.success("A new OTP has been sent.");
  } catch (error: unknown) {
    setErrors((current) => ({ ...current, email: error instanceof Error ? error.message : "Unable to resend OTP." }));
  } finally {
    setLoading(false);
  }
};
  return (
    <AnimatePresence>
      {isLoginOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLogin}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-5"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 50,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 50,
            }}
            transition={{
              duration: 0.35,
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-7 py-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome Back
                </h2>

                <p className="mt-2 text-gray-500">
                  Continue planning your dream wedding
                </p>
              </div>

              <button
                onClick={closeLogin}
                className="rounded-full p-2 transition hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6 p-7">
              {/* Method Switcher */}
              <div className="flex rounded-xl bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("password");
                    setPhoneError("");
                  }}
                  className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition ${
                    loginMethod === "password"
                      ? "bg-white text-rose-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("phone");
                    setPhoneError("");
                  }}
                  className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition ${
                    loginMethod === "phone"
                      ? "bg-white text-rose-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Phone OTP Login
                </button>
              </div>

              {loginMethod === "phone" ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-medium text-gray-700">
                      Mobile Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                          setPhoneError("");
                        }}
                        placeholder="10-digit registered phone number"
                        className="h-12 w-full rounded-xl border border-gray-300 pl-12 pr-4 text-gray-700 outline-none transition focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {phoneOtpSent && (
                    <div>
                      <label className="mb-2 block font-medium text-gray-700">
                        Enter 6-digit OTP
                      </label>
                      <div className="relative">
                        <ShieldCheck
                          size={20}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={phoneOtp}
                          onChange={(e) => {
                            setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                            setPhoneError("");
                          }}
                          placeholder="000000"
                          className="h-12 w-full rounded-xl border border-gray-300 pl-12 pr-4 text-center text-lg font-bold tracking-[0.3em] text-gray-800 outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>
                  )}

                  {phoneError && (
                    <p className="text-sm font-medium text-red-500">{phoneError}</p>
                  )}

                  {!phoneOtpSent ? (
                    <button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      disabled={loading}
                      className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 font-semibold text-white shadow-lg transition-all hover:scale-[1.01] disabled:opacity-70"
                    >
                      {loading ? (
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Sending OTP...
                        </div>
                      ) : (
                        "Send Login OTP"
                      )}
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleVerifyPhoneOtp}
                        disabled={loading}
                        className="flex h-12 flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 font-semibold text-white shadow-lg transition-all hover:scale-[1.01] disabled:opacity-70"
                      >
                        {loading ? "Verifying..." : "Verify & Login"}
                      </button>
                      <button
                        type="button"
                        onClick={handleSendPhoneOtp}
                        disabled={loading}
                        className="h-12 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Resend
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Email */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-700">
                      Email
                    </label>

                    <div className="relative">
                      <Mail
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) {
                            setErrors((prev) => ({
                              ...prev,
                              email: "",
                            }));
                          }
                        }}
                        placeholder="Enter your email"
                        className={`h-12 w-full rounded-xl border pl-12 pr-4 text-gray-700 outline-none transition ${
                          errors.email
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-rose-500"
                        }`}
                      />
                    </div>

                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-700">
                      Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) {
                            setErrors((prev) => ({
                              ...prev,
                              password: "",
                            }));
                          }
                        }}
                        placeholder="Password"
                        className={`h-12 w-full rounded-xl border pl-12 pr-12 text-gray-700 outline-none transition ${
                          errors.password
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-rose-500"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {needsOtp && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                      <p className="text-sm font-semibold text-slate-800">Verify your email OTP</p>
                      <input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" className="mt-3 h-12 w-full rounded-xl border border-rose-200 bg-white text-center text-xl font-bold tracking-[0.4em] text-slate-900 outline-none focus:border-rose-500" />
                      <div className="mt-3 flex gap-3">
                        <button type="button" disabled={loading} onClick={() => void verifyLoginOtp()} className="flex-1 rounded-xl bg-rose-500 py-2 text-sm font-semibold text-white disabled:opacity-60">Verify OTP</button>
                        <button type="button" disabled={loading} onClick={() => void resendLoginOtp()} className="rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-600 disabled:opacity-60">Resend</button>
                      </div>
                    </div>
                  )}

                  {/* Remember Me + Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="accent-rose-500"
                      />
                      Remember Me
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        closeLogin();
                        openForgot();
                      }}
                      className="text-sm font-medium text-rose-500 transition hover:text-rose-600"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Login Button */}
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Signing In...
                      </div>
                    ) : (
                      "Login"
                    )}
                  </button>
                </>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">
                    OR
                  </span>
                </div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center rounded-xl border border-gray-300 bg-white font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Continue with Google
              </button>

              {/* Register */}
              <div className="text-center text-sm text-gray-600">
                Don&apos;t have an account?
                <button
                  type="button"
                  onClick={() => {
                    closeLogin();
                    openRegister();
                  }}
                  className="ml-2 font-semibold text-rose-500 hover:text-rose-600"
                >
                  Register
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

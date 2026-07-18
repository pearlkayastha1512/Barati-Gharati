"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  Crown,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";

// import { registerUser } from "@/services/auth.service";
import { registerApi, resendEmailOtpApi, verifyEmailOtpApi } from "@/services/api/auth.api";
import { toast } from "sonner";
import { createCustomerPremiumRegistrationOrderApi } from "@/services/api/payment.api";

type MembershipPayment = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export default function RegisterModal() {
 const {
  isRegisterOpen,
  closeRegister,
  openLogin,
} = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agree, setAgree] = useState(false);
  const [membership, setMembership] = useState<"FREE" | "PREMIUM">("FREE");
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });



//errros store 

const [errors, setErrors] = useState({
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});


  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeRegister();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () =>
      window.removeEventListener("keydown", handleEsc);
  }, [closeRegister]);

  const handleRegister = async () => {


    const newErrors = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  // Name validation
  if (!form.name.trim()) {
    newErrors.name = "Full name is required.";
  } else if (form.name.trim().length < 3) {
    newErrors.name = "Name must be at least 3 characters.";
  }

  // Email validation
  if (!form.email.trim()) {
    newErrors.email = "Email is required.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  ) {
    newErrors.email = "Enter a valid email address.";
  }

  // Phone validation
if (!form.phone.trim()) {
  newErrors.phone = "Phone number is required.";
} else if (!/^[6-9]\d{9}$/.test(form.phone)) {
  newErrors.phone = "Enter a valid 10-digit phone number.";
}

// Password validation
if (!form.password) {
  newErrors.password = "Password is required.";
} else if (form.password.length < 8) {
  newErrors.password =
    "Password must be at least 8 characters.";
}

// Confirm Password validation
if (!form.confirmPassword) {
  newErrors.confirmPassword =
    "Please confirm your password.";
} else if (
  form.password !== form.confirmPassword
) {
  newErrors.confirmPassword =
    "Passwords do not match.";
}


  setErrors(newErrors);

  if (Object.values(newErrors).some((error) => error !== "")) {
    return;
  }

  
  setLoading(true);

// const result = registerUser(form);

// if (!result.success) {
//   setLoading(false);

//   setErrors((prev) => ({
//     ...prev,
//     email: result.message,
//   }));

//   return;
// }


try {
  const finishRegistration = async (payment?: MembershipPayment) => {
    await registerApi({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      membership,
      membershipPaymentOrderId: payment?.razorpay_order_id,
      membershipPaymentId: payment?.razorpay_payment_id,
      membershipPaymentSignature: payment?.razorpay_signature,
    });

    setOtpEmail(form.email);
    setOtp("");
    setOtpError("");
    toast.success("Registration successful. OTP sent to your email.");
    setLoading(false);
  };

  if (membership === "FREE") {
    await finishRegistration();
    return;
  }

  const order = await createCustomerPremiumRegistrationOrderApi();
  if (!order.ok || !order.data) {
    throw new Error(order.error ?? "Unable to start premium payment.");
  }

  const loaded = await new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  if (!loaded || !window.Razorpay) throw new Error("Payment gateway could not be loaded.");

  new window.Razorpay({
    key: order.data.keyId,
    amount: order.data.amountInPaise,
    currency: order.data.currency,
    name: "Barati Gharati",
    description: "Customer Premium Membership",
    order_id: order.data.orderId,
    prefill: { name: form.name, email: form.email, contact: form.phone },
    theme: { color: "#f43f5e" },
    handler: (payment) => void finishRegistration(payment).catch((error: Error) => {
      setLoading(false);
      setErrors((prev) => ({ ...prev, email: error.message }));
    }),
    modal: { ondismiss: () => setLoading(false) },
  }).open();
} catch (error: unknown) {
  setLoading(false);
  setErrors((prev) => ({
    ...prev,
    email: error instanceof Error ? error.message : "Registration failed.",
  }));
}
// setLoading(false);

// closeRegister();

// openLogin();


// setForm({
//   name: "",
//   email: "",
//   phone: "",
//   password: "",
//   confirmPassword: "",
// });

// setAgree(false);
};

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Enter the 6-digit OTP.");
      return;
    }
    try {
      setLoading(true);
      await verifyEmailOtpApi(otpEmail, otp);
      toast.success("Email verified. Your account is awaiting admin approval.");
      setForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
      setMembership("FREE");
      setAgree(false);
      setOtpEmail("");
      setOtp("");
      closeRegister();
      openLogin();
    } catch (error: unknown) {
      setOtpError(error instanceof Error ? error.message : "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setLoading(true);
      await resendEmailOtpApi(otpEmail);
      setOtpError("");
      toast.success("A new OTP has been sent.");
    } catch (error: unknown) {
      setOtpError(error instanceof Error ? error.message : "Unable to resend OTP.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <AnimatePresence>
      {isRegisterOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeRegister}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 40,
            }}
            transition={{
              duration: 0.35,
            }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-7 py-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {otpEmail ? "Verify Email" : "Create Account"}
                </h2>

                <p className="mt-2 text-gray-500">
                  {otpEmail ? `Enter the OTP sent to ${otpEmail}` : "Join thousands of happy couples."}
                </p>
              </div>

              <button
                onClick={closeRegister}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            {otpEmail && (
              <div className="space-y-5 p-7 text-slate-900">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  Email OTP verify karne ke baad account admin review mein jayega. Admin approval ke baad login available hoga.
                </div>
                <label className="block text-sm font-semibold text-slate-700">
                  6-digit OTP
                  <input
                    value={otp}
                    onChange={(event) => {
                      setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                      setOtpError("");
                    }}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className="mt-2 h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-center text-2xl font-bold tracking-[0.45em] text-slate-900 outline-none focus:border-rose-500"
                    placeholder="000000"
                  />
                </label>
                {otpError && <p className="text-sm text-red-600">{otpError}</p>}
                <button type="button" disabled={loading} onClick={() => void verifyOtp()} className="h-12 w-full rounded-xl bg-rose-500 font-semibold text-white disabled:opacity-60">
                  {loading ? "Verifying..." : "Verify Email OTP"}
                </button>
                <button type="button" disabled={loading} onClick={() => void resendOtp()} className="w-full text-sm font-semibold text-rose-600 disabled:opacity-60">
                  Resend OTP
                </button>
              </div>
            )}

            <div className={`${otpEmail ? "hidden" : "space-y-4"} p-6`}>

              {/* Full Name */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
  




<div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Full Name
  </label>

  <div className="relative">
    <User
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      value={form.name}
      onChange={(e) =>
        setForm({
          ...form,
          name: e.target.value,
        })
      }
      placeholder="Full Name"
      className="h-11 w-full rounded-xl border border-gray-300 pl-11 pr-4 text-gray-700 outline-none transition focus:border-rose-500"
    />
  </div>

  {errors.name && (
    <p className="mt-1 text-sm text-red-500">
      {errors.name}
    </p>
  )}
</div>

  {/* Email */}
  <div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Email
  </label>

  <div className="relative">
    <Mail
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      type="email"
      value={form.email}
      onChange={(e) =>
        setForm({
          ...form,
          email: e.target.value,
        })
      }
      placeholder="Email"
      className="h-11 w-full rounded-xl border border-gray-300 pl-11 pr-4 text-gray-700 outline-none transition focus:border-rose-500"
    />
  </div>

  {errors.email && (
    <p className="mt-1 text-sm text-red-500">
      {errors.email}
    </p>
  )}
</div>

  {/* Phone */}
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      Phone
    </label>

    <div className="relative">
      <Phone
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        value={form.phone}
        onChange={(e) =>
          setForm({
            ...form,
            phone: e.target.value,
          })
        }
        placeholder="Phone"
        className="h-11 w-full rounded-xl border border-gray-300 pl-11 pr-4 text-gray-700 outline-none transition focus:border-rose-500"
      />
    </div>
    {errors.phone && (
  <p className="mt-1 text-sm text-red-500">
    {errors.phone}
  </p>
)}
  </div>

  {/* Password */}
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      Password
    </label>

    <div className="relative">
      <Lock
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={(e) =>
          setForm({
            ...form,
            password: e.target.value,
          })
        }
        placeholder="Create Password"
        className="h-11 w-full rounded-xl border border-gray-300 pl-11 pr-11 text-gray-700 outline-none transition focus:border-rose-500"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {errors.password && (
  <p className="mt-1 text-sm text-red-500">
    {errors.password}
  </p>
)}
  </div>
  
</div>

              

              











               
              {/* Confirm Password */}
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm Password"
                    className="h-12 w-full rounded-xl border border-gray-300 pl-12 pr-12 text-gray-700 outline-none focus:border-rose-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
  <p className="mt-1 text-sm text-red-500">
    {errors.confirmPassword}
  </p>
)}
              </div>

              {/* Password Strength */}
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-600">
                    Password Strength
                  </span>

                  <span
                    className={`font-semibold ${
                      form.password.length >= 8
                        ? "text-green-600"
                        : form.password.length >= 5
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {form.password.length >= 8
                      ? "Strong"
                      : form.password.length >= 5
                      ? "Medium"
                      : "Weak"}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      form.password.length >= 8
                        ? "w-full bg-green-500"
                        : form.password.length >= 5
                        ? "w-2/3 bg-yellow-500"
                        : "w-1/3 bg-red-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Choose your membership</p>
                    <p className="text-sm text-gray-500">Premium includes our managed wedding-planning service.</p>
                  </div>
                  <Crown className="text-amber-500" size={24} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setMembership("FREE")}
                    className={`rounded-2xl border p-4 text-left transition ${membership === "FREE" ? "border-rose-500 bg-rose-50 ring-2 ring-rose-100" : "border-gray-200"}`}
                  >
                    <div className="flex items-center justify-between font-semibold text-gray-900">
                      Free <span>₹0</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Browse vendors and use standard planning tools.</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMembership("PREMIUM")}
                    className={`rounded-2xl border p-4 text-left transition ${membership === "PREMIUM" ? "border-amber-500 bg-amber-50 ring-2 ring-amber-100" : "border-gray-200"}`}
                  >
                    <div className="flex items-center justify-between font-semibold text-gray-900">
                      Premium <span>₹4,999</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">One-time payment · personal team review and quotation.</p>
                    <div className="mt-3 space-y-1 text-xs text-gray-600">
                      {["Fill wedding preferences", "Vendor assignment", "Personal quotation", "Booking coordination"].map((feature) => (
                        <span key={feature} className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green-600" />{feature}</span>
                      ))}
                    </div>
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 accent-rose-500"
                />

                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="font-semibold text-rose-500 hover:underline"
                  >
                    Terms & Conditions
                  </button>
                </span>
              </label>

                            {/* Create Account Button */}
              <button
                type="button"
                disabled={!agree || loading}
                onClick={handleRegister}
                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-gradient-to-r
                  from-rose-500
                  to-pink-500
                  font-semibold
                  text-white
                  shadow-lg
                  transition-all
                  duration-300
                  hover:scale-[1.01]
                  hover:shadow-xl
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Already Have an Account */}
              <div className="text-center text-sm text-gray-600">
                Already have an account?

                <button
                  type="button"
                  onClick={() => {
                    closeRegister();
                    // openLogin();
                  }}
                  className="ml-2 font-semibold text-rose-500 transition hover:text-rose-600"
                >
                  Login
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

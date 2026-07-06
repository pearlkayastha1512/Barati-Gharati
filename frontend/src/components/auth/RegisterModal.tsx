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
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";

// import { registerUser } from "@/services/auth.service";
import { registerApi } from "@/services/api/auth.api";
import { toast } from "sonner";

export default function RegisterModal() {
 const {
  isRegisterOpen,
  closeRegister,
  openLogin,
  login,
} = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agree, setAgree] = useState(false);

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
  setLoading(true);

  await registerApi({
  name: form.name,
  email: form.email,
  phone: form.phone,
  password: form.password,
});

  setLoading(false);

  // if (!result.ok) {
  //   setErrors((prev) => ({
  //     ...prev,
  //     email:
  //       result.data.message ??
  //       "Registration failed.",
  //   }));

  //   return;
  // }

  closeRegister();

  toast.success(
  "Registration successful. Please verify your email."
);

  openLogin();

  setForm({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  setAgree(false);
} catch (error: any) {
  setLoading(false);

  setErrors((prev) => ({
    ...prev,
    email:
      error.message ||
      "Registration failed.",
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
                  Create Account
                </h2>

                <p className="mt-2 text-gray-500">
                  Join thousands of happy couples.
                </p>
              </div>

              <button
                onClick={closeRegister}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4 p-6">

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

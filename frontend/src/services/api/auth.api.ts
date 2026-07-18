const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  membership?: "FREE" | "PREMIUM";
  membershipPaymentOrderId?: string;
  membershipPaymentId?: string;
  membershipPaymentSignature?: string;
}

export async function registerApi(
  data: RegisterRequest
) {
  const response = await fetch(
    `${API_URL}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Registration failed"
    );
  }

  return result;
}

export async function verifyEmailOtpApi(email: string, otp: string) {
  const response = await fetch(`${API_URL}/verify-email-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "OTP verification failed");
  return result;
}

export async function resendEmailOtpApi(email: string) {
  const response = await fetch(`${API_URL}/resend-email-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to resend OTP");
  return result;
}

export interface LoginRequest {
  email: string;
  password: string;
}


export async function loginApi(
  data: LoginRequest
) {
  const response = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Login failed"
    );
  }

  return result;
}


export interface VendorRegisterRequest {
  registrationVerificationId: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;

  businessName: string;
  category: string;
  city: string;
  address: string;
  description: string;

  website: string;
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;

  experience: string;
  gstNumber: string;

  profileImage: string;
  coverImage: string;

  selectedBadge: "BRONZE" | "SILVER" | "GOLD";
  badgeBillingCycle?: "MONTHLY" | "YEARLY";
  badgePaymentOrderId?: string;
  badgePaymentId?: string;
  badgePaymentSignature?: string;
}

export async function startVendorRegistrationVerificationApi(payload: {
  ownerName: string;
  email: string;
  phone: string;
}) {
  const response = await fetch(`${API_URL}/register/vendor/start-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 429) {
      const retryAfter = response.headers.get("retry-after");
      throw new Error(
        retryAfter
          ? `Bahut zyada OTP requests hui hain. ${retryAfter} seconds baad try karein.`
          : "Bahut zyada OTP requests hui hain. Thodi der baad dobara try karein.",
      );
    }
    throw new Error(result.message || "Unable to send OTP");
  }
  return result as { data: { verificationId: string } };
}

export async function verifyVendorRegistrationOtpApi(
  verificationId: string,
  otp: string,
) {
  const response = await fetch(`${API_URL}/register/vendor/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ verificationId, otp }),
  });
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Bahut zyada verification attempts hui hain. Thodi der baad try karein.");
    }
    throw new Error(result.message || "OTP verification failed");
  }
  return result;
}

export async function uploadVendorRegistrationImageApi(
  file: File,
) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `${API_URL}/register/vendor/image`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  return {
    ok: response.ok,
    data: result as {
      image?: string;
      message?: string;
    },
  };
}

export async function registerVendorApi(
  data: VendorRegisterRequest,
) {
  const response = await fetch(
    `${API_URL}/register/vendor`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  return {
    ok: response.ok,
    data: result,
  };
}

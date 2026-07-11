const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
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

  selectedBadge: "SILVER" | "GOLD";
  badgePaymentOrderId: string;
  badgePaymentId: string;
  badgePaymentSignature: string;
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

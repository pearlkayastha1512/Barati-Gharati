// // import api from "./axios";

// // export const getAllVendors = () => {
// //   return api.get("/vendor/all");
// // };

// // export const getVendorById = (id: string) => {
// //   return api.get(`/vendor/${id}`);
// // };
// import api from "./axios";

// export interface RegisterVendorRequest {
//   ownerName: string;
//   email: string;
//   phone: string;
//   password: string;

//   businessName: string;

//   category?: string;
//   city?: string;
//   address?: string;
//   description?: string;

//   website?: string;
//   instagram?: string;
//   facebook?: string;
//   youtube?: string;
//   linkedin?: string;

//   experience?: string;
//   gstNumber?: string;
// }

// export interface RegisterVendorResponse {
//   message: string;
// }

// export const registerVendor = async (
//   data: RegisterVendorRequest,
// ): Promise<RegisterVendorResponse> => {
//   const response =
//     await api.post<RegisterVendorResponse>(
//       "/auth/register/vendor",
//       data,
//     );

//   return response.data;
// };

// export const getAllVendors = async () => {
//   const response = await api.get(
//     "/vendor/all",
//   );

//   return response.data;
// };

// export const getVendorById = async (
//   id: string,
// ) => {
//   const response = await api.get(
//     `/vendor/${id}`,
//   );

//   return response.data;
// };
// // ===============================
// // GET LOGGED IN VENDOR PROFILE
// // ===============================

// export const getMyVendorProfile = async () => {

//   const response = await api.get(
//     "/vendor/profile",
//   );

//   return response.data;
// };



// // ===============================
// // UPDATE VENDOR PROFILE
// // ===============================

// export const updateVendorProfile = async (
//   data: any,
// ) => {

//   const response = await api.patch(
//     "/vendor/profile",
//     data,
//   );

//   return response.data;
// };
import api from "./axios";
import { Vendor } from "../constants/vendorData";

type BackendVendor = {
  id: number;
  name: string;
  category: string;
  city: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  images?: string[];
  featured?: boolean;
  description?: string;
  packages?: { id: string | number; name: string; price: number }[];
};

type VendorListApiResponse = { success: boolean; data: BackendVendor[] };
type VendorApiResponse = { success: boolean; data: BackendVendor };

const normalizeVendor = (vendor: BackendVendor): Vendor => ({
  id: String(vendor.id),
  name: vendor.name,
  category: vendor.category,
  rating: String(vendor.rating),
  reviews: String(vendor.reviews),
  location: vendor.city,
  city: vendor.city,
  price: `₹${vendor.price.toLocaleString("en-IN")}`,
  priceValue: vendor.price,
  image: vendor.image,
  images: vendor.images,
  featured: vendor.featured,
  description: vendor.description,
  packages: vendor.packages,
});

export interface RegisterVendorRequest {
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
  category?: string;
  city?: string;
  address?: string;
  description?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  experience?: string;
  gstNumber?: string;
  profileImage?: string;
  coverImage?: string;
  selectedBadge: "BRONZE" | "SILVER" | "GOLD";
  badgePaymentOrderId?: string;
  badgePaymentId?: string;
  badgePaymentSignature?: string;
}

export interface RegisterVendorResponse {
  message: string;
}

interface VendorRegistrationImageResponse {
  success: boolean;
  message: string;
  image: string;
}

const getImageUploadMetadata = (uri: string) => {
  const cleanUri = uri.split("?")[0];
  const rawExtension = cleanUri.split(".").pop()?.toLowerCase();
  const extension = ["png", "webp", "jpg", "jpeg"].includes(rawExtension ?? "")
    ? rawExtension
    : "jpg";
  const type = extension === "png"
    ? "image/png"
    : extension === "webp"
      ? "image/webp"
      : "image/jpeg";

  return { extension, type };
};

export const uploadVendorRegistrationImage = async (
  uri: string,
): Promise<string> => {
  if (/^https:\/\//i.test(uri)) return uri;

  const { extension, type } = getImageUploadMetadata(uri);
  const formData = new FormData();

  formData.append("image", {
    uri,
    name: `vendor-registration-${Date.now()}.${extension}`,
    type,
  } as any);

  const response = await api.post<VendorRegistrationImageResponse>(
    "/auth/register/vendor/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  if (!response.data.image) {
    throw new Error("Image upload failed");
  }

  return response.data.image;
};

export const registerVendor = async (
  data: RegisterVendorRequest,
): Promise<RegisterVendorResponse> => {
  const response = await api.post(
    "/auth/register/vendor",
    data,
  );

  return response.data;
};

export const getAllVendors = async (): Promise<Vendor[]> => {
  const response = await api.get<VendorListApiResponse>(
    "/vendor/all",
  );
  return response.data.data.map(normalizeVendor);
};

export const getVendorById = async (
  id: string,
): Promise<Vendor> => {
  const response = await api.get<VendorApiResponse>(
    `/vendor/${id}`,
  );

  return normalizeVendor(response.data.data);
};
export const getMyVendorProfile = async () => {
  const response = await api.get(
    "/vendor/profile",
  );

  return response.data;
};

export const updateVendorProfile = async (
  data: any,
) => {
  const response = await api.patch(
    "/vendor/profile",
    data,
  );

  return response.data;
};

export const uploadVendorLogo = async (
  uri: string,
) => {
  const formData = new FormData();

  formData.append("image", {
    uri,
    name: "logo.jpg",
    type: "image/jpeg",
  } as any);

  const response = await api.post(
    "/vendor/upload-logo",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const uploadVendorCover = async (
  uri: string,
) => {
  const formData = new FormData();

  formData.append("image", {
    uri,
    name: "cover.jpg",
    type: "image/jpeg",
  } as any);

  const response = await api.post(
    "/vendor/upload-cover",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const uploadGalleryImages = async (
  images: string[],
) => {
  const formData = new FormData();

  images.forEach((uri, index) => {
    formData.append("images", {
      uri,
      name: `image${index}.jpg`,
      type: "image/jpeg",
    } as any);
  });

  const response = await api.post(
    "/vendor/gallery",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const getGallery = async () => {
  const response = await api.get(
    "/vendor/gallery",
  );

  return response.data;
};

export const deleteGalleryImage = async (
  id: string,
) => {
  const response = await api.delete(
    `/vendor/gallery/${id}`,
  );

  return response.data;
};

export const getVendorDashboard = async () => {
  const response = await api.get(
    "/vendor/dashboard",
  );

  return response.data;
};



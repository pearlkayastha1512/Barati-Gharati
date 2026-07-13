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
}

export interface RegisterVendorResponse {
  message: string;
}

export const registerVendor = async (
  data: RegisterVendorRequest,
): Promise<RegisterVendorResponse> => {
  const response = await api.post(
    "/auth/register/vendor",
    data,
  );

  return response.data;
};

export const getAllVendors = async () => {
  const response = await api.get(
    "/vendor/all",
  );

  return response.data;
};

export const getVendorById = async (
  id: string,
) => {
  const response = await api.get(
    `/vendor/${id}`,
  );

  return response.data;
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
// import api from "@/lib/axios";
// import { Service } from "@/types/service";

// export async function getServicesApi() {
//   try {
//     const { data } = await api.get("/packages");

//     return {
//       ok: true,
//       data,
//     };
//   } catch (error: any) {
//     return {
//       ok: false,
//       error:
//         error.response?.data?.message ??
//         "Unable to load services.",
//     };
//   }
// }

// export async function getVendorServicesApi() {
//   try {
//     const { data } = await api.get(
//       "/packages/my/packages"
//     );

//     return {
//       ok: true,
//       data,
//     };
//   } catch (error: any) {
//     return {
//       ok: false,
//       error:
//         error.response?.data?.message ??
//         "Unable to load vendor services.",
//     };
//   }
// }

// export async function createServiceApi(
//   service: Service
// ) {
//   try {
//     const { data } = await api.post(
//       "/packages",
//       {
//         name: service.name,
//         category: service.category,
//         description: service.description,
//         duration: service.duration,
//         price: service.price,
//         image: service.image,
//         includes: service.includes,
//       }
//     );

//     return {
//       ok: true,
//       data,
//     };
//   } catch (error: any) {
//     return {
//       ok: false,
//       error:
//         error.response?.data?.message ??
//         "Unable to create service.",
//     };
//   }
// }

// export async function updateServiceApi(
//   service: Service
// ) {
//   try {
//     const { data } = await api.patch(
//       `/packages/${service.id}`,
//       {
//         name: service.name,
//         category: service.category,
//         description: service.description,
//         duration: service.duration,
//         price: service.price,
//         image: service.image,
//         includes: service.includes,
//       }
//     );

//     return {
//       ok: true,
//       data,
//     };
//   } catch (error: any) {
//     return {
//       ok: false,
//       error:
//         error.response?.data?.message ??
//         "Unable to update service.",
//     };
//   }
// }

// export async function deleteServiceApi(
//   id: string
// ) {
//   try {
//     await api.delete(`/packages/${id}`);

//     return {
//       ok: true,
//     };
//   } catch (error: any) {
//     return {
//       ok: false,
//       error:
//         error.response?.data?.message ??
//         "Unable to delete service.",
//     };
//   }
// }




import api from "@/lib/axios";
import { Service } from "@/types/service";

function getErrorMessage(error: any, fallback: string) {
  const message = error?.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(" ");
  }

  return typeof message === "string" && message.trim()
    ? message
    : fallback;
}

export async function getServicesApi() {
  try {
    const { data } = await api.get("/packages");

    return {
      ok: true,
      data: data?.data ?? data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load services.",
    };
  }
}

export async function getVendorServicesApi() {
  try {
    const { data } = await api.get(
      "/packages/my/packages"
    );

    return {
      ok: true,
      data: data?.data ?? data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load vendor services.",
    };
  }
}

export async function getPublicVendorServicesApi(
  vendorId: number
) {
  try {
    const { data } = await api.get(
      `/packages/vendor/${vendorId}`
    );

    return {
      ok: true,
      data: data?.data ?? data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load vendor services.",
    };
  }
}

export async function createServiceApi(
  service: Service
) {
  try {
    const { data } = await api.post(
      "/packages",
      {
        name: service.name,
        category: service.category,
        description: service.description,
        duration: service.duration,
        price: service.price,
        image: service.image,
        includes: service.includes,
      }
    );

    return {
      ok: true,
      data: data?.data ?? data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to create service.",
    };
  }
}

export async function uploadServiceImageApi(
  file: File
): Promise<{
  ok: boolean;
  image?: string;
  error?: string;
}> {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await api.post(
      "/packages/upload-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      ok: true,
      image: data?.image,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to upload service image."
      ),
    };
  }
}

export async function updateServiceApi(
  service: Service
) {
  try {
    const { data } = await api.patch(
      `/packages/${service.id}`,
      {
        name: service.name,
        category: service.category,
        description: service.description,
        duration: service.duration,
        price: service.price,
        image: service.image,
        includes: service.includes,
      }
    );

    return {
      ok: true,
      data: data?.data ?? data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to update service.",
    };
  }
}

export async function deleteServiceApi(
  id: string
) {
  try {
    await api.delete(`/packages/${id}`);

    return {
      ok: true,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to delete service.",
    };
  }
}


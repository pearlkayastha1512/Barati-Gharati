// import api from "@/lib/axios";
// import { AxiosError } from "axios";

// import {
//   WeddingStory,
//   CreateWeddingStoryDto,
//   UpdateWeddingStoryDto,
// } from "@/types/wedding-story";

// type ApiErrorResponse = {
//   message?: string;
// };

// function getErrorMessage(
//   error: unknown,
//   fallback: string
// ) {
//   if (error instanceof AxiosError) {
//     const data = error.response
//       ?.data as ApiErrorResponse | undefined;

//     return data?.message ?? fallback;
//   }

//   return fallback;
// }

// /* ============================================
//    GET ALL STORIES
// ============================================ */

// export async function getWeddingStoriesApi(): Promise<{
//   ok: boolean;
//   data?: WeddingStory[];
//   error?: string;
// }> {
//   try {
//     const { data } = await api.get(
//       "/wedding-stories"
//     );

//     return {
//       ok: true,
//       data: data.data,
//     };
//   } catch (error) {
//     return {
//       ok: false,
//       error: getErrorMessage(
//         error,
//         "Unable to load wedding stories."
//       ),
//     };
//   }
// }

// /* ============================================
//    GET STORY
// ============================================ */

// export async function getWeddingStoryApi(
//   id: string
// ): Promise<{
//   ok: boolean;
//   data?: WeddingStory;
//   error?: string;
// }> {
//   try {
//     const { data } = await api.get(
//       `/wedding-stories/${id}`
//     );

//     return {
//       ok: true,
//       data: data.data,
//     };
//   } catch (error) {
//     return {
//       ok: false,
//       error: getErrorMessage(
//         error,
//         "Unable to load wedding story."
//       ),
//     };
//   }
// }

// /* ============================================
//    CREATE STORY
// ============================================ */

// export async function createWeddingStoryApi(
//   payload: CreateWeddingStoryDto
// ): Promise<{
//   ok: boolean;
//   data?: WeddingStory;
//   error?: string;
// }> {
//   try {
//     const { data } = await api.post(
//       "/wedding-stories",
//       payload
//     );

//     return {
//       ok: true,
//       data: data.data,
//     };
//   } catch (error) {
//     return {
//       ok: false,
//       error: getErrorMessage(
//         error,
//         "Unable to create wedding story."
//       ),
//     };
//   }
// }

// /* ============================================
//    UPDATE STORY
// ============================================ */

// export async function updateWeddingStoryApi(
//   id: string,
//   payload: UpdateWeddingStoryDto
// ): Promise<{
//   ok: boolean;
//   data?: WeddingStory;
//   error?: string;
// }> {
//   try {
//     const { data } = await api.patch(
//       `/wedding-stories/${id}`,
//       payload
//     );

//     return {
//       ok: true,
//       data: data.data,
//     };
//   } catch (error) {
//     return {
//       ok: false,
//       error: getErrorMessage(
//         error,
//         "Unable to update wedding story."
//       ),
//     };
//   }
// }

// /* ============================================
//    DELETE STORY
// ============================================ */

// export async function deleteWeddingStoryApi(
//   id: string
// ): Promise<{
//   ok: boolean;
//   error?: string;
// }> {
//   try {
//     await api.delete(
//       `/wedding-stories/${id}`
//     );

//     return {
//       ok: true,
//     };
//   } catch (error) {
//     return {
//       ok: false,
//       error: getErrorMessage(
//         error,
//         "Unable to delete wedding story."
//       ),
//     };
//   }
// }

// /* ============================================
//    FEATURED
// ============================================ */

// export async function toggleFeaturedApi(
//   id: string
// ): Promise<{
//   ok: boolean;
//   data?: WeddingStory;
//   error?: string;
// }> {
//   try {
//     const { data } = await api.patch(
//       `/wedding-stories/${id}/toggle-featured`
//     );

//     return {
//       ok: true,
//       data: data.data,
//     };
//   } catch (error) {
//     return {
//       ok: false,
//       error: getErrorMessage(
//         error,
//         "Unable to update featured status."
//       ),
//     };
//   }
// }


// export const getHomeWeddingStoriesApi = async () => {
//   const { data } = await api.get("/wedding-stories/home");
//   return data;
// };

// export const getWeddingStoryBySlugApi = async (
//   slug: string
// ) => {
//   const { data } = await api.get(
//     `/wedding-stories/slug/${slug}`
//   );

//   return data;
// };

// /* ============================================
//    PUBLISHED
// ============================================ */

// export async function togglePublishedApi(
//   id: string
// ): Promise<{
//   ok: boolean;
//   data?: WeddingStory;
//   error?: string;
// }> {
//   try {
//     const { data } = await api.patch(
//       `/wedding-stories/${id}/toggle-published`
//     );

//     return {
//       ok: true,
//       data: data.data,
//     };
//   } catch (error) {
//     return {
//       ok: false,
//       error: getErrorMessage(
//         error,
//         "Unable to update publish status."
//       ),
//     };
//   }


  
// }

import api from "@/lib/axios";
import { AxiosError } from "axios";

import {
  WeddingStory,
  CreateWeddingStoryDto,
  UpdateWeddingStoryDto,
} from "@/types/wedding-story";

type ApiErrorResponse = {
  message?: string;
};

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | ApiErrorResponse
      | undefined;

    return data?.message ?? fallback;
  }

  return fallback;
}

/* ============================================
   GET ALL STORIES
============================================ */

export async function getWeddingStoriesApi(): Promise<{
  ok: boolean;
  data?: WeddingStory[];
  error?: string;
}> {
  try {
    const { data } = await api.get(
      "/wedding-stories"
    );

    return {
      ok: true,
      data: data.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load wedding stories."
      ),
    };
  }
}

/* ============================================
   GET HOME STORIES
============================================ */

export async function getHomeWeddingStoriesApi(): Promise<{
  ok: boolean;
  data?: WeddingStory[];
  error?: string;
}> {
  try {
    const { data } = await api.get(
      "/wedding-stories/home"
    );

    return {
      ok: true,
      data: data.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load home wedding stories."
      ),
    };
  }
}

/* ============================================
   GET STORY
============================================ */

export async function getWeddingStoryApi(
  id: string
): Promise<{
  ok: boolean;
  data?: WeddingStory;
  error?: string;
}> {
  try {
    const { data } = await api.get(
      `/wedding-stories/${id}`
    );

    return {
      ok: true,
      data: data.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load wedding story."
      ),
    };
  }
}

/* ============================================
   GET STORY BY SLUG
============================================ */

export async function getWeddingStoryBySlugApi(
  slug: string
): Promise<{
  ok: boolean;
  data?: WeddingStory;
  error?: string;
}> {
  try {
    const { data } = await api.get(
      `/wedding-stories/slug/${slug}`
    );

    return {
      ok: true,
      data: data.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load wedding story."
      ),
    };
  }
}

/* ============================================
   CREATE STORY
============================================ */

export async function createWeddingStoryApi(
  payload: CreateWeddingStoryDto
): Promise<{
  ok: boolean;
  data?: WeddingStory;
  error?: string;
}> {
  try {
    const { data } = await api.post(
      "/wedding-stories",
      payload
    );

    return {
      ok: true,
      data: data.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to create wedding story."
      ),
    };
  }
}

/* ============================================
   UPDATE STORY
============================================ */

export async function updateWeddingStoryApi(
  id: string,
  payload: UpdateWeddingStoryDto
): Promise<{
  ok: boolean;
  data?: WeddingStory;
  error?: string;
}> {
  try {
    const { data } = await api.patch(
      `/wedding-stories/${id}`,
      payload
    );

    return {
      ok: true,
      data: data.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to update wedding story."
      ),
    };
  }
}

/* ============================================
   DELETE STORY
============================================ */

export async function deleteWeddingStoryApi(
  id: string
): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    await api.delete(
      `/wedding-stories/${id}`
    );

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to delete wedding story."
      ),
    };
  }
}

/* ============================================
   FEATURED
============================================ */

export async function toggleFeaturedApi(
  id: string
): Promise<{
  ok: boolean;
  data?: WeddingStory;
  error?: string;
}> {
  try {
    const { data } = await api.patch(
      `/wedding-stories/${id}/toggle-featured`
    );

    return {
      ok: true,
      data: data.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to update featured status."
      ),
    };
  }
}

/* ============================================
   PUBLISHED
============================================ */

export async function togglePublishedApi(
  id: string
): Promise<{
  ok: boolean;
  data?: WeddingStory;
  error?: string;
}> {
  try {
    const { data } = await api.patch(
      `/wedding-stories/${id}/toggle-published`
    );

    return {
      ok: true,
      data: data.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to update publish status."
      ),
    };
  }
}
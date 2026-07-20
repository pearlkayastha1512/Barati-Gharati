// "use client";

// import { useEffect, useState } from "react";


// import { toast } from "sonner";
// import {
//   Heart,
//   Camera,
//   Sparkles,
//   Flower2,
// } from "lucide-react";

// import { uploadToCloudinary } from "@/lib/cloudinary";
// import Link from "next/link";
// import { ArrowLeft, Trash2 } from "lucide-react";

// import {
//   getMyWeddingWebsite,
//   updateWeddingWebsite,
// } from "@/services/api/wedding-website.api";

// export default function WeddingGalleryManager() {
//   const [images, setImages] = useState<string[]>([]);

//   const [uploading, setUploading] = useState(false);

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchGallery = async () => {
//       try {
//         const website =
//           await getMyWeddingWebsite();

//         setImages(
//           website.galleryImages ?? [],
//         );
//       } catch (error) {
//         console.error(error);

//         toast.error(
//           "Failed to load gallery",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGallery();
//   }, []);

//   const handleUpload = async (
//     e: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const files = e.target.files;

//     if (!files?.length) return;
//      if (images.length + files.length > 20) {
//     toast.error(
//       `You can upload a maximum of 20 photos. You currently have ${images.length} photo(s).`,
//     );

//     e.target.value = "";

//     return;
//   }

//     setUploading(true);

//     try {
//       const uploadedUrls =
//         await Promise.all(
//           Array.from(files).map((file) =>
//             uploadToCloudinary(file),
//           ),
//         );

//       const updated = [
//         ...images,
//         ...uploadedUrls,
//       ];

//       setImages(updated);

//       await updateWeddingWebsite({
//         galleryImages: updated,
//       });

//       toast.success(
//         "Gallery updated successfully",
//       );
//     } catch (error: any) {
//   console.log(
//     "Backend error:",
//     error.response?.data,
//   );

//   toast.error(
//     error.response?.data?.message ||
//       "Failed to upload images",
//   );
// } finally {
//       setUploading(false);

//       e.target.value = "";
//     }
//   };

//   const removeImage = async (
//     index: number,
//   ) => {
//     try {
//       const updated = images.filter(
//         (_, i) => i !== index,
//       );

//       setImages(updated);

//       await updateWeddingWebsite({
//         galleryImages: updated,
//       });

//       toast.success(
//         "Photo deleted successfully",
//       );
//     } catch (error: any) {
//   console.log(
//     "Delete error:",
//     error.response?.data,
//   );

//   toast.error(
//     error.response?.data?.message ||
//       "Failed to delete image",
//   );
// }
//   };

//   if (loading) {
//     return (
//       <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
//         Loading gallery...
//       </div>
//     );
//   }

//  return (
//   <div className="relative min-h-screen overflow-hidden bg-[#fffaf7] px-6 py-16">
//     {/* Background decorations */}

//     <div className="absolute left-[-120px] top-[-120px] h-96 w-96 rounded-full bg-rose-200/30 blur-3xl" />

//     <div className="absolute bottom-[-160px] right-[-160px] h-[32rem] w-[32rem] rounded-full bg-pink-200/30 blur-3xl" />

//     <div className="absolute left-1/2 top-24 -translate-x-1/2 text-rose-100">
//       <span className="text-[220px]">💖</span>
//     </div>

//     <div className="relative mx-auto max-w-7xl">
//       {/* Top bar */}

//       <div className="mb-12 flex items-center justify-between">
//         <Link
//           href="/website"
//           className="group inline-flex items-center gap-4 rounded-2xl border border-white/60 bg-white/80 px-6 py-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1"
//         >
//           <div className="rounded-xl bg-rose-50 p-3 transition group-hover:bg-rose-100">
//             <ArrowLeft
//               size={18}
//               className="text-rose-600"
//             />
//           </div>

//           <div>
//             <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
//               Back
//             </p>

//             <h3 className="font-medium text-slate-900">
//               Wedding Website
//             </h3>
//           </div>
//         </Link>

//         <div className="hidden text-right md:block">
//           <p className="text-xs uppercase tracking-[0.4em] text-rose-500">
//             Memories
//           </p>

//           <h2 className="mt-2 font-serif text-4xl text-slate-900">
//             Wedding Gallery
//           </h2>
//         </div>
//       </div>

//       {/* Hero section */}

//       <div className="relative overflow-hidden rounded-[40px] border border-white/50 bg-white/70 p-10 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-14">
//         <div className="absolute right-8 top-8 text-rose-300">
//           ✨
//         </div>

//         <div className="text-center">
//           <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-rose-50 text-5xl shadow-lg">
//             📸
//           </div>

//           <p className="mt-6 text-xs uppercase tracking-[0.6em] text-rose-500">
//             Forever Captured
//           </p>

//           <h1 className="mt-4 font-serif text-5xl text-slate-900 md:text-6xl">
//             Upload Wedding Memories
//           </h1>

//           <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-slate-600">
//             Collect the laughter, the smiles,
//             and the magical moments of your
//             special day in one beautiful place.
//           </p>

//           <div className="mt-10 flex flex-wrap justify-center gap-4">
//             <div className="rounded-full bg-rose-50 px-5 py-3 shadow-md">
//               💍 Wedding
//             </div>

//             <div className="rounded-full bg-pink-50 px-5 py-3 shadow-md">
//               ❤️ Love Story
//             </div>

//             <div className="rounded-full bg-amber-50 px-5 py-3 shadow-md">
//               📸 Memories
//             </div>
//           </div>

//           <label className="mt-12 inline-flex cursor-pointer items-center gap-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-10 py-5 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105">
//             {uploading
//               ? "Uploading..."
//               : "Choose Photos"}

//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               disabled={uploading}
//               onChange={handleUpload}
//               className="hidden"
//             />
//           </label>

//           <p className="mt-4 text-sm text-slate-500">
//             {images.length}/20 memories added
//           </p>
//         </div>
//       </div>

//       {/* Gallery */}

//       <div className="mt-16">
//         {images.length ? (
//           <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {images.map((image, index) => (
//               <div
//                 key={`${image}-${index}`}
//                 className="group overflow-hidden rounded-[32px] bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
//               >
//                 <div className="relative overflow-hidden rounded-[24px]">
//                   <img
//                     src={image}
//                     alt={`Wedding photo ${
//                       index + 1
//                     }`}
//                     className="h-80 w-full object-cover transition duration-700 group-hover:scale-110"
//                   />

//                   <button
//                     onClick={() =>
//                       removeImage(index)
//                     }
//                     className="absolute right-4 top-4 rounded-full bg-red-500 p-3 text-white opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>

//                 <div className="mt-5 text-center">
//                   <p className="text-xs uppercase tracking-[0.35em] text-rose-400">
//                     Cherished Moment
//                   </p>

//                   <h3 className="mt-2 font-serif text-2xl text-slate-900">
//                     Memory #{index + 1}
//                   </h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="mt-16 rounded-[40px] border border-dashed border-rose-200 bg-white/80 p-20 text-center shadow-xl backdrop-blur-xl">
//             <div className="text-7xl">
//               💕
//             </div>

//             <h2 className="mt-8 font-serif text-5xl text-slate-900">
//               No Memories Yet
//             </h2>

//             <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
//               Start adding your wedding photos
//               and create a beautiful collection
//               of unforgettable moments.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Trash2,
  Heart,
  Camera,
  Sparkles,
  Flower2,
} from "lucide-react";

import { toast } from "sonner";

import { uploadToCloudinary } from "@/lib/cloudinary";

import {
  getMyWeddingWebsite,
  updateWeddingWebsite,
} from "@/services/api/wedding-website.api";

export default function WeddingGalleryManager() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const website =
          await getMyWeddingWebsite();

        setImages(
          website.galleryImages ?? [],
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load gallery",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;

    if (!files?.length) return;

    if (
      images.length + files.length >
      20
    ) {
      toast.error(
        `You can upload a maximum of 20 photos. You currently have ${images.length} photo(s).`,
      );

      e.target.value = "";

      return;
    }

    setUploading(true);

    try {
      const uploadedUrls =
        await Promise.all(
          Array.from(files).map(
            (file) =>
              uploadToCloudinary(
                file,
              ),
          ),
        );

      const updated = [
        ...images,
        ...uploadedUrls,
      ];

      setImages(updated);

      await updateWeddingWebsite({
        galleryImages: updated,
      });

      toast.success(
        "Gallery updated successfully",
      );
    } catch (error: any) {
      console.log(
        "Backend error:",
        error.response?.data,
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to upload images",
      );
    } finally {
      setUploading(false);

      e.target.value = "";
    }
  };

  const removeImage = async (
    index: number,
  ) => {
    try {
      const updated =
        images.filter(
          (_, i) => i !== index,
        );

      setImages(updated);

      await updateWeddingWebsite({
        galleryImages: updated,
      });

      toast.success(
        "Photo deleted successfully",
      );
    } catch (error: any) {
      console.log(
        "Delete error:",
        error.response?.data,
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to delete image",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf7]">
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl">
            <Heart className="h-10 w-10 animate-pulse text-rose-500" />
          </div>

          <h2 className="mt-6 font-serif text-3xl text-slate-900">
            Loading Memories...
          </h2>

          <p className="mt-2 text-slate-500">
            Preparing your wedding
            gallery.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffaf7] px-6 py-16">
      {/* Background */}

      <div className="absolute left-[-120px] top-[-120px] h-96 w-96 rounded-full bg-rose-200/30 blur-3xl" />

      <div className="absolute bottom-[-160px] right-[-160px] h-[32rem] w-[32rem] rounded-full bg-pink-200/30 blur-3xl" />

      <div className="absolute left-1/2 top-24 -translate-x-1/2 text-rose-100">
        <span className="text-[220px]">
          💖
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}

        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/website"
            className="group inline-flex items-center gap-4 rounded-2xl border border-white/60 bg-white/80 px-6 py-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="rounded-xl bg-rose-50 p-3 transition group-hover:bg-rose-100">
              <ArrowLeft
                size={18}
                className="text-rose-600"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Back
              </p>

              <h3 className="font-medium text-slate-900">
                Wedding Website
              </h3>
            </div>
          </Link>

          <div className="hidden text-right md:block">
            <p className="text-xs uppercase tracking-[0.4em] text-rose-500">
              Memories
            </p>

            <h2 className="mt-2 font-serif text-4xl text-slate-900">
              Wedding Gallery
            </h2>
          </div>
        </div>

        {/* Hero */}

        <div className="relative overflow-hidden rounded-[40px] border border-white/50 bg-white/70 p-10 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-14">
          <div className="absolute right-8 top-8 text-rose-300">
            <Sparkles size={34} />
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-pink-100 shadow-xl">
              <Camera className="h-10 w-10 text-rose-600" />
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 text-rose-500">
              <Flower2 size={18} />

              <p className="text-xs uppercase tracking-[0.6em]">
                Forever Captured
              </p>

              <Flower2 size={18} />
            </div>

            <h1 className="mt-4 font-serif text-5xl text-slate-900 md:text-6xl">
              Upload Wedding Memories
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-slate-600">
              Collect the laughter,
              smiles, and magical
              moments of your special
              day in one beautiful
              place.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-rose-50 px-5 py-3 shadow-md">
                <Heart className="h-4 w-4 text-rose-500" />

                <span className="text-gray-600">Love Story</span>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-pink-50 px-5 py-3 shadow-md">
                <Camera className="h-4 w-4 text-pink-500" />

                <span className="text-gray-600">Memories</span>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-amber-50 px-5 py-3 shadow-md">
                <Sparkles className="h-4 w-4 text-amber-500" />

                <span className="text-gray-600">Celebration</span>
              </div>
            </div>

            <label className="mt-12 inline-flex cursor-pointer items-center gap-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-10 py-5 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105">
              {uploading
                ? "Uploading..."
                : "Choose Photos"}

              <input
                type="file"
                multiple
                accept="image/*"
                disabled={uploading}
                onChange={
                  handleUpload
                }
                className="hidden"
              />
            </label>

            <p className="mt-4 text-sm text-slate-500">
              {images.length}/20
              memories added
            </p>
          </div>
        </div>

        {/* Gallery */}

        <div className="mt-16">
          {images.length ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map(
                (
                  image,
                  index,
                ) => (
                  <div
                    key={`${image}-${index}`}
                    className="group overflow-hidden rounded-[32px] bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="relative overflow-hidden rounded-[24px]">
                      <img
                        src={image}
                        alt={`Wedding photo ${
                          index + 1
                        }`}
                        className="h-80 w-full object-cover transition duration-700 group-hover:scale-110"
                      />

                      <button
                        onClick={() =>
                          removeImage(
                            index,
                          )
                        }
                        className="absolute right-4 top-4 rounded-full bg-red-500 p-3 text-white opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100"
                      >
                        <Trash2
                          size={18}
                        />
                      </button>
                    </div>

                    <div className="mt-5 text-center">
                      <p className="text-xs uppercase tracking-[0.35em] text-rose-400">
                        Cherished
                        Moment
                      </p>

                      <h3 className="mt-2 font-serif text-2xl text-slate-900">
                        Memory #
                        {index + 1}
                      </h3>
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="mt-16 rounded-[40px] border border-dashed border-rose-200 bg-white/80 p-20 text-center shadow-xl backdrop-blur-xl">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-rose-50 shadow-lg">
                <Heart className="h-12 w-12 text-rose-500" />
              </div>

              <h2 className="mt-8 font-serif text-5xl text-slate-900">
                No Memories Yet
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
                Start adding your
                wedding photos and
                create a beautiful
                collection of
                unforgettable moments.
              </p>

              <div className="mx-auto mt-10 flex justify-center gap-4 text-4xl">
                🌹 ✨ 💍 ✨ 🌹
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
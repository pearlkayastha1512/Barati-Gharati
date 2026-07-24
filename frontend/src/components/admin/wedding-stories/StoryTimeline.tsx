// "use client";

// import { Plus, Trash2, CalendarDays } from "lucide-react";

// import { WeddingStoryTimeline } from "@/types/wedding-story";

// interface Props {
//   timeline: WeddingStoryTimeline[];
//   onChange: (timeline: WeddingStoryTimeline[]) => void;
// }

// export default function StoryTimeline({
//   timeline,
//   onChange,
// }: Props) {
//   const addEvent = () => {
//     onChange([
//       ...timeline,
//       {
//         title: "",
//         description: "",
//         sortOrder: timeline.length,
//       },
//     ]);
//   };

//   const updateEvent = (
//     index: number,
//     key: keyof WeddingStoryTimeline,
//     value: string | number
//   ) => {
//     const updated = [...timeline];

//     updated[index] = {
//       ...updated[index],
//       [key]: value,
//     };

//     onChange(updated);
//   };

//   const removeEvent = (index: number) => {
//     const updated = timeline
//       .filter((_, i) => i !== index)
//       .map((item, idx) => ({
//         ...item,
//         sortOrder: idx,
//       }));

//     onChange(updated);
//   };

//   return (
//     <div className="rounded-3xl border border-[#ffd7df] bg-white p-8 shadow-sm">
//       <div className="mb-8 flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-[#5b2333]">
//             Wedding Timeline
//           </h2>

//           <p className="mt-1 text-sm text-[#8d6171]">
//             Add all wedding events in chronological order.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={addEvent}
//           className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] px-5 py-3 font-medium text-white shadow transition hover:scale-105"
//         >
//           <Plus size={18} />
//           Add Event
//         </button>
//       </div>

//       {!timeline.length && (
//         <div className="rounded-2xl border-2 border-dashed border-pink-200 py-16 text-center">
//           <CalendarDays
//             size={46}
//             className="mx-auto mb-4 text-pink-400"
//           />

//           <p className="text-lg font-medium text-[#8d6171]">
//             No events added yet
//           </p>

//           <p className="mt-2 text-sm text-gray-500">
//             Add events like Engagement, Mehendi, Haldi, Wedding and Reception.
//           </p>
//         </div>
//       )}

//       <div className="space-y-6">
//         {timeline.map((event, index) => (
//           <div
//             key={index}
//             className="rounded-2xl border border-pink-100 bg-pink-50/30 p-6"
//           >
//             <div className="mb-5 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] font-semibold text-white">
//                   {index + 1}
//                 </div>

//                 <h3 className="text-lg font-semibold text-[#5b2333]">
//                   Event {index + 1}
//                 </h3>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => removeEvent(index)}
//                 className="rounded-xl bg-red-50 p-3 text-red-500 transition hover:bg-red-100"
//               >
//                 <Trash2 size={18} />
//               </button>
//             </div>

//             <div className="space-y-5">
//               <div>
//                 <label className="mb-2 block font-medium">
//                   Event Title
//                 </label>

//                 <input
//                   value={event.title}
//                   onChange={(e) =>
//                     updateEvent(
//                       index,
//                       "title",
//                       e.target.value
//                     )
//                   }
//                   placeholder="Mehendi Ceremony"
//                   className="w-full rounded-xl border border-[#ffd7df] p-3 outline-none transition focus:border-[#ff4d6d]"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block font-medium">
//                   Description
//                 </label>

//                 <textarea
//                   rows={4}
//                   value={event.description}
//                   onChange={(e) =>
//                     updateEvent(
//                       index,
//                       "description",
//                       e.target.value
//                     )
//                   }
//                   placeholder="Describe this event..."
//                   className="w-full rounded-xl border border-[#ffd7df] p-3 outline-none transition focus:border-[#ff4d6d]"
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { Plus, Trash2, CalendarDays } from "lucide-react";

import { WeddingStoryTimeline } from "@/types/wedding-story";

interface Props {
  timeline: WeddingStoryTimeline[];
  onChange: (timeline: WeddingStoryTimeline[]) => void;
}

export default function StoryTimeline({
  timeline,
  onChange,
}: Props) {
  const addEvent = () => {
    onChange([
      ...timeline,
      {
        title: "",
        description: "",
        sortOrder: timeline.length,
      },
    ]);
  };

  const updateEvent = (
    index: number,
    key: keyof WeddingStoryTimeline,
    value: string | number
  ) => {
    const updated = [...timeline];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    onChange(updated);
  };

  const removeEvent = (index: number) => {
    const updated = timeline
      .filter((_, i) => i !== index)
      .map((item, idx) => ({
        ...item,
        sortOrder: idx,
      }));

    onChange(updated);
  };

  return (
    <div className="rounded-3xl border border-[#ffd7df] bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#5b2333]">
            Wedding Timeline
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add your wedding events in order.
          </p>
        </div>

        <button
          type="button"
          onClick={addEvent}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] px-5 py-3 font-medium text-white shadow transition hover:scale-105"
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {!timeline.length && (
        <div className="rounded-2xl border-2 border-dashed border-pink-200 py-16 text-center">
          <CalendarDays
            size={46}
            className="mx-auto mb-4 text-pink-400"
          />

          <p className="text-lg font-medium text-gray-600">
            No events added yet
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Add events like Engagement, Mehendi,
            Haldi, Wedding and Reception.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {timeline.map((event, index) => (
          <div
            key={index}
            className="rounded-2xl border border-pink-100 bg-pink-50/30 p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] font-semibold text-white">
                  {index + 1}
                </div>

                <h3 className="text-lg font-semibold text-gray-700">
                  Event {index + 1}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => removeEvent(index)}
                className="rounded-xl bg-red-50 p-3 text-red-500 transition hover:bg-red-100"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block font-medium text-gray-600">
                  Event Title
                </label>

                <input
                  value={event.title}
                  onChange={(e) =>
                    updateEvent(
                      index,
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="Mehendi Ceremony"
                  className="w-full rounded-xl border border-[#ffd7df] p-3 text-gray-700 placeholder:text-gray-400 outline-none transition focus:border-[#ff4d6d]"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-600">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={event.description}
                  onChange={(e) =>
                    updateEvent(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Describe this event..."
                  className="w-full rounded-xl border border-[#ffd7df] p-3 text-gray-700 placeholder:text-gray-400 outline-none transition focus:border-[#ff4d6d]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
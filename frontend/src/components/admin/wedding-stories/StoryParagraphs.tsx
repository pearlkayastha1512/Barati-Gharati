// "use client";

// import { Plus, Trash2 } from "lucide-react";

// interface Props {
//   paragraphs: string[];
//   onChange: (paragraphs: string[]) => void;
// }

// export default function StoryParagraphs({
//   paragraphs,
//   onChange,
// }: Props) {
//   const updateParagraph = (
//     index: number,
//     value: string
//   ) => {
//     const updated = [...paragraphs];

//     updated[index] = value;

//     onChange(updated);
//   };

//   const addParagraph = () => {
//     onChange([...paragraphs, ""]);
//   };

//   const removeParagraph = (
//     index: number
//   ) => {
//     if (paragraphs.length === 1) return;

//     const updated = paragraphs.filter(
//       (_, i) => i !== index
//     );

//     onChange(updated);
//   };

//   return (
//     <div className="rounded-3xl border border-[#ffd7df] bg-white p-8 shadow-sm">
//       <div className="mb-6 flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-[#5b2333]">
//             Story
//           </h2>

//           <p className="mt-1 text-sm text-[#8d6171]">
//             Write the wedding story in multiple
//             paragraphs.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={addParagraph}
//           className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] px-4 py-2 font-medium text-white"
//         >
//           <Plus size={18} />

//           Add Paragraph
//         </button>
//       </div>

//       <div className="space-y-6">
//         {paragraphs.map(
//           (paragraph, index) => (
//             <div
//               key={index}
//               className="rounded-2xl border border-[#ffe0e7] p-5"
//             >
//               <div className="mb-3 flex items-center justify-between">
//                 <h3 className="font-semibold text-[#5b2333]">
//                   Paragraph {index + 1}
//                 </h3>

//                 {paragraphs.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() =>
//                       removeParagraph(index)
//                     }
//                     className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 )}
//               </div>

//               <textarea
//                 rows={6}
//                 value={paragraph}
//                 onChange={(e) =>
//                   updateParagraph(
//                     index,
//                     e.target.value
//                   )
//                 }
//                 placeholder="Write wedding story..."
//                 className="w-full rounded-xl border border-[#ffd7df] p-4 outline-none transition focus:border-[#ff4d6d]"
//               />
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { Plus, Trash2 } from "lucide-react";

interface Props {
  paragraphs: string[];
  onChange: (paragraphs: string[]) => void;
}

export default function StoryParagraphs({
  paragraphs,
  onChange,
}: Props) {
  const updateParagraph = (
    index: number,
    value: string
  ) => {
    const updated = [...paragraphs];

    updated[index] = value;

    onChange(updated);
  };

  const addParagraph = () => {
    onChange([...paragraphs, ""]);
  };

  const removeParagraph = (
    index: number
  ) => {
    if (paragraphs.length === 1) return;

    const updated = paragraphs.filter(
      (_, i) => i !== index
    );

    onChange(updated);
  };

  return (
    <div className="rounded-3xl border border-[#ffd7df] bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#5b2333]">
            Story
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Write the wedding story in multiple
            paragraphs.
          </p>
        </div>

        <button
          type="button"
          onClick={addParagraph}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] px-4 py-2 font-medium text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Add Paragraph
        </button>
      </div>

      <div className="space-y-6">
        {paragraphs.map(
          (paragraph, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#ffe0e7] p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">
                  Paragraph {index + 1}
                </h3>

                {paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeParagraph(index)
                    }
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <textarea
                rows={6}
                value={paragraph}
                onChange={(e) =>
                  updateParagraph(
                    index,
                    e.target.value
                  )
                }
                placeholder="Write wedding story..."
                className="w-full rounded-xl border border-[#ffd7df] p-4 text-gray-700 placeholder:text-gray-400 outline-none transition focus:border-[#ff4d6d]"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
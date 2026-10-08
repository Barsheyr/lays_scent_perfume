// "use client";
// import React from "react";
// import Title from "./Title";
// import Link from "next/link";
// import { useSelector } from "react-redux";
// import Image from "next/image";
// import { genderImages } from "@/assets/assets";

// const Gender = () => {
//   const products = useSelector((state) => state.product.list);

//   // Get unique gender names from all products
//   const genders = [...new Set(products.map((p) => p.gender))];

//   return (
//     <div className="max-w-6xl mx-auto px-10 py-10">
//       <Title title="Male and female section" href="/shop" />

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-10 gap-10">
//         {genders.map((gender) => {
//           // Get the category image
//           const genderImage = genderImages[gender];

//           // Fallback to first product image if no category image exists
//           const fallbackImage = !genderImage
//             ? products.find((p) => p.gender === gender)?.images?.[0]
//             : null;

//           return (
//             <Link
//               key={gender}
//               href={`/gender/${encodeURIComponent(gender)}`}
//               className="p-6 text-center transition group rounded-lg bg-gray-100"
//             >
//               {(genderImage || fallbackImage) && (
//                 <div className="flex justify-center items-center mb-4">
//                   <Image
//                     src={genderImage || fallbackImage}
//                     alt={`${gender} watches`}
//                     width={500}
//                     height={500}
//                     className="group-hover:scale-105 transition-transform h-80"
//                   />
//                 </div>
//               )}
//               <p className="text-lg font-medium text-slate-700 capitalize">
//                 {gender}
//               </p>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Gender;

"use client";
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import Image from "next/image";
import { genderImages } from "@/assets/assets";

const Gender = () => {
  const products = useSelector((state) => state.product.list);
  const genders = [...new Set(products.map((p) => p.gender))];

  return (
    <section className="bg-[#0e0a0b] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-3">
            Find your signature
          </p>
          <h2 className="text-4xl md:text-5xl font-medium text-white leading-tight">
            For her, for him,{" "}
            <span className="font-serif italic text-[#c97b63]">
              for everyone in between
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {genders.map((gender) => {
            const genderImage = genderImages[gender];
            const fallbackImage = !genderImage
              ? products.find((p) => p.gender === gender)?.images?.[0]
              : null;

            return (
              <Link
                key={gender}
                href={`/gender/${encodeURIComponent(gender)}`}
                className="group relative block h-96 rounded-2xl overflow-hidden border border-white/8"
              >
                {(genderImage || fallbackImage) && (
                  <Image
                    src={genderImage || fallbackImage}
                    alt={`${gender} fragrances`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a0b] via-[#0e0a0b]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-2xl font-serif italic text-white capitalize mb-1">
                    {gender}
                  </p>
                  <span className="text-sm text-[#c97b63] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop now →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-block px-8 py-3 border border-white/15 hover:border-[#c97b63]/50 text-white/70 hover:text-white text-sm rounded-full transition-colors"
          >
            View all fragrances
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Gender;

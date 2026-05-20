// "use client";
// import { ArrowRight } from "lucide-react";
// import { useState, useEffect } from "react";
// import CategoriesMarquee from "./CategoriesMarquee";

// const sliders = [
//   {
//     img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1400&q=80&fm=jpg&fit=crop&crop=center",
//     badge: "Eau de Parfum",
//     eyebrow: "New arrival",
//     title: "Wear the scent\nof her story.",
//     description:
//       "A warm floral blend of rose, oud, and vanilla — made for the woman who leaves a room smelling like a memory.",
//     notes: ["Rose", "Oud", "Vanilla", "Musk"],
//     btntext: "Shop now",
//     meta: [
//       { label: "For her", val: "Bloom Rose" },
//       { label: "Rating", val: "4.9 / 5.0" },
//     ],
//   },
//   {
//     img: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=1400&q=80&fm=jpg&fit=crop&crop=center",
//     badge: "Unisex collection",
//     eyebrow: "Bestseller",
//     title: "Bold. Timeless.\nUnforgettable.",
//     description:
//       "A unisex masterpiece of smoky cedar, bergamot, and white pepper — for those who refuse to go unnoticed.",
//     notes: ["Cedar", "Bergamot", "White pepper"],
//     btntext: "Shop now",
//     meta: [
//       { label: "Gender", val: "Unisex" },
//       { label: "Longevity", val: "12+ hours" },
//     ],
//   },
//   {
//     img: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1400&q=80&fm=jpg&fit=crop&crop=center",
//     badge: "Exclusive edition",
//     eyebrow: "For him",
//     title: "His signature,\nredefined.",
//     description:
//       "Sharp, masculine, sophisticated. A fusion of dark amber, leather, and sea salt that commands every room.",
//     notes: ["Amber", "Leather", "Sea salt"],
//     btntext: "Shop now",
//     meta: [
//       { label: "For him", val: "Noir Edition" },
//       { label: "Sillage", val: "Heavy" },
//     ],
//   },
// ];

// export default function Hero() {
//   const [cur, setCur] = useState(0);

//   useEffect(() => {
//     const t = setInterval(() => setCur((p) => (p + 1) % sliders.length), 3500);
//     return () => clearInterval(t);
//   }, []);

//   const slide = sliders[cur];

//   return (
//     <div>
//       <div
//         className="relative overflow-hidden bg-[#0e0a0b]"
//         style={{ minHeight: "100vh" }}
//       >
//         {/* Background image */}
//         <img
//           key={cur}
//           src={slide.img}
//           alt={slide.title}
//           className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-1000"
//         />
//         <div className="absolute inset-0 bg-[#0e0a0b]/50" />

//         {/* Slide counter */}
//         <p className="absolute top-7 right-12 z-20 text-xs tracking-widest text-white/30">
//           {String(cur + 1).padStart(2, "0")} /{" "}
//           {String(sliders.length).padStart(2, "0")}
//         </p>

//         {/* Main content */}
//         <div className="relative z-20 flex items-end h-screen pb-16 px-12">
//           <div className="max-w-lg">
//             <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-3">
//               {slide.eyebrow}
//             </p>
//             <span className="inline-block text-[10px] tracking-[2px] uppercase px-3 py-1 rounded-full bg-[#c97b63]/15 text-[#c97b63] border border-[#c97b63]/30 mb-4">
//               {slide.badge}
//             </span>
//             <h1 className="text-5xl font-serif italic text-white leading-tight mb-3 whitespace-pre-line">
//               {slide.title}
//             </h1>
//             <p className="text-sm text-white/50 leading-relaxed mb-5">
//               {slide.description}
//             </p>

//             {/* Scent notes */}
//             <div className="flex gap-2 flex-wrap mb-6">
//               {slide.notes.map((n) => (
//                 <span
//                   key={n}
//                   className="text-[11px] px-3 py-1 rounded-full border border-white/15 text-white/40"
//                 >
//                   {n}
//                 </span>
//               ))}
//             </div>

//             <div className="flex gap-3">
//               <button className="flex items-center gap-2 bg-[#c97b63] text-white rounded-full px-6 py-3 text-sm">
//                 {slide.btntext} <ArrowRight size={15} />
//               </button>
//               <button className="text-white/60 border border-white/20 rounded-full px-5 py-3 text-sm">
//                 Explore all
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mini info cards */}
//         <div className="absolute bottom-16 right-12 z-20 flex flex-col gap-3">
//           {slide.meta.map((m) => (
//             <div
//               key={m.label}
//               className="bg-white/6 border border-white/10 rounded-xl px-4 py-3 min-w-[160px]"
//             >
//               <p className="text-[11px] text-white/40 mb-1">{m.label}</p>
//               <p className="text-sm text-white font-medium">{m.val}</p>
//             </div>
//           ))}
//         </div>

//         {/* Dots */}
//         <div className="absolute bottom-6 left-12 z-20 flex gap-2">
//           {sliders.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCur(i)}
//               className={`h-[3px] rounded-full transition-all duration-300 ${
//                 i === cur ? "w-8 bg-[#c97b63]" : "w-5 bg-white/25"
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       <CategoriesMarquee />
//     </div>
//   );
// }

"use client";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import CategoriesMarquee from "./CategoriesMarquee";

const sliders = [
  {
    img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1400&q=80&fm=jpg&fit=crop&crop=center",
    badge: "Eau de Parfum",
    eyebrow: "New arrival",
    title: "Wear the scent\nof her story.",
    description:
      "A warm floral blend of rose, oud, and vanilla — made for the woman who leaves a room smelling like a memory.",
    notes: ["Rose", "Oud", "Vanilla", "Musk"],
    btntext: "Shop now",
    meta: [
      { label: "For her", val: "Bloom Rose" },
      { label: "Rating", val: "4.9 / 5.0" },
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=1400&q=80&fm=jpg&fit=crop&crop=center",
    badge: "Unisex collection",
    eyebrow: "Bestseller",
    title: "Bold. Timeless.\nUnforgettable.",
    description:
      "A unisex masterpiece of smoky cedar, bergamot, and white pepper — for those who refuse to go unnoticed.",
    notes: ["Cedar", "Bergamot", "White pepper"],
    btntext: "Shop now",
    meta: [
      { label: "Gender", val: "Unisex" },
      { label: "Longevity", val: "12+ hours" },
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1400&q=80&fm=jpg&fit=crop&crop=center",
    badge: "Exclusive edition",
    eyebrow: "For him",
    title: "His signature,\nredefined.",
    description:
      "Sharp, masculine, sophisticated. A fusion of dark amber, leather, and sea salt that commands every room.",
    notes: ["Amber", "Leather", "Sea salt"],
    btntext: "Shop now",
    meta: [
      { label: "For him", val: "Noir Edition" },
      { label: "Sillage", val: "Heavy" },
    ],
  },
];

export default function Hero() {
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCur((p) => (p + 1) % sliders.length), 3500);
    return () => clearInterval(t);
  }, []);

  const slide = sliders[cur];

  return (
    <div>
      <div
        className="relative overflow-hidden bg-[#0e0a0b]"
        style={{ minHeight: "100vh" }}
      >
        {/* Background image */}
        <img
          key={cur}
          src={slide.img}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-[#0e0a0b]/50" />

        {/* Slide counter */}
        <p className="absolute top-4 right-4 md:top-7 md:right-12 z-20 text-xs tracking-widest text-white/30">
          {String(cur + 1).padStart(2, "0")} /{" "}
          {String(sliders.length).padStart(2, "0")}
        </p>

        {/* Main content - stacked layout on mobile */}
        <div className="relative z-20 flex flex-col justify-end h-screen pb-32 sm:pb-28 md:pb-16 px-4 sm:px-6 md:px-12">
          <div className="max-w-lg w-full">
            <p className="text-[10px] md:text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-2 md:mb-3">
              {slide.eyebrow}
            </p>
            <span className="inline-block text-[9px] md:text-[10px] tracking-[2px] uppercase px-2 md:px-3 py-1 rounded-full bg-[#c97b63]/15 text-[#c97b63] border border-[#c97b63]/30 mb-3 md:mb-4">
              {slide.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-white leading-tight mb-2 md:mb-3 whitespace-pre-line">
              {slide.title}
            </h1>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed mb-4 md:mb-5 max-w-xs sm:max-w-sm md:max-w-none">
              {slide.description}
            </p>

            {/* Scent notes */}
            <div className="flex gap-2 flex-wrap mb-4 md:mb-6">
              {slide.notes.map((n) => (
                <span
                  key={n}
                  className="text-[10px] md:text-[11px] px-2 md:px-3 py-1 rounded-full border border-white/15 text-white/40"
                >
                  {n}
                </span>
              ))}
            </div>

            <div className="flex gap-2 md:gap-3">
              <button className="flex items-center gap-2 bg-[#c97b63] text-white rounded-full px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm">
                {slide.btntext}{" "}
                <ArrowRight size={14} className="md:w-[15px] md:h-[15px]" />
              </button>
              <button className="text-white/60 border border-white/20 rounded-full px-4 md:px-5 py-2.5 md:py-3 text-xs md:text-sm">
                Explore all
              </button>
            </div>
          </div>

          {/* Meta cards - inline on mobile, absolute on desktop */}
          <div className="mt-6 md:mt-0 md:absolute md:bottom-16 md:right-12 z-20 flex flex-row gap-2 md:flex-col md:gap-3">
            {slide.meta.map((m) => (
              <div
                key={m.label}
                className="bg-white/6 border border-white/10 rounded-xl px-3 md:px-4 py-2 md:py-3 flex-1 md:flex-none md:min-w-[160px]"
              >
                <p className="text-[10px] md:text-[11px] text-white/40 mb-0.5 md:mb-1">
                  {m.label}
                </p>
                <p className="text-xs md:text-sm text-white font-medium">
                  {m.val}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 left-4 md:left-12 z-20 flex gap-2">
          {sliders.map((_, i) => (
            <button
              key={i}
              onClick={() => setCur(i)}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                i === cur ? "w-6 md:w-8 bg-[#c97b63]" : "w-4 md:w-5 bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>

      <CategoriesMarquee />
    </div>
  );
}

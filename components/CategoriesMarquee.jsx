import { categories } from "@/assets/assets";

const CategoriesMarquee = () => {
  return (
    <div className="bg-[#0e0a0b] border-t border-b border-white/5 py-5 overflow-hidden w-full relative select-none group">
      {/* Left fade */}
      <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[#0e0a0b] to-transparent" />

      {/* Scrolling track */}
      <div className="flex min-w-[200%] animate-[marqueeScroll_10s_linear_infinite] sm:animate-[marqueeScroll_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-3">
        {[...categories, ...categories, ...categories, ...categories].map(
          (category, index) => (
            <button
              key={index}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 text-white/40 text-xs tracking-widest uppercase hover:border-[#c97b63]/50 hover:text-[#c97b63] hover:bg-[#c97b63]/8 active:scale-95 transition-all duration-300 whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c97b63]/50 flex-shrink-0" />
              {category}
            </button>
          )
        )}
      </div>

      {/* Right fade */}
      <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[#0e0a0b] to-transparent" />
    </div>
  );
};

export default CategoriesMarquee;

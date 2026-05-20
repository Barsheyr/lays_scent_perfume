import React from "react";
import Title from "./Title";
import { ourSpecsData } from "@/assets/assets";

const OurSpecs = () => {
  return (
    <div className="px-6 py-24 max-w-7xl mx-auto bg-[#0e0a0b]">
      <Title
        visibleButton={false}
        title="Why Choose Us"
        description="Premium service designed around your needs — fast, secure, and effortlessly reliable."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
        {ourSpecsData.map((spec, index) => (
          <div
            key={index}
            className="relative group p-8 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.06] transition-all duration-500 ease-out"
          >
            {/* Gradient accent line top */}
            <div
              className="absolute top-0 left-8 right-8 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ backgroundColor: spec.accent }}
            />

            {/* Icon container */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundColor: spec.accent + "20" }}
            >
              <spec.icon
                size={24}
                style={{ color: spec.accent }}
                strokeWidth={1.5}
              />
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">
              {spec.title}
            </h3>

            <p className="text-sm text-white/40 leading-relaxed">
              {spec.description}
            </p>

            {/* Hover indicator */}
            <div
              className="mt-6 flex items-center gap-2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
              style={{ color: spec.accent }}
            >
              <span>Learn more</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 9L9 3M9 3H5M9 3V7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Background number watermark */}
            <span className="absolute top-4 right-6 text-7xl font-bold opacity-[0.04] select-none pointer-events-none text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurSpecs;

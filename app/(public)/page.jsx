"use client";
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import Gender from "@/components/Gender";

export default function Home() {
  return (
    <div>
      <Hero />
      <LatestProducts />

      <div className="bg-[#0e0a0b]">
        {/* <BestSelling /> */}
        <Gender />
        <OurSpecs />
      </div>
    </div>
  );
}

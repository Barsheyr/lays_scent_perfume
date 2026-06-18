"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import Image from "next/image";
import Title from "@/components/Title";
import { categoryImages } from "@/assets/assets";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const products = useSelector((state) => state.product.list);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0e0a0b] px-3 lg:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-2">
            Explore
          </p>
          <div className="flex items-end justify-between">
            <h1 className="text-2xl lg:text-3xl font-serif italic text-white">
              Shop by Brand
            </h1>
            <Link
              href="/shop"
              className="text-sm text-[#c97b63] hover:underline underline-offset-4"
            >
              All products →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-4">
          {categories.map((category) => {
            const categoryImage = categoryImages[category];
            const fallbackImage = !categoryImage
              ? products.find((p) => p.category === category)?.images?.[0]
              : null;

            return (
              <Link
                key={category}
                href={`/category/${encodeURIComponent(category)}`}
                className="group relative border border-white/8 bg-white/3 hover:border-[#c97b63]/30 rounded-2xl overflow-hidden transition-all duration-300"
              >
                {(categoryImage || fallbackImage) && (
                  <div className="relative h-50 lg:h-72 overflow-hidden">
                    <Image
                      src={categoryImage || fallbackImage}
                      alt={`${category} fragrances`}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[10px] tracking-[2px] uppercase text-[#c97b63] mb-1">
                    Brand
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium text-white capitalize">
                      {category}
                    </p>
                    <span className="w-7 h-7 rounded-full bg-[#c97b63]/20 border border-[#c97b63]/40 flex items-center justify-center text-[#c97b63] text-xs group-hover:bg-[#c97b63] group-hover:text-white transition-all duration-300">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const { category } = useParams();
  const products = useSelector((state) => state.product.list);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0e0a0b] px-3 lg:px-10 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-2">
              Collection
            </p>
            <h1 className="text-2xl lg:text-3xl font-serif italic text-white capitalize">
              {category}
            </h1>
          </div>
          <Link
            href="/category"
            className="text-sm text-[#c97b63] hover:underline underline-offset-4"
          >
            All Brands →
          </Link>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {categoryProducts.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="group border border-white/8 bg-white/3 hover:border-[#c97b63]/30 rounded-2xl p-3 transition-all duration-300"
              >
                <div className="flex justify-center items-center border border-white/8 rounded-xl overflow-hidden bg-white/3 mb-3">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    width={500}
                    height={500}
                    className="group-hover:scale-105 transition-transform rounded-xl h-50 lg:h-64 object-cover"
                  />
                </div>
                <p className="text-sm text-white/60 font-medium mt-1">
                  {item.name}
                </p>
                <p className="text-[#c97b63] text-sm mt-0.5">
                  ₦{item.price.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 gap-3">
            <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63]">
              Empty
            </p>
            <p className="text-2xl font-serif italic text-white/20">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

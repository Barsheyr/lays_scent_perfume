"use client";
import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";

const LatestProducts = () => {
  const displayQuantity = 4;
  const products = useSelector((state) => state.product.list);

  const latest = products
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, displayQuantity);

  return (
    <section className="bg-[#0e0a0b] py-16 px-3">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-3">
              Just dropped
            </p>
            <h2 className="text-4xl md:text-5xl font-medium text-white leading-tight">
              Latest{" "}
              <span className="font-serif italic text-[#c97b63]">
                Fragrances
              </span>
            </h2>
            <p className="text-sm text-white/40 mt-3">
              Showing {Math.min(products.length, displayQuantity)} of{" "}
              {products.length} products
            </p>
          </div>
          <Link
            href="/shop"
            className="text-sm text-[#c97b63] hover:underline underline-offset-4"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {latest.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="group border border-white/8 bg-white/3 hover:border-[#c97b63]/30 rounded-2xl p-2 transition-all duration-300"
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
      </div>
    </section>
  );
};

export default LatestProducts;

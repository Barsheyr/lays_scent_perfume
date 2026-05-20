"use client";
import React from "react";
import Title from "./Title";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import Link from "next/link";

const LatestProducts = () => {
  const displayQuantity = 4;
  const products = useSelector((state) => state.product.list);

  const latest = products
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, displayQuantity);

  return (
    <section className="bg-[#0e0a0b] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-2">
              Just dropped
            </p>
            <h2 className="text-2xl font-medium text-white">
              Latest Fragrances
            </h2>
            <p className="text-sm text-white mt-1">
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

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {latest.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;

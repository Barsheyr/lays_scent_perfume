"use client";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ product }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";

  const rating = Math.round(
    product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
      product.rating.length
  );

  return (
    <Link
      href={`/product/${product.id}`}
      className="group border border-white/8 bg-white/3 hover:border-[#c97b63]/30 rounded-2xl p-2 transition-all duration-300"
    >
      <div className="flex justify-center items-center border border-white/8 rounded-xl overflow-hidden bg-white/3 mb-3">
        <Image
          width={500}
          height={500}
          className="group-hover:scale-105 transition-transform rounded-xl h-50 lg:h-64 object-cover"
          src={product.images[0]}
          alt={product.name}
        />
      </div>
      <div className="flex justify-between items-start gap-2 px-1">
        <div>
          <p className="text-sm text-white/60 font-medium">{product.name}</p>
          <div className="flex mt-1">
            {Array(5)
              .fill("")
              .map((_, index) => (
                <StarIcon
                  key={index}
                  size={12}
                  className="text-transparent"
                  fill={rating >= index + 1 ? "#c97b63" : "#3a3536"}
                />
              ))}
          </div>
        </div>
        <p className="text-[#c97b63] text-sm">
          {currency}
          {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;

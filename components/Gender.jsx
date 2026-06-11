"use client";
import React from "react";
import Title from "./Title";
import Link from "next/link";
import { useSelector } from "react-redux";
import Image from "next/image";
import { genderImages } from "@/assets/assets";

const Gender = () => {
  const products = useSelector((state) => state.product.list);

  // Get unique gender names from all products
  const genders = [...new Set(products.map((p) => p.gender))];

  return (
    <div className="max-w-6xl mx-auto px-10 py-10">
      <Title title="Male and female section" href="/shop" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-10 gap-10">
        {genders.map((gender) => {
          // Get the category image
          const genderImage = genderImages[gender];

          // Fallback to first product image if no category image exists
          const fallbackImage = !genderImage
            ? products.find((p) => p.gender === gender)?.images?.[0]
            : null;

          return (
            <Link
              key={gender}
              href={`/gender/${encodeURIComponent(gender)}`}
              className="p-6 text-center transition group rounded-lg bg-gray-100"
            >
              {(genderImage || fallbackImage) && (
                <div className="flex justify-center items-center mb-4">
                  <Image
                    src={genderImage || fallbackImage}
                    alt={`${gender} watches`}
                    width={500}
                    height={500}
                    className="group-hover:scale-105 transition-transform h-80"
                  />
                </div>
              )}
              <p className="text-lg font-medium text-slate-700 capitalize">
                {gender}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Gender;

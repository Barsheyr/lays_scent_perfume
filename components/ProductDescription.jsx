"use client";
import { ArrowRight, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ProductDescription = ({ product }) => {
  const [selectedTab, setSelectedTab] = useState("Description");

  return (
    <div className="my-18 text-sm text-white/60">
      {/* Tabs */}
      <div className="flex border-b border-white/8 mb-6 max-w-2xl">
        {["Description", "Reviews"].map((tab, index) => (
          <button
            className={`px-3 py-2 font-medium transition-colors duration-200 ${
              tab === selectedTab
                ? "border-b-[1.5px] border-[#c97b63] text-[#c97b63]"
                : "text-white/30 hover:text-white/50"
            }`}
            key={index}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Description */}
      {selectedTab === "Description" && (
        <p className="max-w-xl text-white/40 leading-relaxed">
          {product.description}
        </p>
      )}

      {/* Reviews */}
      {selectedTab === "Reviews" && (
        <div className="flex flex-col gap-3 mt-14">
          {(product.rating || []).length === 0 && (
            <p className="text-white/30">
              No reviews yet. Customers can review after their order is delivered.
            </p>
          )}
          {(product.rating || []).map((item, index) => {
            const name = item.user?.name || "Customer";
            return (
              <div key={index} className="flex gap-5 mb-10">
                {item.user?.image ? (
                  <img
                    src={item.user.image}
                    alt=""
                    className="size-10 rounded-full border border-[#c97b63]/30 object-cover shrink-0"
                  />
                ) : (
                  <div className="size-10 shrink-0 rounded-full border border-[#c97b63]/30 bg-[#c97b63]/10 flex items-center justify-center text-[#c97b63] font-medium">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center">
                    {Array(5)
                      .fill("")
                      .map((_, i) => (
                        <StarIcon
                          key={i}
                          size={18}
                          className="text-transparent mt-0.5"
                          fill={
                            item.rating >= i + 1
                              ? "#c97b63"
                              : "rgba(255,255,255,0.1)"
                          }
                        />
                      ))}
                  </div>
                  <p className="text-sm max-w-lg my-4 text-white/40 leading-relaxed">
                    {item.review}
                  </p>
                  <p className="font-medium text-white/60">{name}</p>
                  <p className="mt-3 font-light text-white/25">
                    {new Date(item.createdAt).toDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Store info */}
      <div className="flex gap-3 mt-14 pb-16">
        <Image
          src={product.store?.logo || "/favicon.ico"}
          alt=""
          className="size-11 rounded-full border border-[#c97b63]/40"
          width={100}
          height={100}
        />
        <div>
          <p className="font-medium text-white/40">
            Product by {product.store.name}
          </p>
          <Link
            href={`/shop/${product.store.username}`}
            className="flex items-center gap-1.5 text-[#c97b63] hover:underline underline-offset-4 mt-1"
          >
            view store <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;

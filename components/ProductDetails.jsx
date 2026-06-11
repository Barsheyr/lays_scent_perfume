"use client";

import { addToCart } from "@/lib/features/cart/cartSlice";
import {
  StarIcon,
  TagIcon,
  EarthIcon,
  CreditCardIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

const ProductDetails = ({ product }) => {
  const productId = product.id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";

  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const router = useRouter();

  const [mainImage, setMainImage] = useState(product.images[0]);

  const addToCartHandler = () => {
    dispatch(addToCart({ productId }));
  };

  const averageRating =
    product.rating.reduce((acc, item) => acc + item.rating, 0) /
    product.rating.length;

  return (
    <div className="flex max-lg:flex-col gap-12">
      {/* Images */}
      <div className="flex max-sm:flex-col-reverse gap-3">
        <div className="flex sm:flex-col gap-3">
          {product.images.map((image, index) => (
            <div
              key={index}
              onClick={() => setMainImage(product.images[index])}
              className={`border rounded-xl flex items-center justify-center size-26 cursor-pointer transition-all duration-200 ${
                mainImage === product.images[index]
                  ? "border-[#c97b63]/60 bg-[#c97b63]/8"
                  : "border-white/8 bg-white/3 hover:border-[#c97b63]/30"
              }`}
            >
              <Image
                src={image}
                className="group-hover:scale-103 group-active:scale-95 transition object-cover"
                alt=""
                width={45}
                height={45}
              />
            </div>
          ))}
        </div>

        {/* Main image */}
        <div className="flex justify-center items-center h-100 sm:size-113 border border-white/8 bg-white/3 rounded-2xl">
          <Image
            src={mainImage}
            alt=""
            width={250}
            height={250}
            className="object-contain"
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex-1">
        <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-2">
          {product.category}
        </p>
        <h1 className="text-3xl font-serif italic text-white">
          {product.name}
        </h1>

        {/* Stars */}
        <div className="flex items-center mt-2">
          {Array(5)
            .fill("")
            .map((_, index) => (
              <StarIcon
                key={index}
                size={14}
                className="text-transparent mt-0.5"
                fill={
                  averageRating >= index + 1
                    ? "#c97b63"
                    : "rgba(255,255,255,0.1)"
                }
              />
            ))}
          <p className="text-sm ml-3 text-white/30">
            {product.rating.length} Reviews
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center my-6 gap-3">
          <p className="text-2xl font-medium text-white">
            {currency}
            {product.price.toLocaleString()}
          </p>
          <p className="text-lg text-white/30 line-through">
            {currency}
            {product.mrp.toLocaleString()}
          </p>
        </div>

        {/* Discount */}
        <div className="flex items-center gap-2 text-[#c97b63] text-sm">
          <TagIcon size={13} />
          <p>
            Save{" "}
            {(((product.mrp - product.price) / product.mrp) * 100).toFixed(0)}%
            right now
          </p>
        </div>

        {/* Cart actions */}
        <div className="flex items-end gap-5 mt-10">
          {cart[productId] && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-white/50 tracking-wide">Quantity</p>
              <Counter productId={productId} />
            </div>
          )}
          <button
            onClick={() =>
              !cart[productId] ? addToCartHandler() : router.push("/cart")
            }
            className="bg-[#c97b63] hover:bg-[#b56d55] text-white px-10 py-3 text-sm rounded-full active:scale-95 transition-all duration-200"
          >
            {!cart[productId] ? "Add to Bag" : "View Bag"}
          </button>
        </div>

        <hr className="border-white/8 my-6" />

        {/* Trust badges */}
        <div className="flex flex-col gap-3 text-white/35 text-sm">
          <p className="flex items-center gap-3">
            <EarthIcon size={15} className="text-[#c97b63]" /> Free shipping
            nationwide
          </p>
          <p className="flex items-center gap-3">
            <CreditCardIcon size={15} className="text-[#c97b63]" /> 100% Secured
            Payment
          </p>
          <p className="flex items-center gap-3">
            <UserIcon size={15} className="text-[#c97b63]" /> Trusted by top
            brands
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

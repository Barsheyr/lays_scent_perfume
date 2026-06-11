"use client";
import { assets } from "@/assets/assets";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function StoreAddProduct() {
  const categories = [
    "Chanel",
    "Dior",
    "Tom Ford",
    "Versace",
    "YSL",
    "Creed",
    "Jo Malone",
    "Gucci",
    "Armani",
    "Burberry",
    "Calvin Klein",
    "Other",
  ];

  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    mrp: 0,
    price: 0,
    category: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const onChangeHandler = (e) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!images[1] && !images[2] && !images[3] && !images[4]) {
        return toast.error("Please upload at least one image");
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("name", productInfo.name);
      formData.append("description", productInfo.description);
      formData.append("mrp", productInfo.mrp);
      formData.append("price", productInfo.price);
      formData.append("category", productInfo.category);
      formData.append("gender", productInfo.gender);
      Object.keys(images).forEach((key) => {
        images[key] && formData.append("images", images[key]);
      });
      const token = await getToken();
      const { data } = await axios.post("/api/store/product", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message);
      setProductInfo({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
        gender: "",
      });
      setImages({ 1: null, 2: null, 3: null, 4: null });
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "bg-white/4 border border-white/10 focus:border-[#c97b63]/50 outline-none text-white/70 placeholder-white/20 w-full p-2.5 rounded-xl text-sm transition-colors";
  const labelClass = "text-xs tracking-wide text-white/40 mb-1.5";

  return (
    <form
      onSubmit={(e) =>
        toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })
      }
      className="text-white/50 mb-28"
    >
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-1">
          Store
        </p>
        <h1 className="text-2xl font-medium text-white">
          Add New{" "}
          <span className="text-[#c97b63] italic font-serif">Product</span>
        </h1>
      </div>

      {/* Images */}
      <p className={labelClass}>Product Images</p>
      <div className="flex gap-3 mt-2 mb-6">
        {Object.keys(images).map((key) => (
          <label key={key} htmlFor={`images${key}`} className="cursor-pointer">
            <div className="border border-white/10 hover:border-[#c97b63]/40 rounded-xl p-1.5 transition-all duration-200 bg-white/3">
              <Image
                width={300}
                height={300}
                className="h-14 w-auto rounded-lg opacity-70 hover:opacity-100 transition-opacity"
                src={
                  images[key]
                    ? URL.createObjectURL(images[key])
                    : assets.upload_area
                }
                alt=""
              />
            </div>
            <input
              type="file"
              accept="image/*"
              id={`images${key}`}
              onChange={(e) =>
                setImages({ ...images, [key]: e.target.files[0] })
              }
              hidden
            />
          </label>
        ))}
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5 mb-5 max-w-sm">
        <p className={labelClass}>Name</p>
        <input
          type="text"
          name="name"
          onChange={onChangeHandler}
          value={productInfo.name}
          placeholder="Enter product name"
          className={inputClass}
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5 mb-5 max-w-sm">
        <p className={labelClass}>Description</p>
        <textarea
          name="description"
          onChange={onChangeHandler}
          value={productInfo.description}
          placeholder="Enter product description"
          rows={5}
          className={`${inputClass} resize-none`}
          required
        />
      </div>

      {/* Prices */}
      <div className="flex gap-5 mb-5">
        <div className="flex flex-col gap-1.5">
          <p className={labelClass}>Actual Price (₦)</p>
          <input
            type="number"
            name="mrp"
            onChange={onChangeHandler}
            value={productInfo.mrp}
            placeholder="0"
            className={`${inputClass} max-w-45`}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className={labelClass}>Offer Price (₦)</p>
          <input
            type="number"
            name="price"
            onChange={onChangeHandler}
            value={productInfo.price}
            placeholder="0"
            className={`${inputClass} max-w-45`}
            required
          />
        </div>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5 mb-5 max-w-sm">
        <p className={labelClass}>Category</p>
        <select
          onChange={(e) =>
            setProductInfo({ ...productInfo, category: e.target.value })
          }
          value={productInfo.category}
          className={inputClass}
          required
        >
          <option value="" className="bg-[#0e0a0b]">
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category} value={category} className="bg-[#0e0a0b]">
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Gender */}
      <div className="flex flex-col gap-1.5 mb-8 max-w-sm">
        <p className={labelClass}>Gender</p>
        <select
          onChange={(e) =>
            setProductInfo({ ...productInfo, gender: e.target.value })
          }
          value={productInfo.gender}
          className={inputClass}
          required
        >
          <option value="" className="bg-[#0e0a0b]">
            Select Gender
          </option>
          <option value="MALE" className="bg-[#0e0a0b]">
            Male
          </option>
          <option value="FEMALE" className="bg-[#0e0a0b]">
            Female
          </option>
          <option value="UNISEX" className="bg-[#0e0a0b]">
            Unisex
          </option>
        </select>
      </div>

      <button
        disabled={loading}
        className="bg-[#c97b63] hover:bg-[#b56d55] disabled:opacity-50 text-white px-10 py-2.5 rounded-full transition-all text-sm active:scale-95"
      >
        Add Product
      </button>
    </form>
  );
}

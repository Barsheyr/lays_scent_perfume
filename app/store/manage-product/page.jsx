"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useUser, useAuth } from "@clerk/nextjs";
import axios from "axios";

export default function StoreManageProducts() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/product", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(
        data.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
    setLoading(false);
  };

  const toggleStock = async (productId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/store/stock-toggle",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, inStock: !product.inStock }
            : product
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="text-white/50 mb-28">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-1">
          Store
        </p>
        <h1 className="text-2xl font-medium text-white">
          Manage{" "}
          <span className="text-[#c97b63] italic font-serif">Products</span>
        </h1>
      </div>

      {/* Table */}
      <div className="w-full max-w-4xl border border-white/8 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/8 bg-white/3">
            <tr>
              <th className="px-4 py-3 text-[10px] tracking-[2px] uppercase text-white/30 font-normal">
                Name
              </th>
              <th className="px-4 py-3 text-[10px] tracking-[2px] uppercase text-white/30 font-normal hidden md:table-cell">
                Description
              </th>
              <th className="px-4 py-3 text-[10px] tracking-[2px] uppercase text-white/30 font-normal hidden md:table-cell">
                MRP
              </th>
              <th className="px-4 py-3 text-[10px] tracking-[2px] uppercase text-white/30 font-normal">
                Price
              </th>
              <th className="px-4 py-3 text-[10px] tracking-[2px] uppercase text-white/30 font-normal">
                Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t border-white/5 hover:bg-white/3 transition-colors duration-150"
              >
                <td className="px-4 py-3">
                  <div className="flex gap-3 items-center">
                    <div className="border border-white/10 rounded-lg p-0.5">
                      <Image
                        width={40}
                        height={40}
                        className="rounded-md w-9 h-9 object-cover cursor-pointer"
                        src={product.images[0]}
                        alt=""
                      />
                    </div>
                    <span className="text-white/60 text-sm">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 max-w-xs text-white/30 hidden md:table-cell truncate text-xs">
                  {product.description}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-white/30 text-xs">
                  {currency}
                  {product.mrp.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-white/60 text-sm">
                  {currency}
                  {product.price.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      onChange={() =>
                        toast.promise(toggleStock(product.id), {
                          loading: "Updating...",
                        })
                      }
                      checked={product.inStock}
                    />
                    <div className="w-9 h-5 bg-white/10 border border-white/10 rounded-full peer peer-checked:bg-[#c97b63] peer-checked:border-[#c97b63] transition-all duration-300"></div>
                    <span className="dot absolute left-1 top-1 w-3 h-3 bg-white/40 peer-checked:bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

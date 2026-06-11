"use client";
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import GuestOrderSummary from "@/components/GuestOrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser, useAuth } from "@clerk/nextjs";

export default function Cart() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";

  const { cartItems } = useSelector((state) => state.cart);
  const products = useSelector((state) => state.product.list);
  const dispatch = useDispatch();

  const [cartArray, setCartArray] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const { user } = useUser();

  const createCartArray = () => {
    setTotalPrice(0);
    const cartArray = [];
    for (const [key, value] of Object.entries(cartItems)) {
      const product = products.find((product) => product.id === key);
      if (product) {
        cartArray.push({ ...product, quantity: value });
        setTotalPrice((prev) => prev + product.price * value);
      }
    }
    setCartArray(cartArray);
  };

  const handleDeleteItemFromCart = (productId) => {
    dispatch(deleteItemFromCart({ productId }));
  };

  useEffect(() => {
    if (products.length > 0) createCartArray();
  }, [cartItems, products]);

  return cartArray.length > 0 ? (
    <div className="min-h-screen bg-[#0e0a0b] px-6">
      <div className="max-w-7xl mx-auto">
        <PageTitle
          heading="My Bag"
          text="items in your bag"
          linkText="Add more"
        />

        <div className="flex items-start justify-between gap-8 max-lg:flex-col">
          {/* Table */}
          <div className="w-full max-w-4xl border border-white/8 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-white/8 bg-white/3">
                <tr>
                  {["Product", "Quantity", "Total Price", "Remove"].map(
                    (h, i) => (
                      <th
                        key={i}
                        className={`px-4 py-3 text-[10px] tracking-[2px] uppercase text-white/30 font-normal ${
                          i === 0 ? "text-left" : "text-center"
                        } ${i === 3 ? "max-md:hidden" : ""}`}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {cartArray.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-white/5 hover:bg-white/3 transition-colors duration-150"
                  >
                    <td className="px-4 py-4">
                      <div className="flex gap-3 items-center">
                        <div className="border border-white/10 rounded-xl p-1 bg-white/3">
                          <Image
                            src={item.images[0]}
                            className="h-14 w-auto object-contain"
                            alt=""
                            width={45}
                            height={45}
                          />
                        </div>
                        <div>
                          <p className="text-white/60">{item.name}</p>
                          <p className="text-xs text-white/25 mt-0.5">
                            {item.category}
                          </p>
                          <p className="text-[#c97b63] text-xs mt-0.5">
                            {currency}
                            {item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-center px-4 py-4">
                      <Counter productId={item.id} />
                    </td>
                    <td className="text-center px-4 py-4 text-white/60">
                      {currency}
                      {(item.price * item.quantity).toLocaleString()}
                    </td>
                    <td className="text-center px-4 py-4 max-md:hidden">
                      <button
                        onClick={() => handleDeleteItemFromCart(item.id)}
                        className="text-white/25 hover:text-red-400 hover:bg-red-400/10 p-2.5 rounded-full active:scale-95 transition-all"
                      >
                        <Trash2Icon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order summary */}
          <div>
            {user ? (
              <OrderSummary totalPrice={totalPrice} items={cartArray} />
            ) : (
              <GuestOrderSummary totalPrice={totalPrice} items={cartArray} />
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-[80vh] bg-[#0e0a0b] flex flex-col items-center justify-center gap-3">
      <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63]">
        Nothing here
      </p>
      <h1 className="text-2xl sm:text-4xl font-serif italic text-white/20">
        Your bag is empty
      </h1>
    </div>
  );
}

import { PlusIcon, SquarePenIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import AddressModal from "./AddressModal";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchCart } from "@/lib/features/cart/cartSlice";
import { fetchAddress } from "@/lib/features/address/addressSlice";
import { useUser, useAuth } from "@clerk/nextjs";
import axios from "axios";

const OrderSummary = ({ totalPrice, items }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const addressList = useSelector((state) => state.address.list);

  useEffect(() => {
    if (user) {
      dispatch(fetchAddress({ getToken }));
    }
  }, [user, dispatch, getToken]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!user) {
        toast.error("Please login to proceed with an order");
        return;
      }
      if (!selectedAddress) {
        toast.error("Please select a delivery address");
        return;
      }
      if (!items || items.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      const token = await getToken();
      const { data } = await axios.post(
        "/api/orders",
        {
          addressId: selectedAddress.id,
          items,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(data.message || "Order placed successfully!");
      dispatch(fetchCart({ getToken }));
      router.push("/orders");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg lg:max-w-[340px] border border-white/8 bg-white/3 text-white/50 text-sm rounded-2xl p-6">
      <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-1">
        Checkout
      </p>
      <h2 className="text-xl font-serif italic text-white mb-5">
        Order Summary
      </h2>

      {/* Payment method */}
      <p className="text-[10px] tracking-[2px] uppercase text-white/25 mb-3">
        Payment Method
      </p>
      <div className="flex items-center gap-2 bg-white/3 border border-white/8 rounded-xl px-4 py-3">
        <input
          type="radio"
          id="COD"
          onChange={() => setPaymentMethod("COD")}
          checked={paymentMethod === "COD"}
          className="accent-[#c97b63]"
        />
        <label htmlFor="COD" className="cursor-pointer text-white/50">
          COD (Cash on Delivery)
        </label>
      </div>

      {/* Address */}
      <div className="my-5 py-5 border-y border-white/8">
        <p className="text-[10px] tracking-[2px] uppercase text-white/25 mb-3">
          Delivery Address
        </p>
        {selectedAddress ? (
          <div className="flex gap-2 items-center justify-between bg-white/5 border border-white/8 p-3 rounded-xl">
            <p className="text-white/50 text-xs">
              {selectedAddress.name}, {selectedAddress.city},{" "}
              {selectedAddress.state}, {selectedAddress.zip}
            </p>
            <SquarePenIcon
              onClick={() => setSelectedAddress(null)}
              className="cursor-pointer hover:text-[#c97b63] transition-colors flex-shrink-0"
              size={16}
            />
          </div>
        ) : (
          <div>
            {addressList && addressList.length > 0 ? (
              <select
                className="bg-white/4 border border-white/10 focus:border-[#c97b63]/50 outline-none text-white/50 w-full p-2.5 rounded-xl text-sm transition-colors mb-3"
                defaultValue=""
                onChange={(e) => {
                  const found = addressList.find(
                    (addr) => addr.id === e.target.value
                  );
                  setSelectedAddress(found);
                }}
              >
                <option value="" className="bg-[#0e0a0b]">
                  Select Address
                </option>
                {addressList.map((address) => (
                  <option
                    key={address.id}
                    value={address.id}
                    className="bg-[#0e0a0b]"
                  >
                    {address.name}, {address.city}, {address.state},{" "}
                    {address.zip}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-red-400/70 text-xs my-2">
                No addresses found. Please add one.
              </p>
            )}
            <button
              type="button"
              className="flex items-center gap-1.5 text-[#c97b63] text-sm hover:underline underline-offset-4 mt-1"
              onClick={() => setShowAddressModal(true)}
            >
              Add Address <PlusIcon size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Price summary */}
      <div className="pb-4 border-b border-white/8">
        <div className="flex justify-between text-sm">
          <div className="flex flex-col gap-1 text-white/30">
            <p>Subtotal:</p>
            <p>Shipping:</p>
          </div>
          <div className="flex flex-col gap-1 text-right text-white/50">
            <p>
              {currency}
              {totalPrice.toLocaleString()}
            </p>
            <p className="text-[#c97b63]">Free</p>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between py-4">
        <p className="text-white/50">Total:</p>
        <p className="font-medium text-white">
          {currency}
          {totalPrice.toLocaleString()}
        </p>
      </div>

      {/* Place order */}
      <button
        onClick={handlePlaceOrder}
        disabled={isLoading || !selectedAddress}
        className="w-full bg-[#c97b63] hover:bg-[#b56d55] text-white py-3 rounded-full active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        {isLoading ? "Processing..." : "Place Order"}
      </button>

      {showAddressModal && (
        <AddressModal setShowAddressModal={setShowAddressModal} />
      )}
    </div>
  );
};

export default OrderSummary;

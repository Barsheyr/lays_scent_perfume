import { PlusIcon, SquarePenIcon, TagIcon, XIcon } from "lucide-react";
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
    // }, [user, dispatch, getToken]);
  }, [user]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("PAYSTACK");
  const [isLoading, setIsLoading] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const discountAmount = coupon
    ? Math.round(totalPrice * (coupon.discount / 100) * 100) / 100
    : 0;
  const finalTotal = Math.round((totalPrice - discountAmount) * 100) / 100;

  const applyCoupon = async (e) => {
    e?.preventDefault?.();
    if (!user) return toast.error("Please log in to use a coupon");
    if (!couponInput.trim()) return toast.error("Enter a coupon code");
    setCouponLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/coupon",
        { code: couponInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCoupon(data.coupon);
      toast.success(`${data.coupon.code} applied: ${data.coupon.discount}% off`);
    } catch (error) {
      setCoupon(null);
      toast.error(error?.response?.data?.error || "Couldn't apply that coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponInput("");
  };

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
          couponCode: coupon?.code || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.authorizationUrl) {
        toast.loading("Taking you to Paystack...");
        window.location.href = data.authorizationUrl;
        return;
      }

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
      <div className="flex flex-col gap-2">
        {[
          {
            id: "PAYSTACK",
            label: "Pay now",
            hint: "Card, bank transfer or USSD via Paystack",
          },
          {
            id: "COD",
            label: "Cash on delivery",
            hint: "Pay when your order arrives",
          },
        ].map((opt) => (
          <label
            key={opt.id}
            htmlFor={opt.id}
            className={`flex items-start gap-3 cursor-pointer border rounded-xl px-4 py-3 transition-colors ${
              paymentMethod === opt.id
                ? "border-[#c97b63]/50 bg-[#c97b63]/5"
                : "border-white/8 bg-white/3 hover:border-white/15"
            }`}
          >
            <input
              type="radio"
              id={opt.id}
              name="paymentMethod"
              onChange={() => setPaymentMethod(opt.id)}
              checked={paymentMethod === opt.id}
              className="accent-[#c97b63] mt-1"
            />
            <span>
              <span className="block text-white/70">{opt.label}</span>
              <span className="block text-xs text-white/30">{opt.hint}</span>
            </span>
          </label>
        ))}
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

      {/* Coupon */}
      <div className="mb-5">
        <p className="text-[10px] tracking-[2px] uppercase text-white/25 mb-3">
          Coupon Code
        </p>
        {coupon ? (
          <div className="flex items-center justify-between gap-2 bg-[#c97b63]/10 border border-[#c97b63]/30 rounded-xl px-3 py-2.5">
            <span className="flex items-center gap-2 text-[#c97b63] text-sm">
              <TagIcon size={15} />
              <b className="tracking-wider">{coupon.code}</b>
              <span className="text-white/50">−{coupon.discount}%</span>
            </span>
            <button
              type="button"
              onClick={removeCoupon}
              aria-label="Remove coupon"
              className="p-1 text-white/40 hover:text-white"
            >
              <XIcon size={15} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && applyCoupon(e)}
              placeholder="e.g. FIRST10"
              aria-label="Coupon code"
              className="flex-1 min-w-0 bg-white/4 border border-white/10 focus:border-[#c97b63]/50 outline-none text-white/70 placeholder-white/20 px-3 py-2.5 rounded-xl text-sm uppercase tracking-wider transition-colors"
            />
            <button
              type="button"
              onClick={applyCoupon}
              disabled={couponLoading}
              className="px-4 rounded-xl border border-[#c97b63]/40 text-[#c97b63] text-sm hover:bg-[#c97b63]/10 disabled:opacity-40 transition-colors"
            >
              {couponLoading ? "..." : "Apply"}
            </button>
          </div>
        )}
      </div>

      {/* Price summary */}
      <div className="pb-4 border-b border-white/8">
        <div className="flex justify-between text-sm">
          <div className="flex flex-col gap-1 text-white/30">
            <p>Subtotal:</p>
            {coupon && <p>Discount ({coupon.code}):</p>}
            <p>Shipping:</p>
          </div>
          <div className="flex flex-col gap-1 text-right text-white/50">
            <p>
              {currency}
              {totalPrice.toLocaleString()}
            </p>
            {coupon && (
              <p className="text-[#c97b63]">
                −{currency}
                {discountAmount.toLocaleString()}
              </p>
            )}
            <p className="text-[#c97b63]">Free</p>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between py-4">
        <p className="text-white/50">Total:</p>
        <p className="font-medium text-white">
          {currency}
          {finalTotal.toLocaleString()}
        </p>
      </div>

      {/* Place order */}
      <button
        onClick={handlePlaceOrder}
        disabled={isLoading || !selectedAddress}
        className="w-full bg-[#c97b63] hover:bg-[#b56d55] text-white py-3 rounded-full active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        {isLoading
          ? "Processing..."
          : paymentMethod === "PAYSTACK"
            ? `Pay ${currency}${finalTotal.toLocaleString()}`
            : "Place Order"}
      </button>

      {showAddressModal && (
        <AddressModal setShowAddressModal={setShowAddressModal} />
      )}
    </div>
  );
};

export default OrderSummary;

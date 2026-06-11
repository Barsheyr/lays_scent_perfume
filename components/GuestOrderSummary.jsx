import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const GuestOrderSummary = ({ totalPrice, items }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";
  const WHATSAPP_NUMBER =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+2347084775311";
  const router = useRouter();

  const [guestInfo, setGuestInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!guestInfo.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!guestInfo.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!guestInfo.address.trim()) {
      toast.error("Please enter your delivery address");
      return false;
    }
    if (!guestInfo.city.trim()) {
      toast.error("Please enter your city");
      return false;
    }
    if (!guestInfo.state.trim()) {
      toast.error("Please enter your state");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!items || items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsLoading(true);

    const orderDetails = {
      customer: guestInfo,
      items,
      totalPrice,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("lastGuestOrder", JSON.stringify(orderDetails));

    let message = `*New Order Request*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${guestInfo.name}\n`;
    message += `Phone: ${guestInfo.phone}\n`;
    message += `Address: ${guestInfo.address}, ${guestInfo.city}, ${guestInfo.state}\n\n`;
    message += `*Order Items:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ${currency}${item.price.toLocaleString()}\n`;
      message += `   Subtotal: ${currency}${(
        item.price * item.quantity
      ).toLocaleString()}\n\n`;
    });
    message += `*Total Amount: ${currency}${totalPrice.toLocaleString()}*\n`;
    message += `Payment Method: Cash on Delivery`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    toast.success("Redirecting to WhatsApp...");
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      router.push("/order-success");
      setIsLoading(false);
    }, 500);
  };

  const inputClass =
    "w-full bg-white/4 border border-white/10 focus:border-[#c97b63]/50 outline-none text-white/60 placeholder-white/20 p-2.5 rounded-xl text-sm transition-colors";

  return (
    <div className="w-full max-w-lg lg:max-w-[340px] border border-white/8 bg-white/3 text-white/50 text-sm rounded-2xl p-6">
      <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-1">
        Guest Checkout
      </p>
      <h2 className="text-xl font-serif italic text-white mb-5">
        Order Summary
      </h2>

      {/* Guest info form */}
      <div className="my-4 py-4 border-y border-white/8">
        <p className="text-[10px] tracking-[2px] uppercase text-white/25 mb-3">
          Your Details
        </p>

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            value={guestInfo.name}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={guestInfo.phone}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
          <textarea
            name="address"
            placeholder="Delivery Address *"
            value={guestInfo.address}
            onChange={handleInputChange}
            rows="2"
            className={`${inputClass} resize-none`}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City *"
            value={guestInfo.city}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State *"
            value={guestInfo.state}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
        </div>
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
            <p className="text-white/25 text-xs">To be discussed</p>
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

      {/* WhatsApp button */}
      <button
        onClick={handlePlaceOrder}
        disabled={isLoading}
        className="w-full bg-[#c97b63] hover:bg-[#b56d55] text-white py-3 rounded-full active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
      >
        {isLoading ? (
          "Processing..."
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Continue on WhatsApp
          </>
        )}
      </button>

      <p className="text-xs text-white/20 text-center mt-3">
        You'll be redirected to WhatsApp to complete your order
      </p>
    </div>
  );
};

export default GuestOrderSummary;

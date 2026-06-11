"use client";
import { CheckCircle2, ShoppingBag, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/lib/features/cart/cartSlice";
import Image from "next/image";

export default function GuestOrderSuccess() {
  const dispatch = useDispatch();
  const [orderDetails, setOrderDetails] = useState(null);
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";
  const WHATSAPP_NUMBER =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348012345678";

  useEffect(() => {
    const savedOrder = localStorage.getItem("lastGuestOrder");
    if (savedOrder) setOrderDetails(JSON.parse(savedOrder));
    dispatch(clearCart());
  }, [dispatch]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-[#0e0a0b] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-3">
            Nothing found
          </p>
          <h1 className="text-2xl font-serif italic text-white/30 mb-6">
            No order found
          </h1>
          <Link
            href="/shop"
            className="text-sm text-[#c97b63] hover:underline underline-offset-4"
          >
            Continue Shopping →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0a0b] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-full bg-[#c97b63]/10 border border-[#c97b63]/30 flex items-center justify-center">
              <CheckCircle2 className="text-[#c97b63]" size={40} />
            </div>
          </div>
          <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-2">
            Success
          </p>
          <h1 className="text-3xl font-serif italic text-white mb-2">
            Order Request Sent!
          </h1>
          <p className="text-white/35 text-sm">
            Your order details have been sent via WhatsApp
          </p>
        </div>

        {/* Order summary card */}
        <div className="border border-white/8 bg-white/3 rounded-2xl p-6 mb-5">
          <p className="text-[10px] tracking-[2px] uppercase text-[#c97b63] mb-1">
            Receipt
          </p>
          <h2 className="text-xl font-serif italic text-white mb-5">
            Order Summary
          </h2>

          {/* Customer details */}
          <div className="mb-5 pb-5 border-b border-white/8">
            <p className="text-[10px] tracking-[2px] uppercase text-white/25 mb-3">
              Delivery Information
            </p>
            <div className="space-y-1.5 text-sm text-white/40">
              <p>
                <span className="text-white/25 mr-2">Name:</span>
                {orderDetails.customer.name}
              </p>
              <p>
                <span className="text-white/25 mr-2">Phone:</span>
                {orderDetails.customer.phone}
              </p>
              <p>
                <span className="text-white/25 mr-2">Address:</span>
                {orderDetails.customer.address}, {orderDetails.customer.city},{" "}
                {orderDetails.customer.state}
              </p>
            </div>
          </div>

          {/* Order items */}
          <div className="mb-5">
            <p className="text-[10px] tracking-[2px] uppercase text-white/25 mb-3">
              Items Ordered
            </p>
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border border-white/8 bg-white/3 p-3 rounded-xl"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {item.images && item.images[0] && (
                      <div className="border border-white/10 rounded-lg p-1.5 bg-white/3">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-white/60 font-medium">{item.name}</p>
                      <p className="text-xs text-white/25 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 font-medium">
                      {currency}
                      {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-xs text-white/25 mt-0.5">
                      {currency}
                      {item.price.toLocaleString()} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 border-t border-white/8">
            <div className="flex justify-between items-center">
              <span className="text-white/50">Total Amount:</span>
              <span className="text-white font-medium text-lg">
                {currency}
                {orderDetails.totalPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-white/20 text-right mt-1">
              Payment: Cash on Delivery
            </p>
          </div>
        </div>

        {/* What's next */}
        <div className="border border-[#c97b63]/20 bg-[#c97b63]/5 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <MessageCircle
              className="text-[#c97b63] mt-0.5 flex-shrink-0"
              size={20}
            />
            <div>
              <h3 className="font-medium text-white/60 mb-3">What's Next?</h3>
              <ul className="space-y-2 text-sm text-white/35">
                <li>• Our team will contact you via WhatsApp shortly</li>
                <li>• We'll confirm your order details and delivery address</li>
                <li>• You can discuss any changes or special requests</li>
                <li>• Payment will be collected upon delivery (COD)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/shop"
            className="flex items-center gap-2 px-6 py-3 bg-[#c97b63] hover:bg-[#b56d55] text-white rounded-full text-sm transition-all active:scale-95"
          >
            <ShoppingBag size={16} />
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-white/10 text-white/40 hover:text-white/60 hover:border-white/20 rounded-full text-sm transition-all active:scale-95"
          >
            Back to Home
          </Link>
        </div>

        {/* Contact support */}
        <div className="text-center mt-8 text-sm text-white/25">
          <p>
            Need help?{" "}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 underline"
            >
              Contact us on WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

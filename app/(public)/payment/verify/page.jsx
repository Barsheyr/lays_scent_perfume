"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import Link from "next/link";
import axios from "axios";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { fetchCart } from "@/lib/features/cart/cartSlice";

function VerifyPayment() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const { getToken, isLoaded } = useAuth();
  const dispatch = useDispatch();
  const [state, setState] = useState({ status: "loading", message: "" });

  useEffect(() => {
    if (!isLoaded) return;
    if (!reference) {
      setState({ status: "error", message: "No payment reference found." });
      return;
    }
    (async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(
          `/api/paystack/verify?reference=${encodeURIComponent(reference)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setState({ status: "success", message: data.message });
        dispatch(fetchCart({ getToken }));
      } catch (error) {
        setState({
          status: "error",
          message:
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "We couldn't confirm your payment.",
        });
      }
    })();
  }, [isLoaded, reference]);

  return (
    <div className="min-h-[70vh] bg-[#0e0a0b] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {state.status === "loading" && (
          <>
            <Loader2 className="mx-auto mb-5 animate-spin text-[#c97b63]" size={44} />
            <h1 className="text-2xl font-serif italic text-white mb-2">
              Confirming your payment…
            </h1>
            <p className="text-white/35 text-sm">Please don't close this page.</p>
          </>
        )}
        {state.status === "success" && (
          <>
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#c97b63]/10 border border-[#c97b63]/30 flex items-center justify-center">
              <CheckCircle2 className="text-[#c97b63]" size={40} />
            </div>
            <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-2">
              Payment received
            </p>
            <h1 className="text-3xl font-serif italic text-white mb-3">
              Thank you for your order!
            </h1>
            <p className="text-white/35 text-sm mb-8">
              We're preparing your fragrance. You can track it from your orders.
            </p>
            <Link
              href="/orders"
              className="px-8 py-3 bg-[#c97b63] hover:bg-[#b56d55] text-white text-sm rounded-full transition-colors"
            >
              View my orders
            </Link>
          </>
        )}
        {state.status === "error" && (
          <>
            <XCircle className="mx-auto mb-5 text-red-400/80" size={48} />
            <h1 className="text-2xl font-serif italic text-white mb-2">
              Payment not confirmed
            </h1>
            <p className="text-white/40 text-sm mb-2">{state.message}</p>
            <p className="text-white/30 text-xs mb-8">
              If you were debited, don't worry — it will be confirmed
              automatically within a few minutes. Ref: {reference}
            </p>
            <Link
              href="/cart"
              className="px-8 py-3 border border-[#c97b63]/40 text-[#c97b63] text-sm rounded-full hover:bg-[#c97b63]/10 transition-colors"
            >
              Back to cart
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyPayment />
    </Suspense>
  );
}

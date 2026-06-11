"use client";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import SellerNavbar from "./StoreNavbar";
import SellerSidebar from "./StoreSidebar";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

const StoreLayout = ({ children }) => {
  const { getToken } = useAuth();

  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState(null);

  const fetchIsSeller = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/is-seller", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsSeller(data.isSeller);
      setStoreInfo(data.storeInfo);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIsSeller();
  }, []);

  return loading ? (
    <Loading />
  ) : isSeller ? (
    <div className="flex flex-col h-screen bg-[#0e0a0b]">
      <SellerNavbar />
      <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
        <SellerSidebar storeInfo={storeInfo} />
        <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-[#0e0a0b] flex flex-col items-center justify-center text-center px-6">
      <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-3">
        Access Denied
      </p>
      <h1 className="text-2xl sm:text-4xl font-serif italic text-white/40">
        You are not authorized to access this page
      </h1>
      <Link
        href="/"
        className="flex items-center gap-2 mt-8 px-6 py-2.5 bg-[#c97b63] hover:bg-[#b56d55] text-white text-sm rounded-full transition-colors"
      >
        Go to home <ArrowRightIcon size={16} />
      </Link>
    </div>
  );
};

export default StoreLayout;

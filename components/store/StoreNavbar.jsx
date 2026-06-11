"use client";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

const StoreNavbar = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between px-8 py-3.5 border-b border-white/8 bg-[#0e0a0b] transition-all">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-medium text-white tracking-tight">
          Lays <span className="text-[#c97b63] italic">Scent</span>
        </span>
        <span className="w-2 h-2 rounded-full bg-[#c97b63]" />
        <span className="text-[10px] tracking-[2px] uppercase px-2 py-0.5 rounded-full border border-[#c97b63]/30 text-[#c97b63] ml-1">
          Store
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <p className="text-sm text-white/40">Hi, {user?.firstName}</p>
        <UserButton />
      </div>
    </div>
  );
};

export default StoreNavbar;

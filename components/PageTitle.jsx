"use client";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const PageTitle = ({ heading, text, path = "/", linkText }) => {
  return (
    <div className="my-8">
      <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-2">
        Your Selection
      </p>
      <h2 className="text-2xl font-serif italic text-white">{heading}</h2>
      <div className="flex items-center gap-3 mt-1">
        <p className="text-white/35 text-sm">{text}</p>
        <Link
          href={path}
          className="flex items-center gap-1 text-[#c97b63] text-sm hover:underline underline-offset-4"
        >
          {linkText} <ArrowRightIcon size={13} />
        </Link>
      </div>
    </div>
  );
};

export default PageTitle;

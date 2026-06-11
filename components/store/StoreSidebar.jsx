"use client";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  LayoutListIcon,
  SquarePenIcon,
  SquarePlusIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const StoreSidebar = ({ storeInfo }) => {
  const pathname = usePathname();

  const sidebarLinks = [
    { name: "Dashboard", href: "/store", icon: HomeIcon },
    { name: "Add Product", href: "/store/add-product", icon: SquarePlusIcon },
    {
      name: "Manage Product",
      href: "/store/manage-product",
      icon: SquarePenIcon,
    },
    { name: "Orders", href: "/store/orders", icon: LayoutListIcon },
  ];

  return (
    <div className="inline-flex h-full flex-col gap-5 border-r border-white/8 bg-[#0a0706] sm:min-w-60">
      <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
        <div className="p-0.5 rounded-full border border-[#c97b63]/40">
          <Image
            className="w-14 h-14 rounded-full object-cover"
            src={storeInfo?.logo}
            alt=""
            width={80}
            height={80}
          />
        </div>
        <p className="text-sm text-white/50">{storeInfo?.name}</p>
        <span className="text-[10px] tracking-[2px] uppercase px-3 py-1 rounded-full bg-[#c97b63]/10 border border-[#c97b63]/20 text-[#c97b63]">
          Seller
        </span>
      </div>

      <div className="max-sm:mt-6">
        {sidebarLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`relative flex items-center gap-3 text-white/35 hover:text-white/70 hover:bg-white/4 p-2.5 transition-all duration-200 ${
              pathname === link.href && "bg-white/5 text-white/70"
            }`}
          >
            <link.icon
              size={17}
              className={`sm:ml-5 ${
                pathname === link.href ? "text-[#c97b63]" : ""
              }`}
            />
            <p className="max-sm:hidden text-sm">{link.name}</p>
            {pathname === link.href && (
              <span className="absolute bg-[#c97b63] right-0 top-1.5 bottom-1.5 w-1 rounded-l" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StoreSidebar;

"use client";
import {
  Menu,
  PackageIcon,
  Search,
  ShoppingBag,
  Store,
  SquareStack,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [openMobile, setOpenMobile] = useState(false);
  const cartCount = useSelector((state) => state.cart.total);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  return (
    <nav className="relative bg-[#0e0a0b] border-b border-white/8">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-8xl mx-auto py-4 transition-all">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-medium text-white tracking-tight">
              Lays <span className="text-[#c97b63] italic">Scent</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-[#c97b63]" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-white/55 text-sm">
            <Link href="/" className="hover:text-[#c97b63] transition-colors">
              Home
            </Link>
            <Link
              href="/shop"
              className="hover:text-[#c97b63] transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/category"
              className="hover:text-[#c97b63] transition-colors"
            >
              Brands
            </Link>
            <Link
              href="/about"
              className="hover:text-[#c97b63] transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#c97b63] transition-colors"
            >
              Contact
            </Link>

            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-white/6 border border-[#c97b63]/25 px-4 py-2.5 rounded-full"
            >
              <Search size={14} className="text-[#c97b63]" />
              <input
                className="w-full bg-transparent outline-none placeholder-white/30 text-white/70 text-sm"
                type="text"
                placeholder="Search fragrances…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-white/55 hover:text-[#c97b63] transition-colors"
            >
              <ShoppingBag size={17} />
              Bag
              <span className="absolute -top-1.5 left-2.5 w-4 h-4 text-[9px] font-medium bg-[#c97b63] text-white rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          </div>

          {/* Mobile icons */}
          <div className="sm:hidden flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex items-center text-white/60 bg-white/6 border border-white/10 px-4 py-2 rounded-full"
            >
              <ShoppingBag size={16} />
              <span className="absolute -top-1 right-1.5 w-4 h-4 text-[9px] font-medium bg-[#c97b63] text-white rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            <button
              onClick={() => setOpenMobile((prev) => !prev)}
              className="p-2 text-white/60 hover:text-[#c97b63] transition-colors"
            >
              {openMobile ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {openMobile && (
        <div className="sm:hidden bg-[#130d0e] border-t border-white/8 px-6 py-5 space-y-1 animate-slideDown">
          {[
            { label: "Home", path: "/" },
            { label: "Shop", path: "/shop" },
            { label: "Brands", path: "/category" },
            { label: "For Him", path: "/gender/MALE" },
            { label: "For Her", path: "/gender/FEMALE" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
          ].map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpenMobile(false)}
              className="flex items-center justify-between py-3 text-sm text-white/50 hover:text-[#c97b63] border-b border-white/5 transition-colors"
            >
              {item.label}
              <span className="text-[#c97b63]/40 text-xs">→</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

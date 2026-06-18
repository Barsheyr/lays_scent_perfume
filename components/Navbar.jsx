"use client";
import {
  PackageIcon,
  Menu,
  Search,
  ShoppingCart,
  Store,
  SquareStack,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [openMobile, setOpenMobile] = useState(false);
  const cartCount = useSelector((state) => state.cart.total);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  return (
    <nav className="relative bg-[#0e0a0b] ">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-8xl mx-auto py-4  transition-all">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-medium text-white tracking-tight">
              Layah's <span className="text-[#c97b63] italic">Scent</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-[#c97b63]" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-white/55">
            <Link href="/" className="hover:text-[#c97b63] transition-colors">
              Home
            </Link>
            <Link
              href="/shop"
              className="hover:text-[#c97b63] transition-colors"
            >
              Shop
            </Link>
            <Link href="/category">Brand</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>

            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
            >
              <Search size={18} className="text-slate-600" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-white"
            >
              <ShoppingCart size={18} />
              Cart
              <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">
                {cartCount}
              </button>
            </Link>

            {/* CLERK AUTH - COMMENTED FOR FUTURE USE */}
            {/* {!user ? (
              <button
                onClick={openSignIn}
                className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
              >
                Login
              </button>
            ) : (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<PackageIcon size={16} />}
                    label="My Orders"
                    onClick={() => router.push("/orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )} */}
          </div>

          {/* Mobile Menu - Simplified */}
          <div className="sm:hidden flex items-center gap-4">
            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-slate-600 px-4 py-2 bg-slate-100 rounded-full"
            >
              <ShoppingCart size={16} />
              <span className="absolute -top-1 right-2 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={() => setOpenMobile((prev) => !prev)}
              className="p-2"
            >
              <Menu size={26} className="text-slate-700" />
            </button>

            {/* CLERK AUTH - COMMENTED FOR FUTURE USE */}
            {/* {user ? (
              <div>
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      labelIcon={<ShoppingCart size={16} />}
                      label="Cart"
                      onClick={() => router.push("/cart")}
                    />
                    <UserButton.Action
                      labelIcon={<Store size={16} />}
                      label="Shop"
                      onClick={() => router.push("/shop")}
                    />
                    <UserButton.Action
                      labelIcon={<PackageIcon size={16} />}
                      label="My Orders"
                      onClick={() => router.push("/orders")}
                    />
                    <UserButton.Action
                      labelIcon={<SquareStack size={16} />}
                      label="Brands"
                      onClick={() => router.push("/category")}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            ) : (
              <button
                onClick={openSignIn}
                className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full"
              >
                Login
              </button>
              <div></div>
            )} */}
          </div>
        </div>
      </div>

      {openMobile && (
        <div className="sm:hidden bg-white shadow-lg px-6 py-4 space-y-4 animate-slideDown">
          <Link href="/" onClick={() => setOpenMobile(false)} className="block">
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setOpenMobile(false)}
            className="block"
          >
            Shop
          </Link>
          <Link
            href="/category"
            onClick={() => setOpenMobile(false)}
            className="block"
          >
            Brand
          </Link>
          <Link
            href="/gender/MALE"
            onClick={() => setOpenMobile(false)}
            className="block"
          >
            Men
          </Link>
          <Link
            href="/gender/FEMALE"
            onClick={() => setOpenMobile(false)}
            className="block"
          >
            Women
          </Link>
          <Link
            href="/about"
            onClick={() => setOpenMobile(false)}
            className="block"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpenMobile(false)}
            className="block"
          >
            Contact
          </Link>
        </div>
      )}

      <hr className="border-gray-300" />
    </nav>
  );
};

export default Navbar;

// "use client";
// import {
//   PackageIcon,
//   Search,
//   ShoppingCart,
//   Store,
//   SquareStack,
// } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import { useUser, useClerk, UserButton } from "@clerk/nextjs";

// const Navbar = () => {
//   const { user } = useUser();
//   const { openSignIn } = useClerk();
//   const router = useRouter();
//   const CLOSE_DELAY = 150;

//   const [search, setSearch] = useState("");
//   const [openMenu, setOpenMenu] = useState(null); // "shop" | "brand" | null
//   const closeTimer = useRef(null);
//   const cartCount = useSelector((state) => state.cart.total);

//   const products = useSelector((state) => state.product.list);

//   const genders = [...new Set(products.map((p) => p.gender))].filter(Boolean);
//   const categories = [...new Set(products.map((p) => p.category))].filter(
//     Boolean
//   );

//   const openDropdown = (menu) => {
//     clearTimeout(closeTimer.current);
//     setOpenMenu(menu);
//   };

//   const scheduleClose = () => {
//     closeTimer.current = setTimeout(() => setOpenMenu(null), CLOSE_DELAY);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     router.push(`/shop?search=${search}`);
//   };

//   return (
//     <nav className="relative bg-white">
//       <div className="mx-6">
//         <div className="flex items-center justify-between max-w-8xl mx-auto py-4  transition-all">
//           <Link
//             href="/"
//             className="relative text-3xl font-semibold text-slate-700"
//           >
//             <span className="text-black">Layah's</span> Scent
//             <span className="text-[#9C7A3C] text-5xl leading-0">.</span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
//             <Link
//               href="/"
//               className="group relative py-1 text-[13px] uppercase tracking-[0.08em]"
//             >
//               Home{" "}
//               <span className="block h-px w-0 bg-[#9C7A3C] transition-all duration-300 group-hover:w-full" />
//             </Link>

//             <div
//               className="relative"
//               onMouseEnter={() => openDropdown("shop")}
//               onMouseLeave={scheduleClose}
//             >
//               <Link
//                 href="/shop"
//                 className="group relative py-1 text-[13px] uppercase tracking-[0.08em] inline-block"
//               >
//                 Shop
//                 <span
//                   className={`block h-px bg-[#9C7A3C] transition-all duration-300 ${
//                     openMenu === "shop" ? "w-full" : "w-0 group-hover:w-full"
//                   }`}
//                 />
//               </Link>

//               {openMenu === "shop" && genders.length > 0 && (
//                 <div
//                   className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64
//                            bg-[#FAFAF8] border border-[#E6E2D8] shadow-[0_8px_24px_rgba(22,21,19,0.08)]
//                            py-5 px-6 z-40"
//                 >
//                   <p className="text-[10px] tracking-[0.2em] uppercase text-[#9C7A3C] mb-3">
//                     Shop by gender
//                   </p>
//                   <div className="flex flex-col gap-2">
//                     {genders.map((gender) => (
//                       <Link
//                         key={gender}
//                         href={`/gender/${encodeURIComponent(gender)}`}
//                         className="text-[13px] text-[#161513] capitalize hover:text-[#9C7A3C] transition-colors"
//                       >
//                         {gender}
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div
//               className="relative"
//               onMouseEnter={() => openDropdown("brand")}
//               onMouseLeave={scheduleClose}
//             >
//               <Link
//                 href="/category"
//                 className="group relative py-1 text-[13px] uppercase tracking-[0.08em] inline-block"
//               >
//                 Brand
//                 <span
//                   className={`block h-px bg-[#9C7A3C] transition-all duration-300 ${
//                     openMenu === "brand" ? "w-full" : "w-0 group-hover:w-full"
//                   }`}
//                 />
//               </Link>

//               {openMenu === "brand" && categories.length > 0 && (
//                 <div
//                   className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64
//                            bg-[#FAFAF8] border border-[#E6E2D8] shadow-[0_8px_24px_rgba(22,21,19,0.08)]
//                            py-5 px-6 z-40"
//                 >
//                   <p className="text-[10px] tracking-[0.2em] uppercase text-[#9C7A3C] mb-3">
//                     Shop by brand
//                   </p>
//                   <div className="flex flex-col gap-2">
//                     {categories.map((category) => (
//                       <Link
//                         key={category}
//                         href={`/category/${encodeURIComponent(category)}`}
//                         className="text-[13px] text-[#161513] capitalize hover:text-[#9C7A3C] transition-colors"
//                       >
//                         {category}
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <Link
//               href="/about"
//               className="group relative py-1 text-[13px] uppercase tracking-[0.08em]"
//             >
//               About
//               <span className="block h-px w-0 bg-[#9C7A3C] transition-all duration-300 group-hover:w-full" />
//             </Link>

//             <Link
//               href="/contact"
//               className="group relative py-1 text-[13px] uppercase tracking-[0.08em]"
//             >
//               Contact
//               <span className="block h-px w-0 bg-[#9C7A3C] transition-all duration-300 group-hover:w-full" />
//             </Link>

//             <form
//               onSubmit={handleSearch}
//               className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
//             >
//               <Search size={18} className="text-slate-600" />
//               <input
//                 className="w-full bg-transparent outline-none placeholder-slate-600"
//                 type="text"
//                 placeholder="Search products"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 required
//               />
//             </form>

//             <Link
//               href="/cart"
//               className="relative flex items-center gap-2 text-slate-600"
//             >
//               <ShoppingCart size={18} />
//               Cart
//               <span className="absolute -top-2 left-4 text-[9px] text-white bg-[#161513] size-3.5 rounded-full flex items-center justify-center">
//                 {cartCount}
//               </span>
//             </Link>

//             {!user ? (
//               <button
//                 onClick={openSignIn}
//                 className="px-8 py-2 bg-[#161513] hover:bg-[#2A2825] transition text-white rounded-full text-[13px] tracking-[0.05em]"
//               >
//                 Login
//               </button>
//             ) : (
//               <UserButton>
//                 <UserButton.MenuItems>
//                   <UserButton.Action
//                     labelIcon={<PackageIcon size={16} />}
//                     label="My Orders"
//                     onClick={() => router.push("/orders")}
//                   />
//                 </UserButton.MenuItems>
//               </UserButton>
//             )}
//           </div>

//           {/* Mobile User Button  */}
//           <div className="sm:hidden">
//             {user ? (
//               <div>
//                 <UserButton>
//                   <UserButton.MenuItems>
//                     <UserButton.Action
//                       labelIcon={<ShoppingCart size={16} />}
//                       label="Cart"
//                       onClick={() => router.push("/cart")}
//                     />
//                     <UserButton.Action
//                       labelIcon={<Store size={16} />}
//                       label="Shop"
//                       onClick={() => router.push("/shop")}
//                     />
//                     <UserButton.Action
//                       labelIcon={<PackageIcon size={16} />}
//                       label="My Orders"
//                       onClick={() => router.push("/orders")}
//                     />
//                     <UserButton.Action
//                       labelIcon={<SquareStack size={16} />}
//                       label="Brands"
//                       onClick={() => router.push("/category")}
//                     />
//                   </UserButton.MenuItems>
//                 </UserButton>
//               </div>
//             ) : (
//               <div>
//                 <form
//                   onSubmit={handleSearch}
//                   className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
//                 >
//                   <Search size={18} className="text-slate-600" />
//                   <input
//                     className="w-full bg-transparent outline-none placeholder-slate-600"
//                     type="text"
//                     placeholder="Search products"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     required
//                   />
//                 </form>

//                 <button
//                   onClick={openSignIn}
//                   className="px-7 py-1.5 bg-[#161513] hover:bg-[#2A2825] text-sm transition text-white rounded-full"
//                 >
//                   Login
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <hr className="border-gray-300" />
//     </nav>
//   );
// };

// export default Navbar;

"use client";

import { Menu, X, Search, ShoppingCart, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import Image from "next/image";

const CLOSE_DELAY = 150;

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null); // "shop" | null
  const [openMobile, setOpenMobile] = useState(false);
  const closeTimer = useRef(null);

  const cartCount = useSelector((state) => state.cart.total);
  const products = useSelector((state) => state.product.list);
  const trending = products.slice().reverse().slice(0, 2);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
    setOpenMobile(false);
  };

  const openWithDelay = (menu) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };

  const closeWithDelay = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), CLOSE_DELAY);
  };

  const navLink =
    "text-[13px] uppercase tracking-[0.08em] text-white/55 hover:text-white transition-colors";

  return (
    <nav className="sticky top-0 z-50 bg-[#0e0a0b]/95 backdrop-blur-xl border-b border-white/8">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-8xl mx-auto py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-medium text-white tracking-tight">
              Layah's
              <span className="text-[#c97b63] italic font-serif">Scent</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c97b63]" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className={navLink}>
              Home
            </Link>

            <div
              onMouseEnter={() => openWithDelay("shop")}
              onMouseLeave={closeWithDelay}
            >
              <Link
                href="/shop"
                className={`${navLink} flex items-center gap-1`}
              >
                Shop
                <ChevronDown
                  size={13}
                  className={`transition-transform ${
                    openMenu === "shop" ? "rotate-180" : ""
                  }`}
                />
              </Link>
            </div>

            <Link href="/about" className={navLink}>
              About
            </Link>
            <Link href="/contact" className={navLink}>
              Contact
            </Link>

            <Link href="/orders" className={navLink}>
              Orders
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-6">
            <form
              onSubmit={handleSearch}
              className="flex items-center w-64 text-sm gap-2 bg-white/5 border border-white/8 focus-within:border-[#c97b63]/40 px-4 py-2.5 rounded-full transition-colors"
            >
              <Search size={16} className="text-white/30" />
              <input
                className="w-full bg-transparent outline-none placeholder-white/25 text-white/70"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <Link
              href="/cart"
              className="relative flex items-center text-white/60 hover:text-white transition-colors"
            >
              <ShoppingCart size={19} />
              <span className="absolute -top-2 -right-2 text-[9px] text-white bg-[#c97b63] size-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            {!user ? (
              <button
                onClick={openSignIn}
                className="px-6 py-2 bg-[#c97b63] hover:bg-[#b56d55] transition text-white text-sm rounded-full"
              >
                Login
              </button>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}
          </div>

          {/* Mobile controls */}
          <div className="lg:hidden flex items-center gap-4">
            <Link
              href="/cart"
              className="relative flex items-center text-white/60"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 text-[9px] text-white bg-[#c97b63] size-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
            <button
              onClick={() => setOpenMobile((prev) => !prev)}
              className="text-white/70"
            >
              {openMobile ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mega menu — Shop */}
      <div
        onMouseEnter={() => openWithDelay("shop")}
        onMouseLeave={closeWithDelay}
        className={`absolute left-0 w-full bg-[#0e0a0b] border-b border-white/8 shadow-2xl shadow-black/50 transition-all duration-300 origin-top ${
          openMenu === "shop"
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-95 pointer-events-none"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-4 gap-10">
          <div>
            <p className="text-[10px] tracking-[2px] uppercase text-white/25 mb-4">
              Shop
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/shop"
                className="text-white/60 hover:text-[#c97b63] text-sm transition-colors"
              >
                All Fragrances
              </Link>
              <Link
                href="/shop?sort=new"
                className="text-white/60 hover:text-[#c97b63] text-sm transition-colors"
              >
                New Arrivals
              </Link>
              <Link
                href="/shop?sort=bestseller"
                className="text-white/60 hover:text-[#c97b63] text-sm transition-colors"
              >
                Best Sellers
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] tracking-[2px] uppercase text-white/25 mb-4">
              By Gender
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/gender/MALE"
                className="text-white/60 hover:text-[#c97b63] text-sm transition-colors"
              >
                For Him
              </Link>
              <Link
                href="/gender/FEMALE"
                className="text-white/60 hover:text-[#c97b63] text-sm transition-colors"
              >
                For Her
              </Link>
              <Link
                href="/gender/UNISEX"
                className="text-white/60 hover:text-[#c97b63] text-sm transition-colors"
              >
                Unisex
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] tracking-[2px] uppercase text-white/25 mb-4">
              Brands
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/category"
                className="text-white/60 hover:text-[#c97b63] text-sm transition-colors"
              >
                All Brands
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] tracking-[2px] uppercase text-white/25 mb-4">
              Trending Now
            </p>
            <div className="flex flex-col gap-4">
              {trending.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/8 flex-shrink-0">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs group-hover:text-white transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[#c97b63] text-xs mt-0.5">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {openMobile && (
        <div className="lg:hidden bg-[#0e0a0b] border-t border-white/8 px-6 py-5 space-y-4">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-white/5 border border-white/8 px-4 py-2.5 rounded-full mb-2"
          >
            <Search size={16} className="text-white/30" />
            <input
              className="w-full bg-transparent outline-none placeholder-white/25 text-white/70 text-sm"
              type="text"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          {[
            ["Home", "/"],
            ["Shop", "/shop"],
            ["For Him", "/gender/MALE"],
            ["For Her", "/gender/FEMALE"],
            ["Unisex", "/gender/UNISEX"],
            ["Brand", "/category"],
            ["About", "/about"],
            ["Contact", "/contact"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpenMobile(false)}
              className="block text-white/60 text-sm"
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/8">
            {!user ? (
              <button
                onClick={openSignIn}
                className="w-full px-6 py-2.5 bg-[#c97b63] text-white text-sm rounded-full"
              >
                Login
              </button>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

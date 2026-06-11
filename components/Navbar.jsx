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
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { useUser, useClerk, UserButton } from "@clerk/nextjs";

// const Navbar = () => {
//   const { user } = useUser();
//   const { openSignIn } = useClerk();
//   const router = useRouter();

//   const [search, setSearch] = useState("");
//   const cartCount = useSelector((state) => state.cart.total);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     router.push(`/shop?search=${search}`);
//   };

//   return (
//     // <nav className="relative bg-white">
//     //   <div className="mx-6">
//     //     <div className="flex items-center justify-between max-w-8xl mx-auto py-4  transition-all">
//     //       <Link
//     //         href="/"
//     //         className="relative text-3xl font-semibold text-slate-700"
//     //       >
//     //         <span className="text-black">Daily</span>Wrist
//     //         <span className="text-green-600 text-5xl leading-0">.</span>
//     //       </Link>

//     //       {/* Desktop Menu */}
//     //       <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
//     //         <Link href="/">Home</Link>
//     //         <Link href="/shop">Shop</Link>
//     //         <Link href="/category">Brand</Link>
//     //         <Link href="/about">About</Link>
//     //         <Link href="/contact">Contact</Link>

//     //         <form
//     //           onSubmit={handleSearch}
//     //           className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
//     //         >
//     //           <Search size={18} className="text-slate-600" />
//     //           <input
//     //             className="w-full bg-transparent outline-none placeholder-slate-600"
//     //             type="text"
//     //             placeholder="Search products"
//     //             value={search}
//     //             onChange={(e) => setSearch(e.target.value)}
//     //             required
//     //           />
//     //         </form>

//     //         <Link
//     //           href="/cart"
//     //           className="relative flex items-center gap-2 text-slate-600"
//     //         >
//     //           <ShoppingCart size={18} />
//     //           Cart
//     //           <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">
//     //             {cartCount}
//     //           </button>
//     //         </Link>
//     //         {!user ? (
//     //           <button
//     //             onClick={openSignIn}
//     //             className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
//     //           >
//     //             Login
//     //           </button>
//     //         ) : (
//     //           <UserButton>
//     //             <UserButton.MenuItems>
//     //               <UserButton.Action
//     //                 labelIcon={<PackageIcon size={16} />}
//     //                 label="My Orders"
//     //                 onClick={() => router.push("/orders")}
//     //               />
//     //             </UserButton.MenuItems>
//     //           </UserButton>
//     //         )}
//     //       </div>

//     //       {/* Mobile User Button  */}
//     //       <div className="sm:hidden">
//     //         {user ? (
//     //           <div>
//     //             <UserButton>
//     //               <UserButton.MenuItems>
//     //                 <UserButton.Action
//     //                   labelIcon={<ShoppingCart size={16} />}
//     //                   label="Cart"
//     //                   onClick={() => router.push("/cart")}
//     //                 />
//     //                 <UserButton.Action
//     //                   labelIcon={<Store size={16} />}
//     //                   label="Shop"
//     //                   onClick={() => router.push("/shop")}
//     //                 />
//     //                 <UserButton.Action
//     //                   labelIcon={<PackageIcon size={16} />}
//     //                   label="My Orders"
//     //                   onClick={() => router.push("/orders")}
//     //                 />
//     //                 <UserButton.Action
//     //                   labelIcon={<SquareStack size={16} />}
//     //                   label="Brands"
//     //                   onClick={() => router.push("/category")}
//     //                 />
//     //               </UserButton.MenuItems>
//     //             </UserButton>
//     //           </div>
//     //         ) : (
//     //           <button
//     //             onClick={openSignIn}
//     //             className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full"
//     //           >
//     //             Login
//     //           </button>
//     //         )}
//     //       </div>
//     //     </div>
//     //   </div>
//     //   <hr className="border-gray-300" />
//     // </nav>

//     <nav className="relative bg-[#0e0a0b] ">
//       <div className="mx-6">
//         <div className="flex items-center justify-between max-w-8xl mx-auto py-4  transition-all">
//           <Link href="/" className="flex items-center gap-2">
//             <span className="text-xl font-medium text-white tracking-tight">
//               Layah's <span className="text-[#c97b63] italic">Scent</span>
//             </span>
//             <span className="w-2 h-2 rounded-full bg-[#c97b63]" />
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-white/55">
//             <Link href="/" className="hover:text-[#c97b63] transition-colors">
//               Home
//             </Link>
//             <Link
//               href="/shop"
//               className="hover:text-[#c97b63] transition-colors"
//             >
//               Shop
//             </Link>
//             <Link href="/category">Brand</Link>
//             <Link href="/about">About</Link>
//             <Link href="/contact">Contact</Link>

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
//               <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">
//                 {cartCount}
//               </button>
//             </Link>

//             {/* CLERK AUTH - COMMENTED FOR FUTURE USE */}
//             {/* {!user ? (
//               <button
//                 onClick={openSignIn}
//                 className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
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
//             )} */}
//           </div>

//           {/* Mobile Menu - Simplified */}
//           <div className="sm:hidden">
//             <Link
//               href="/cart"
//               className="relative flex items-center gap-2 text-slate-600 px-4 py-2 bg-slate-100 rounded-full"
//             >
//               <ShoppingCart size={16} />
//               <span className="absolute -top-1 right-2 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">
//                 {cartCount}
//               </span>
//             </Link>

//             {/* CLERK AUTH - COMMENTED FOR FUTURE USE */}
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
//               // <button
//               //   onClick={openSignIn}
//               //   className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full"
//               // >
//               //   Login
//               // </button>
//               <div></div>
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
import {
  PackageIcon,
  Search,
  ShoppingCart,
  Store,
  SquareStack,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"; // ← added useEffect
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [openMobile, setOpenMobile] = useState(false);
  const [mounted, setMounted] = useState(false); // ← added
  const cartCount = useSelector((state) => state.cart.total);

  useEffect(() => {
    setMounted(true); // ← added
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  return (
    <nav className="relative bg-[#0e0a0b]">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-8xl mx-auto py-4 transition-all">
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
              className="relative flex items-center gap-2 text-slate-600"
            >
              <ShoppingCart size={18} />
              Cart
              {/* ← only show count after mount */}
              {mounted && (
                <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">
                  {cartCount}
                </button>
              )}
            </Link>
          </div>

          {/* Mobile */}
          <div className="sm:hidden flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex items-center text-white/60 bg-white/6 border border-white/10 px-4 py-2 rounded-full"
            >
              <ShoppingCart size={16} />
              {/* ← only show count after mount */}
              {mounted && (
                <span className="absolute -top-1 right-1.5 w-4 h-4 text-[9px] font-medium bg-[#c97b63] text-white rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user && (
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
            )}

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
        <div className="sm:hidden bg-[#130d0e] border-t border-white/8 px-6 py-5 space-y-1">
          {[
            { label: "Home", path: "/" },
            { label: "Shop", path: "/shop" },
            { label: "Brands", path: "/category" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
            { label: "My Orders", path: "/orders" },
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

      <hr className="border-white/8" />
    </nav>
  );
};

export default Navbar;

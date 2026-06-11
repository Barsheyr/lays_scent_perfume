// "use client";
// import Link from "next/link";
// import { UserButton, useUser } from "@clerk/nextjs";

// const AdminNavbar = () => {
//   const { user } = useUser();

//   return (
//     <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
//       <Link href="/" className="relative text-4xl font-semibold text-slate-700">
//         <span className="text-black">Daily</span>Wrist
//         <span className="text-green-600 text-5xl leading-0">.</span>
//         <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-black">
//           TM
//         </p>
//       </Link>
//       <div className="flex items-center gap-3">
//         <p>Hi, {user?.firstName} </p>

//         <UserButton />
//       </div>
//     </div>
//   );
// };

// export default AdminNavbar;

"use client";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

const AdminNavbar = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between px-8 py-3.5 border-b border-white/8 bg-[#0e0a0b] transition-all">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-medium text-white tracking-tight">
          Lays <span className="text-[#c97b63] italic">Scent</span>
        </span>
        <span className="w-2 h-2 rounded-full bg-[#c97b63]" />
        <span className="text-[10px] tracking-[2px] uppercase px-2 py-0.5 rounded-full border border-[#c97b63]/30 text-[#c97b63] ml-1">
          Admin
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <p className="text-sm text-white/40">Hi, {user?.firstName}</p>
        <UserButton />
      </div>
    </div>
  );
};

export default AdminNavbar;

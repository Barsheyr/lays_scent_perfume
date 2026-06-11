// "use client";
// import Image from "next/image";
// import { MapPin, Mail, Phone } from "lucide-react";

// const StoreInfo = ({ store }) => {
//   return (
//     <div className="flex-1 space-y-2 text-sm">
//       <Image
//         width={100}
//         height={100}
//         src={store.logo}
//         alt={store.name}
//         className="max-w-20 max-h-20 object-contain shadow rounded-full max-sm:mx-auto"
//       />
//       <div className="flex flex-col sm:flex-row gap-3 items-center">
//         <h3 className="text-xl font-semibold text-slate-800"> {store.name} </h3>
//         <span className="text-sm">@{store.username}</span>

//         {/* Status Badge */}
//         <span
//           className={`text-xs font-semibold px-4 py-1 rounded-full ${
//             store.status === "pending"
//               ? "bg-yellow-100 text-yellow-800"
//               : store.status === "rejected"
//               ? "bg-red-100 text-red-800"
//               : "bg-green-100 text-green-800"
//           }`}
//         >
//           {store.status}
//         </span>
//       </div>

//       <p className="text-slate-600 my-5 max-w-2xl">{store.description}</p>
//       <p className="flex items-center gap-2">
//         {" "}
//         <MapPin size={16} /> {store.address}
//       </p>
//       <p className="flex items-center gap-2">
//         <Phone size={16} /> {store.contact}
//       </p>
//       <p className="flex items-center gap-2">
//         <Mail size={16} /> {store.email}
//       </p>
//       <p className="text-slate-700 mt-5">
//         Applied on{" "}
//         <span className="text-xs">
//           {new Date(store.createdAt).toLocaleDateString()}
//         </span>{" "}
//         by
//       </p>
//       <div className="flex items-center gap-2 text-sm ">
//         <Image
//           width={36}
//           height={36}
//           src={store.user.image}
//           alt={store.user.name}
//           className="w-9 h-9 rounded-full"
//         />
//         <div>
//           <p className="text-slate-600 font-medium">{store.user.name}</p>
//           <p className="text-slate-400">{store.user.email}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StoreInfo;

"use client";
import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";

const StoreInfo = ({ store }) => {
  return (
    <div className="flex-1 space-y-3 text-sm text-white/50">
      <Image
        width={100}
        height={100}
        src={store.logo}
        alt={store.name}
        className="max-w-20 max-h-20 object-contain rounded-full border border-[#c97b63]/30 max-sm:mx-auto"
      />

      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <h3 className="text-xl font-medium text-white">{store.name}</h3>
        <span className="text-white/30 text-sm">@{store.username}</span>
        <span
          className={`text-xs font-medium px-4 py-1 rounded-full border ${
            store.status === "pending"
              ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
              : store.status === "rejected"
              ? "bg-red-500/10 border-red-500/30 text-red-400"
              : "bg-[#c97b63]/10 border-[#c97b63]/30 text-[#c97b63]"
          }`}
        >
          {store.status}
        </span>
      </div>

      <p className="text-white/35 my-5 max-w-2xl leading-relaxed">
        {store.description}
      </p>

      <p className="flex items-center gap-2 text-white/40">
        <MapPin size={14} className="text-[#c97b63]" /> {store.address}
      </p>
      <p className="flex items-center gap-2 text-white/40">
        <Phone size={14} className="text-[#c97b63]" /> {store.contact}
      </p>
      <p className="flex items-center gap-2 text-white/40">
        <Mail size={14} className="text-[#c97b63]" /> {store.email}
      </p>

      <p className="text-white/30 mt-5">
        Applied on{" "}
        <span className="text-xs text-white/50">
          {new Date(store.createdAt).toLocaleDateString()}
        </span>{" "}
        by
      </p>

      <div className="flex items-center gap-3 mt-2">
        <div className="p-0.5 rounded-full border border-[#c97b63]/30">
          <Image
            width={36}
            height={36}
            src={store.user.image}
            alt={store.user.name}
            className="w-9 h-9 rounded-full"
          />
        </div>
        <div>
          <p className="text-white/60 font-medium">{store.user.name}</p>
          <p className="text-white/30 text-xs">{store.user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;

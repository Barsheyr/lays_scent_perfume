// "use client";
// import { dummyStoreDashboardData } from "@/assets/assets";
// import Loading from "@/components/Loading";
// import { useUser } from "@clerk/nextjs";
// import {
//   CircleDollarSignIcon,
//   ShoppingBasketIcon,
//   StarIcon,
//   TagsIcon,
// } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useAuth } from "@clerk/nextjs";
// import axios from "axios";

// export default function Dashboard() {
//   const { getToken } = useAuth();
//   const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";

//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState({
//     totalProducts: 0,
//     totalEarnings: 0,
//     totalOrders: 0,
//     ratings: [],
//   });

//   const dashboardCardsData = [
//     {
//       title: "Total Products",
//       value: dashboardData.totalProducts,
//       icon: ShoppingBasketIcon,
//     },
//     {
//       title: "Total Earnings",
//       value: currency + dashboardData.totalEarnings,
//       icon: CircleDollarSignIcon,
//     },
//     { title: "Total Orders", value: dashboardData.totalOrders, icon: TagsIcon },
//     {
//       title: "Total Ratings",
//       value: dashboardData.ratings.length,
//       icon: StarIcon,
//     },
//   ];

//   const fetchDashboardData = async () => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.get("/api/store/dashboard", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setDashboardData(data.dashboardData);
//     } catch (error) {
//       toast.error(error?.response?.data?.error || error.message);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   if (loading) return <Loading />;

//   return (
//     <div className=" text-white mb-28">
//       <h1 className="text-2xl">
//         Seller <span className="text-slate-800 font-medium">Dashboard</span>
//       </h1>

//       <div className="flex flex-wrap gap-5 my-10 mt-4">
//         {dashboardCardsData.map((card, index) => (
//           <div
//             key={index}
//             className="flex items-center gap-11 border border-slate-200 p-3 px-6 rounded-lg"
//           >
//             <div className="flex flex-col gap-3 text-xs">
//               <p>{card.title}</p>
//               <b className="text-2xl font-medium text-slate-700">
//                 {card.value}
//               </b>
//             </div>
//             <card.icon
//               size={50}
//               className=" w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full"
//             />
//           </div>
//         ))}
//       </div>

//       <h2>Total Reviews</h2>

//       <div className="mt-5">
//         {dashboardData.ratings.map((review, index) => (
//           <div
//             key={index}
//             className="flex max-sm:flex-col gap-5 sm:items-center justify-between py-6 border-b border-slate-200 text-sm text-slate-600 max-w-4xl"
//           >
//             <div>
//               <div className="flex gap-3">
//                 <Image
//                   src={review.user.image}
//                   alt=""
//                   className="w-10 aspect-square rounded-full"
//                   width={100}
//                   height={100}
//                 />
//                 <div>
//                   <p className="font-medium">{review.user.name}</p>
//                   <p className="font-light text-slate-500">
//                     {new Date(review.createdAt).toDateString()}
//                   </p>
//                 </div>
//               </div>
//               <p className="mt-3 text-slate-500 max-w-xs leading-6">
//                 {review.review}
//               </p>
//             </div>
//             <div className="flex flex-col justify-between gap-6 sm:items-end">
//               <div className="flex flex-col sm:items-end">
//                 <p className="text-slate-400">{review.product?.category}</p>
//                 <p className="font-medium">{review.product?.name}</p>
//                 <div className="flex items-center">
//                   {Array(5)
//                     .fill("")
//                     .map((_, index) => (
//                       <StarIcon
//                         key={index}
//                         size={17}
//                         className="text-transparent mt-0.5"
//                         fill={
//                           review.rating >= index + 1 ? "#00C950" : "#D1D5DB"
//                         }
//                       />
//                     ))}
//                 </div>
//               </div>
//               <button
//                 onClick={() => router.push(`/product/${review.product.id}`)}
//                 className="bg-slate-100 px-5 py-2 hover:bg-slate-200 rounded transition-all"
//               >
//                 View Product
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import { dummyStoreDashboardData } from "@/assets/assets";
import Loading from "@/components/Loading";
import { useUser } from "@clerk/nextjs";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  StarIcon,
  TagsIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

export default function Dashboard() {
  const { getToken } = useAuth();
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalEarnings: 0,
    totalOrders: 0,
    ratings: [],
  });

  const dashboardCardsData = [
    {
      title: "Total Products",
      value: dashboardData.totalProducts,
      icon: ShoppingBasketIcon,
    },
    {
      title: "Total Earnings",
      value: currency + dashboardData.totalEarnings,
      icon: CircleDollarSignIcon,
    },
    { title: "Total Orders", value: dashboardData.totalOrders, icon: TagsIcon },
    {
      title: "Total Ratings",
      value: dashboardData.ratings.length,
      icon: StarIcon,
    },
  ];

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(data.dashboardData);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="text-white/50 mb-28">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-1">
          Overview
        </p>
        <h1 className="text-2xl font-medium text-white">
          Seller{" "}
          <span className="text-[#c97b63] italic font-serif">Dashboard</span>
        </h1>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap gap-4 mb-10">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center gap-8 border border-white/8 bg-white/3 hover:border-[#c97b63]/30 transition-all duration-300 p-4 px-6 rounded-2xl"
          >
            <div className="flex flex-col gap-2 text-xs">
              <p className="text-white/35 tracking-wide">{card.title}</p>
              <b className="text-2xl font-medium text-white">{card.value}</b>
            </div>
            <card.icon
              size={44}
              className="w-11 h-11 p-2.5 text-[#c97b63] bg-[#c97b63]/10 border border-[#c97b63]/20 rounded-full"
            />
          </div>
        ))}
      </div>

      {/* Reviews */}
      <div className="mb-4">
        <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-1">
          Feedback
        </p>
        <h2 className="text-lg font-medium text-white">Total Reviews</h2>
      </div>

      <div className="mt-5">
        {dashboardData.ratings.map((review, index) => (
          <div
            key={index}
            className="flex max-sm:flex-col gap-5 sm:items-center justify-between py-6 border-b border-white/8 text-sm max-w-4xl"
          >
            <div>
              <div className="flex gap-3">
                <Image
                  src={review.user.image}
                  alt=""
                  className="w-10 aspect-square rounded-full border border-[#c97b63]/30"
                  width={100}
                  height={100}
                />
                <div>
                  <p className="font-medium text-white/70">
                    {review.user.name}
                  </p>
                  <p className="font-light text-white/30 text-xs">
                    {new Date(review.createdAt).toDateString()}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-white/35 max-w-xs leading-6">
                {review.review}
              </p>
            </div>

            <div className="flex flex-col justify-between gap-6 sm:items-end">
              <div className="flex flex-col sm:items-end">
                <p className="text-white/25 text-xs">
                  {review.product?.category}
                </p>
                <p className="font-medium text-white/60">
                  {review.product?.name}
                </p>
                <div className="flex items-center mt-1">
                  {Array(5)
                    .fill("")
                    .map((_, index) => (
                      <StarIcon
                        key={index}
                        size={15}
                        className="text-transparent mt-0.5"
                        fill={
                          review.rating >= index + 1
                            ? "#c97b63"
                            : "rgba(255,255,255,0.1)"
                        }
                      />
                    ))}
                </div>
              </div>
              <button
                onClick={() => router.push(`/product/${review.product.id}`)}
                className="bg-white/5 border border-white/10 hover:border-[#c97b63]/40 hover:text-[#c97b63] text-white/40 px-5 py-2 rounded-full text-xs transition-all duration-200"
              >
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

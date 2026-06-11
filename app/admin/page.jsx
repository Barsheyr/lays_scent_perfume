"use client";
import { dummyAdminDashboardData } from "@/assets/assets";
import Loading from "@/components/Loading";
import OrdersAreaChart from "@/components/OrdersAreaChart";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  StoreIcon,
  TagsIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    products: 0,
    revenue: 0,
    orders: 0,
    stores: 0,
    allOrders: [],
  });

  const dashboardCardsData = [
    {
      title: "Total Products",
      value: dashboardData.products,
      icon: ShoppingBasketIcon,
    },
    {
      title: "Total Revenue",
      value: currency + dashboardData.revenue,
      icon: CircleDollarSignIcon,
    },
    { title: "Total Orders", value: dashboardData.orders, icon: TagsIcon },
    { title: "Total Stores", value: dashboardData.stores, icon: StoreIcon },
  ];

  const fetchDashboardData = async () => {
    setDashboardData(dummyAdminDashboardData);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="text-white/50">
      <div className="mb-6">
        <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-1">
          Overview
        </p>
        <h1 className="text-2xl font-medium text-white">
          Admin{" "}
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
              <b className="text-2xl font-medium text-white/35">{card.value}</b>
            </div>
            <card.icon
              size={44}
              className="w-11 h-11 p-2.5 text-[#c97b63] bg-[#c97b63]/10 border border-[#c97b63]/20 rounded-full"
            />
          </div>
        ))}
      </div>

      {/* Area Chart */}
      <div className="border border-white/8 bg-white/3 rounded-2xl p-5">
        <OrdersAreaChart allOrders={dashboardData.allOrders} />
      </div>
    </div>
  );
}

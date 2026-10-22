"use client";
import Loading from "@/components/Loading";
import { useAuth } from "@clerk/nextjs";
import {
  BanknoteIcon,
  WalletIcon,
  TrendingUpIcon,
  PackageIcon,
  ClockIcon,
  TruckIcon,
  CheckCircle2Icon,
  XCircleIcon,
  CreditCardIcon,
  AlertTriangleIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  naira,
  PageHeader,
  RangePicker,
  StatCard,
  StatusBadge,
  EXPENSE_CATEGORIES,
} from "@/components/admin/ui";

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const [range, setRange] = useState("all");
  const [loading, setLoading] = useState(true);
  const [d, setD] = useState(null);

  const fetchDashboard = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/admin/dashboard?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setD(data.dashboardData);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [range]);

  if (loading || !d) return <Loading />;

  const pipeline = [
    { label: "In progress", value: d.counts.inProgress, icon: ClockIcon, tab: "progress", cls: "text-amber-300" },
    { label: "Out for delivery", value: d.counts.outForDelivery, icon: TruckIcon, tab: "delivery", cls: "text-violet-300" },
    { label: "Sold", value: d.counts.sold, icon: CheckCircle2Icon, tab: "sold", cls: "text-emerald-300" },
    { label: "Cancelled", value: d.counts.cancelled, icon: XCircleIcon, tab: "cancelled", cls: "text-red-300" },
    { label: "Awaiting payment", value: d.counts.awaitingPayment, icon: CreditCardIcon, tab: "awaiting", cls: "text-white/50" },
  ];

  const spendRows = Object.entries(d.spendByCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="text-white/50 pb-24 max-w-7xl">
      <PageHeader eyebrow="Overview" title="Layah's Scent" accent="Dashboard">
        <RangePicker value={range} onChange={setRange} />
      </PageHeader>

      {/* Money */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <StatCard
          label="Revenue (sold orders)"
          value={naira(d.revenue)}
          sub={`${d.unitsSold} bottles sold · ${naira(d.pendingRevenue)} still in delivery`}
          icon={BanknoteIcon}
        />
        <StatCard
          label="Total spend"
          value={naira(d.totalSpend)}
          sub="Stock, delivery, packaging & more"
          icon={WalletIcon}
        />
        <StatCard
          label="Net profit"
          value={naira(d.netProfit)}
          sub="Revenue − total spend"
          icon={TrendingUpIcon}
          tone={d.netProfit >= 0 ? "good" : "bad"}
        />
        <StatCard
          label="Profit on bottles sold"
          value={naira(d.grossProfit)}
          sub={`Selling price − cost price (${naira(d.costOfGoodsSold)} cost)`}
          icon={TrendingUpIcon}
          tone={d.grossProfit >= 0 ? "good" : "bad"}
        />
      </div>

      {/* Order pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {pipeline.map((p) => (
          <Link
            key={p.label}
            href={`/admin/orders?tab=${p.tab}`}
            className="flex items-center gap-3 border border-white/8 bg-white/3 hover:border-[#c97b63]/30 rounded-2xl px-4 py-3.5 transition-colors"
          >
            <p.icon size={20} className={p.cls} />
            <div>
              <p className="text-xl text-white leading-tight">{p.value}</p>
              <p className="text-[11px] text-white/35">{p.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Chart */}
        <div className="lg:col-span-2 border border-white/8 bg-white/3 rounded-2xl p-5">
          <p className="text-sm text-white/70 mb-1">Money in vs money out</p>
          <p className="text-xs text-white/30 mb-4">Last 6 months</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.monthly} barGap={4}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  tickFormatter={(v) => (v >= 1000 ? `₦${Math.round(v / 1000)}k` : `₦${v}`)}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  contentStyle={{ background: "#141011", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v) => naira(v)}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="revenue" name="Sold" fill="#c97b63" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="spend" name="Spent" fill="#6b5a55" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock + spend breakdown */}
        <div className="flex flex-col gap-4">
          <div className="border border-white/8 bg-white/3 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-white/70">Stock on hand</p>
              <PackageIcon size={18} className="text-[#c97b63]" />
            </div>
            <p className="text-2xl text-white">{d.stockUnits} bottles</p>
            <p className="text-xs text-white/30 mt-1">Worth {naira(d.stockValue)} at cost</p>
            {d.untrackedProducts > 0 && (
              <Link href="/admin/inventory" className="block text-xs text-[#c97b63] mt-3 hover:underline underline-offset-4">
                {d.untrackedProducts} product{d.untrackedProducts > 1 ? "s" : ""} not counted yet → set stock
              </Link>
            )}
          </div>
          <div className="border border-white/8 bg-white/3 rounded-2xl p-5 flex-1">
            <p className="text-sm text-white/70 mb-3">Where the money went</p>
            {spendRows.length === 0 ? (
              <Link href="/admin/expenses" className="text-xs text-[#c97b63] hover:underline underline-offset-4">
                No expenses yet → record one
              </Link>
            ) : (
              <div className="space-y-2.5">
                {spendRows.map(([cat, amt]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/50">{EXPENSE_CATEGORIES[cat] || cat}</span>
                      <span className="text-white/70">{naira(amt)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-[#c97b63]/70 rounded-full" style={{ width: `${(amt / d.totalSpend) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 border border-white/8 bg-white/3 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-white/70">Recent orders</p>
            <Link href="/admin/orders" className="text-xs text-[#c97b63] hover:underline underline-offset-4">View all →</Link>
          </div>
          {d.recentOrders.length === 0 ? (
            <p className="text-sm text-white/30">No orders yet.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {d.recentOrders.map((o) => (
                <Link key={o.id} href={`/admin/orders?open=${o.id}`} className="flex items-center gap-3 py-3 hover:bg-white/2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 truncate">{o.customer}</p>
                    <p className="text-[11px] text-white/30">
                      #{o.id.slice(-6).toUpperCase()} · {o.paymentMethod === "PAYSTACK" ? "Paystack" : "Cash on delivery"} ·{" "}
                      {new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <p className="text-sm text-white/70">{naira(o.total)}</p>
                  <StatusBadge status={o.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Low stock */}
        <div className="border border-white/8 bg-white/3 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangleIcon size={16} className="text-amber-300" />
            <p className="text-sm text-white/70">Running low</p>
          </div>
          {d.lowStock.length === 0 ? (
            <p className="text-sm text-white/30">All stocked up.</p>
          ) : (
            <div className="space-y-3">
              {d.lowStock.slice(0, 8).map((p) => (
                <Link key={p.id} href="/admin/inventory" className="flex items-center gap-3">
                  {p.image ? (
                    <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover bg-white/5" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-white/5" />
                  )}
                  <p className="flex-1 text-sm text-white/60 truncate">{p.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.stock === 0 ? "bg-red-500/10 text-red-300" : "bg-amber-500/10 text-amber-300"}`}>
                    {p.stock === 0 ? "Out" : `${p.stock} left`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

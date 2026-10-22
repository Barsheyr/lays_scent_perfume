"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { SearchIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import Loading from "@/components/Loading";
import {
  naira,
  PageHeader,
  StatusBadge,
  Modal,
  btnPrimary,
  btnGhost,
  inputCls,
} from "@/components/admin/ui";

const TABS = [
  { id: "progress", label: "In progress", statuses: ["ORDER_PLACED", "PROCESSING"] },
  { id: "delivery", label: "Out for delivery", statuses: ["SHIPPED", "OUT_FOR_DELIVERY"] },
  { id: "sold", label: "Sold", statuses: ["DELIVERED"] },
  { id: "cancelled", label: "Cancelled", statuses: ["CANCELLED"] },
  { id: "awaiting", label: "Awaiting payment", statuses: ["PENDING_PAYMENT"] },
  { id: "all", label: "All", statuses: null },
];

// The one obvious next step for each status
const NEXT_STEP = {
  ORDER_PLACED: { to: "PROCESSING", label: "Start processing" },
  PROCESSING: { to: "OUT_FOR_DELIVERY", label: "Send out for delivery" },
  SHIPPED: { to: "DELIVERED", label: "Mark as sold" },
  OUT_FOR_DELIVERY: { to: "DELIVERED", label: "Mark as sold" },
};

const shortId = (id) => "#" + id.slice(-6).toUpperCase();

function OrdersInner() {
  const { getToken } = useAuth();
  const params = useSearchParams();
  const [tab, setTab] = useState(params.get("tab") || "progress");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.orders);
      const openId = params.get("open");
      if (openId) {
        const found = data.orders.find((o) => o.id === openId);
        if (found) setSelected(found);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const setStatus = async (order, status) => {
    if (status === "CANCELLED" && !confirm("Cancel this order? Its bottles go back into stock.")) return;
    setBusy(order.id);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/admin/orders",
        { orderId: order.id, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, ...data.order } : o)));
      setSelected((s) => (s && s.id === order.id ? { ...s, ...data.order } : s));
      toast.success("Order updated");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setBusy(null);
    }
  };

  const counts = useMemo(() => {
    const c = {};
    for (const t of TABS) {
      c[t.id] = t.statuses ? orders.filter((o) => t.statuses.includes(o.status)).length : orders.length;
    }
    return c;
  }, [orders]);

  const visible = useMemo(() => {
    const t = TABS.find((x) => x.id === tab);
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (t?.statuses && !t.statuses.includes(o.status)) return false;
      if (!q) return true;
      return (
        o.id.toLowerCase().includes(q) ||
        o.user?.name?.toLowerCase().includes(q) ||
        o.address?.name?.toLowerCase().includes(q) ||
        o.address?.phone?.includes(q) ||
        o.orderItems.some((i) => i.product?.name?.toLowerCase().includes(q))
      );
    });
  }, [orders, tab, query]);

  if (loading) return <Loading />;

  return (
    <div className="text-white/50 pb-24 max-w-7xl">
      <PageHeader eyebrow="Fulfilment" title="Customer" accent="Orders">
        <div className="relative w-full sm:w-72">
          <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, perfume…"
            className={`${inputCls} pl-9`}
          />
        </div>
      </PageHeader>

      <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-white/8 mb-5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative whitespace-nowrap px-4 py-2.5 text-sm transition-colors ${
              tab === t.id ? "text-white" : "text-white/35 hover:text-white/60"
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-[11px] text-white/30">{counts[t.id]}</span>
            {tab === t.id && <span className="absolute left-2 right-2 -bottom-px h-0.5 bg-[#c97b63] rounded-full" />}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-white/30 py-16 text-center">No orders here.</p>
      ) : (
        <div className="grid gap-3">
          {visible.map((o) => {
            const next = NEXT_STEP[o.status];
            const itemsText = o.orderItems
              .map((i) => `${i.quantity}× ${i.product?.name || "Product"}`)
              .join(", ");
            return (
              <div
                key={o.id}
                onClick={() => setSelected(o)}
                className="flex flex-wrap items-center gap-x-5 gap-y-3 border border-white/8 bg-white/3 hover:border-[#c97b63]/25 rounded-2xl px-5 py-4 cursor-pointer transition-colors"
              >
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm text-white/80">{o.address?.name || o.user?.name}</p>
                    <span className="text-[11px] text-white/25">{shortId(o.id)}</span>
                  </div>
                  <p className="text-xs text-white/35 truncate max-w-md">{itemsText}</p>
                </div>
                <div className="text-xs text-white/35 w-28">
                  {new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </div>
                <div className="w-28">
                  <p className="text-sm text-white/80">{naira(o.total)}</p>
                  <p className={`text-[11px] ${o.isPaid ? "text-emerald-300/70" : "text-white/30"}`}>
                    {o.paymentMethod === "PAYSTACK" ? "Paystack" : "Cash on delivery"} · {o.isPaid ? "Paid" : "Unpaid"}
                  </p>
                </div>
                <StatusBadge status={o.status} />
                <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
                  {next && (
                    <button disabled={busy === o.id} onClick={() => setStatus(o, next.to)} className={`${btnPrimary} !py-2 !px-4 !text-xs`}>
                      {busy === o.id ? "Saving…" : next.label}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <Modal title={`Order ${shortId(selected.id)}`} onClose={() => setSelected(null)}>
          <div className="flex items-center justify-between mb-5">
            <StatusBadge status={selected.status} />
            <p className="text-xs text-white/30">{new Date(selected.createdAt).toLocaleString("en-NG")}</p>
          </div>

          <div className="space-y-3 mb-5">
            {selected.orderItems.map((i) => (
              <div key={i.productId} className="flex items-center gap-3">
                {i.product?.images?.[0] ? (
                  <img src={i.product.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover bg-white/5" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-white/5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate">{i.product?.name}</p>
                  <p className="text-xs text-white/30">
                    {i.quantity} × {naira(i.price)}
                    {i.costPrice > 0 && <> · cost {naira(i.costPrice)}</>}
                  </p>
                </div>
                <p className="text-sm text-white/70">{naira(i.price * i.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t border-white/8 pt-3 mb-5 text-sm">
            <span>Total</span>
            <span className="text-white">{naira(selected.total)}</span>
          </div>

          <div className="bg-white/3 border border-white/8 rounded-xl p-4 mb-5 text-sm space-y-1.5">
            <p className="text-white/80">{selected.address?.name}</p>
            <p className="flex items-start gap-2 text-white/45">
              <MapPinIcon size={14} className="mt-0.5 shrink-0" />
              {selected.address?.street}, {selected.address?.city}, {selected.address?.state}
            </p>
            {selected.address?.phone && (
              <a href={`tel:${selected.address.phone}`} className="flex items-center gap-2 text-[#c97b63]">
                <PhoneIcon size={14} /> {selected.address.phone}
              </a>
            )}
            <p className="text-xs text-white/30 pt-1">
              {selected.paymentMethod === "PAYSTACK" ? "Paystack" : "Cash on delivery"} ·{" "}
              {selected.isPaid ? `Paid${selected.paidAt ? " " + new Date(selected.paidAt).toLocaleDateString("en-NG") : ""}` : "Not paid yet"}
              {selected.paymentRef && <> · Ref {selected.paymentRef}</>}
            </p>
          </div>

          {selected.status !== "PENDING_PAYMENT" && (
            <>
              <p className="text-[10px] tracking-[2px] uppercase text-white/25 mb-2">Move to</p>
              <div className="flex flex-wrap gap-2">
                {[
                  ["ORDER_PLACED", "New order"],
                  ["PROCESSING", "Processing"],
                  ["OUT_FOR_DELIVERY", "Out for delivery"],
                  ["DELIVERED", "Sold"],
                ].map(([s, label]) => (
                  <button
                    key={s}
                    disabled={busy === selected.id || selected.status === s}
                    onClick={() => setStatus(selected, s)}
                    className={`${btnGhost} !text-xs disabled:opacity-30`}
                  >
                    {label}
                  </button>
                ))}
                {selected.status !== "CANCELLED" && (
                  <button
                    disabled={busy === selected.id}
                    onClick={() => setStatus(selected, "CANCELLED")}
                    className="border border-red-400/20 text-red-300/80 hover:bg-red-500/10 px-4 py-2 rounded-full text-xs transition-colors"
                  >
                    Cancel order
                  </button>
                )}
              </div>
            </>
          )}
          {selected.status === "PENDING_PAYMENT" && (
            <p className="text-xs text-white/35">
              The customer started a Paystack payment but hasn't finished. It will move to
              "New order" automatically once Paystack confirms it.
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OrdersInner />
    </Suspense>
  );
}

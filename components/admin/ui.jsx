"use client";

export const naira = (n) =>
  "₦" +
  Number(n || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

export const STATUS_META = {
  PENDING_PAYMENT: { label: "Awaiting payment", cls: "bg-white/5 text-white/40 border-white/10" },
  ORDER_PLACED: { label: "New order", cls: "bg-sky-500/10 text-sky-300 border-sky-400/20" },
  PROCESSING: { label: "Processing", cls: "bg-amber-500/10 text-amber-300 border-amber-400/20" },
  SHIPPED: { label: "Out for delivery", cls: "bg-violet-500/10 text-violet-300 border-violet-400/20" },
  OUT_FOR_DELIVERY: { label: "Out for delivery", cls: "bg-violet-500/10 text-violet-300 border-violet-400/20" },
  DELIVERED: { label: "Sold", cls: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-500/10 text-red-300 border-red-400/20" },
};

export const EXPENSE_CATEGORIES = {
  STOCK_PURCHASE: "Perfume stock",
  DELIVERY: "Delivery",
  PACKAGING: "Packaging",
  MARKETING: "Marketing & ads",
  OTHER: "Other",
};

export const RANGES = [
  { id: "all", label: "All time" },
  { id: "year", label: "This year" },
  { id: "month", label: "This month" },
  { id: "30d", label: "Last 30 days" },
];

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, cls: "bg-white/5 text-white/40 border-white/10" };
  return (
    <span className={`inline-block whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full border ${meta.cls}`}>
      {meta.label}
    </span>
  );
}

export function PageHeader({ eyebrow, title, accent, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-1">{eyebrow}</p>
        <h1 className="text-2xl font-medium text-white">
          {title} <span className="text-[#c97b63] italic font-serif">{accent}</span>
        </h1>
      </div>
      {children}
    </div>
  );
}

export function RangePicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 p-1 rounded-full border border-white/8 bg-white/3">
      {RANGES.map((r) => (
        <button
          key={r.id}
          onClick={() => onChange(r.id)}
          className={`px-3.5 py-1.5 rounded-full text-xs transition-colors ${
            value === r.id ? "bg-[#c97b63] text-white" : "text-white/40 hover:text-white/70"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon, tone = "default" }) {
  const toneCls =
    tone === "good" ? "text-emerald-300" : tone === "bad" ? "text-red-300" : "text-white";
  return (
    <div className="border border-white/8 bg-white/3 rounded-2xl p-5 min-w-0">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-xs text-white/40 tracking-wide">{label}</p>
        {Icon && (
          <Icon size={34} className="p-2 text-[#c97b63] bg-[#c97b63]/10 border border-[#c97b63]/20 rounded-full shrink-0" />
        )}
      </div>
      <p className={`text-2xl font-medium truncate ${toneCls}`}>{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1.5">{sub}</p>}
    </div>
  );
}

export const inputCls =
  "bg-white/4 border border-white/10 focus:border-[#c97b63]/50 outline-none text-white/80 placeholder-white/20 w-full p-2.5 rounded-xl text-sm transition-colors";

export const btnPrimary =
  "bg-[#c97b63] hover:bg-[#b56d55] disabled:opacity-40 text-white px-5 py-2.5 rounded-full text-sm transition-all active:scale-95";

export const btnGhost =
  "border border-white/10 hover:border-[#c97b63]/40 text-white/60 hover:text-white px-4 py-2 rounded-full text-sm transition-colors";

export function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#141011] border border-white/10 rounded-2xl p-6 text-white/60"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-serif italic text-white">{title}</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white text-xl leading-none">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

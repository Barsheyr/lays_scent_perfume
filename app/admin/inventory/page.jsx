"use client";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  PencilIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import Loading from "@/components/Loading";
import {
  naira,
  PageHeader,
  StatCard,
  Modal,
  inputCls,
  btnPrimary,
  btnGhost,
} from "@/components/admin/ui";

const MOVE_META = {
  RESTOCK: { label: "Goods in", cls: "text-emerald-300" },
  SALE: { label: "Sold", cls: "text-sky-300" },
  RETURN: { label: "Returned", cls: "text-emerald-300" },
  DAMAGED: { label: "Damaged / lost", cls: "text-red-300" },
  ADJUSTMENT: { label: "Count correction", cls: "text-amber-300" },
};

const MOVE_FORMS = {
  RESTOCK: { title: "Goods in", qtyLabel: "Bottles received", showCost: true },
  DAMAGED: { title: "Goods out (damaged / lost / gift)", qtyLabel: "Bottles removed" },
  RETURN: { title: "Customer return", qtyLabel: "Bottles returned" },
  ADJUSTMENT: { title: "Correct the count", qtyLabel: "Bottles you actually have" },
};

export default function InventoryPage() {
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("stock");
  const [query, setQuery] = useState("");
  const [moveForm, setMoveForm] = useState(null); // { product, type, quantity, unitCost, note, recordExpense }
  const [editForm, setEditForm] = useState(null); // { product, costPrice, price, lowStockAt }
  const [saving, setSaving] = useState(false);

  const auth = async () => ({ headers: { Authorization: `Bearer ${await getToken()}` } });

  const fetchInventory = async () => {
    try {
      const { data } = await axios.get("/api/admin/inventory", await auth());
      setProducts(data.products);
      setMovements(data.movements);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openMove = (product, type) =>
    setMoveForm({
      product,
      type,
      quantity: type === "ADJUSTMENT" ? String(product.stock) : "",
      unitCost: type === "RESTOCK" && product.costPrice ? String(product.costPrice) : "",
      note: "",
      recordExpense: true,
    });

  const submitMove = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(
        "/api/admin/inventory",
        {
          productId: moveForm.product.id,
          type: moveForm.type,
          quantity: moveForm.quantity,
          unitCost: moveForm.type === "RESTOCK" ? moveForm.unitCost : undefined,
          note: moveForm.note,
          recordExpense: moveForm.recordExpense,
        },
        await auth()
      );
      toast.success("Stock updated");
      setMoveForm(null);
      fetchInventory();
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setSaving(false);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.patch(
        "/api/admin/inventory",
        {
          productId: editForm.product.id,
          costPrice: editForm.costPrice,
          price: editForm.price,
          lowStockAt: editForm.lowStockAt,
        },
        await auth()
      );
      toast.success("Product updated");
      setEditForm(null);
      fetchInventory();
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => !q || p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
    );
  }, [products, query]);

  const totals = useMemo(() => {
    const tracked = products.filter((p) => p.trackStock);
    const now = Date.now();
    const last30 = movements.filter((m) => now - new Date(m.createdAt).getTime() < 30 * 864e5);
    return {
      units: tracked.reduce((s, p) => s + p.stock, 0),
      value: tracked.reduce((s, p) => s + p.stock * p.costPrice, 0),
      retail: tracked.reduce((s, p) => s + p.stock * p.price, 0),
      in30: last30.filter((m) => m.quantity > 0).reduce((s, m) => s + m.quantity, 0),
      out30: last30.filter((m) => m.quantity < 0).reduce((s, m) => s - m.quantity, 0),
      low: tracked.filter((p) => p.stock <= p.lowStockAt).length,
      untracked: products.length - tracked.length,
    };
  }, [products, movements]);

  if (loading) return <Loading />;

  const stockBadge = (p) => {
    if (!p.trackStock)
      return <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-white/35">Not counted</span>;
    const cls =
      p.stock === 0
        ? "bg-red-500/10 text-red-300"
        : p.stock <= p.lowStockAt
          ? "bg-amber-500/10 text-amber-300"
          : "bg-emerald-500/10 text-emerald-300";
    return <span className={`text-xs px-2.5 py-0.5 rounded-full ${cls}`}>{p.stock}</span>;
  };

  return (
    <div className="text-white/50 pb-24 max-w-7xl">
      <PageHeader eyebrow="Stock" title="Goods In &" accent="Out" />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Bottles in stock" value={totals.units} sub={`${totals.low} running low`} />
        <StatCard label="Stock value (cost)" value={naira(totals.value)} sub={`${naira(totals.retail)} if all sold`} />
        <StatCard label="Goods in · 30 days" value={totals.in30} tone="good" />
        <StatCard label="Goods out · 30 days" value={totals.out30} />
      </div>

      {totals.untracked > 0 && (
        <div className="mb-5 border border-[#c97b63]/25 bg-[#c97b63]/5 rounded-2xl px-5 py-3.5 text-sm text-white/60">
          {totals.untracked} product{totals.untracked > 1 ? "s haven't" : " hasn't"} been counted yet. Use{" "}
          <b className="text-white/80">Correct count</b> to enter how many bottles you have, and{" "}
          <b className="text-white/80">Edit</b> to add the cost price. Until then they won't be limited by stock.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-1 p-1 rounded-full border border-white/8 bg-white/3">
          {[
            ["stock", "Stock levels"],
            ["history", "In / out history"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`px-4 py-1.5 rounded-full text-xs transition-colors ${
                view === id ? "bg-[#c97b63] text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {view === "stock" && (
          <div className="relative w-full sm:w-64">
            <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search perfume…" className={`${inputCls} pl-9`} />
          </div>
        )}
      </div>

      {view === "stock" ? (
        <div className="overflow-x-auto border border-white/8 rounded-2xl">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-white/3 text-left">
              <tr>
                {["Perfume", "In stock", "Cost", "Selling", "Profit / bottle", "Stock value", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] tracking-[2px] uppercase text-white/30 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const margin = p.price - p.costPrice;
                return (
                  <tr key={p.id} className="border-t border-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-white/5" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-white/5" />
                        )}
                        <div className="min-w-0">
                          <p className="text-white/80 truncate max-w-[220px]">{p.name}</p>
                          <p className="text-[11px] text-white/30">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{stockBadge(p)}</td>
                    <td className="px-4 py-3">{p.costPrice ? naira(p.costPrice) : <span className="text-white/25">—</span>}</td>
                    <td className="px-4 py-3 text-white/70">{naira(p.price)}</td>
                    <td className={`px-4 py-3 ${p.costPrice ? (margin >= 0 ? "text-emerald-300" : "text-red-300") : "text-white/25"}`}>
                      {p.costPrice ? naira(margin) : "—"}
                    </td>
                    <td className="px-4 py-3">{p.trackStock ? naira(p.stock * p.costPrice) : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button title="Goods in" onClick={() => openMove(p, "RESTOCK")} className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-300/80">
                          <ArrowDownToLineIcon size={16} />
                        </button>
                        <button title="Goods out (damaged/lost)" onClick={() => openMove(p, "DAMAGED")} className="p-2 rounded-lg hover:bg-red-500/10 text-red-300/80">
                          <ArrowUpFromLineIcon size={16} />
                        </button>
                        <button title="Correct count" onClick={() => openMove(p, "ADJUSTMENT")} className="p-2 rounded-lg hover:bg-amber-500/10 text-amber-300/80">
                          <SlidersHorizontalIcon size={16} />
                        </button>
                        <button
                          title="Edit prices"
                          onClick={() => setEditForm({ product: p, costPrice: String(p.costPrice || ""), price: String(p.price), lowStockAt: String(p.lowStockAt) })}
                          className="p-2 rounded-lg hover:bg-white/5 text-white/50"
                        >
                          <PencilIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-10 text-white/30">No products found.</p>}
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/8 rounded-2xl">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="bg-white/3 text-left">
              <tr>
                {["Date", "Perfume", "Movement", "Qty", "Unit cost", "Note"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] tracking-[2px] uppercase text-white/30 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} className="border-t border-white/5">
                  <td className="px-4 py-3 text-white/40 whitespace-nowrap">
                    {new Date(m.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-white/70">{m.product?.name}</td>
                  <td className={`px-4 py-3 ${MOVE_META[m.type]?.cls}`}>{MOVE_META[m.type]?.label || m.type}</td>
                  <td className={`px-4 py-3 font-medium ${m.quantity > 0 ? "text-emerald-300" : m.quantity < 0 ? "text-red-300" : "text-white/40"}`}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </td>
                  <td className="px-4 py-3">{m.unitCost ? naira(m.unitCost) : "—"}</td>
                  <td className="px-4 py-3 text-white/35">{m.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {movements.length === 0 && <p className="text-center py-10 text-white/30">No stock movements yet.</p>}
        </div>
      )}

      {moveForm && (
        <Modal title={MOVE_FORMS[moveForm.type].title} onClose={() => setMoveForm(null)}>
          <form onSubmit={submitMove} className="space-y-4">
            <div className="flex items-center gap-3 bg-white/3 border border-white/8 rounded-xl p-3">
              <p className="flex-1 text-sm text-white/80 truncate">{moveForm.product.name}</p>
              <p className="text-xs text-white/40">Now: {moveForm.product.trackStock ? moveForm.product.stock : "not counted"}</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {Object.entries(MOVE_FORMS).map(([type, f]) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => openMove(moveForm.product, type)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    moveForm.type === type ? "border-[#c97b63] text-white bg-[#c97b63]/10" : "border-white/10 text-white/40"
                  }`}
                >
                  {f.title.split(" (")[0]}
                </button>
              ))}
            </div>

            <label className="block">
              <span className="text-xs text-white/40">{MOVE_FORMS[moveForm.type].qtyLabel}</span>
              <input
                type="number"
                min={moveForm.type === "ADJUSTMENT" ? 0 : 1}
                step="1"
                required
                autoFocus
                value={moveForm.quantity}
                onChange={(e) => setMoveForm({ ...moveForm, quantity: e.target.value })}
                className={`${inputCls} mt-1.5`}
              />
            </label>

            {MOVE_FORMS[moveForm.type].showCost && (
              <>
                <label className="block">
                  <span className="text-xs text-white/40">Cost per bottle (₦)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={moveForm.unitCost}
                    onChange={(e) => setMoveForm({ ...moveForm, unitCost: e.target.value })}
                    placeholder="What you paid the supplier"
                    className={`${inputCls} mt-1.5`}
                  />
                </label>
                {Number(moveForm.unitCost) > 0 && Number(moveForm.quantity) > 0 && (
                  <label className="flex items-center gap-2 text-xs text-white/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={moveForm.recordExpense}
                      onChange={(e) => setMoveForm({ ...moveForm, recordExpense: e.target.checked })}
                      className="accent-[#c97b63]"
                    />
                    Add {naira(Number(moveForm.unitCost) * Number(moveForm.quantity))} to expenses (perfume stock)
                  </label>
                )}
              </>
            )}

            <label className="block">
              <span className="text-xs text-white/40">Note (optional)</span>
              <input
                value={moveForm.note}
                onChange={(e) => setMoveForm({ ...moveForm, note: e.target.value })}
                placeholder={moveForm.type === "RESTOCK" ? "Supplier, batch…" : "Reason"}
                className={`${inputCls} mt-1.5`}
              />
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setMoveForm(null)} className={btnGhost}>Cancel</button>
              <button disabled={saving} className={btnPrimary}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </form>
        </Modal>
      )}

      {editForm && (
        <Modal title="Edit prices" onClose={() => setEditForm(null)}>
          <form onSubmit={submitEdit} className="space-y-4">
            <p className="text-sm text-white/80">{editForm.product.name}</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-white/40">Cost price (₦)</span>
                <input type="number" min="0" step="0.01" value={editForm.costPrice} onChange={(e) => setEditForm({ ...editForm, costPrice: e.target.value })} className={`${inputCls} mt-1.5`} />
              </label>
              <label className="block">
                <span className="text-xs text-white/40">Selling price (₦)</span>
                <input type="number" min="0" step="0.01" required value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className={`${inputCls} mt-1.5`} />
              </label>
            </div>
            <label className="block">
              <span className="text-xs text-white/40">Warn me when stock is at or below</span>
              <input type="number" min="0" step="1" value={editForm.lowStockAt} onChange={(e) => setEditForm({ ...editForm, lowStockAt: e.target.value })} className={`${inputCls} mt-1.5`} />
            </label>
            {Number(editForm.costPrice) > 0 && Number(editForm.price) > 0 && (
              <p className="text-xs text-white/40">
                Profit per bottle:{" "}
                <span className={Number(editForm.price) - Number(editForm.costPrice) >= 0 ? "text-emerald-300" : "text-red-300"}>
                  {naira(Number(editForm.price) - Number(editForm.costPrice))}
                </span>
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditForm(null)} className={btnGhost}>Cancel</button>
              <button disabled={saving} className={btnPrimary}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { PlusIcon, Trash2Icon } from "lucide-react";
import Loading from "@/components/Loading";
import {
  naira,
  PageHeader,
  RangePicker,
  StatCard,
  Modal,
  inputCls,
  btnPrimary,
  btnGhost,
  EXPENSE_CATEGORIES,
} from "@/components/admin/ui";

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = () => ({ category: "DELIVERY", amount: "", description: "", date: today() });

export default function ExpensesPage() {
  const { getToken } = useAuth();
  const [range, setRange] = useState("month");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const auth = async () => ({ headers: { Authorization: `Bearer ${await getToken()}` } });

  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get(`/api/admin/expenses?range=${range}`, await auth());
      setExpenses(data.expenses);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [range]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post("/api/admin/expenses", form, await auth());
      toast.success("Expense recorded");
      setForm(null);
      fetchExpenses();
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (exp) => {
    if (!confirm(`Delete "${exp.description}" (${naira(exp.amount)})?`)) return;
    try {
      await axios.delete(`/api/admin/expenses?id=${exp.id}`, await auth());
      setExpenses((prev) => prev.filter((e) => e.id !== exp.id));
      toast.success("Deleted");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const byCategory = useMemo(() => {
    const t = {};
    expenses.forEach((e) => (t[e.category] = (t[e.category] || 0) + e.amount));
    return t;
  }, [expenses]);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const shown = filter === "ALL" ? expenses : expenses.filter((e) => e.category === filter);

  if (loading) return <Loading />;

  return (
    <div className="text-white/50 pb-24 max-w-6xl">
      <PageHeader eyebrow="Money out" title="Business" accent="Expenses">
        <div className="flex flex-wrap items-center gap-3">
          <RangePicker value={range} onChange={setRange} />
          <button onClick={() => setForm(emptyForm())} className={`${btnPrimary} flex items-center gap-1.5`}>
            <PlusIcon size={16} /> Add expense
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <StatCard label="Total spend" value={naira(total)} />
        {Object.entries(EXPENSE_CATEGORIES).map(([id, label]) => (
          <StatCard key={id} label={label} value={naira(byCategory[id] || 0)} />
        ))}
      </div>

      <div className="flex gap-1.5 flex-wrap mb-4">
        {[["ALL", "All"], ...Object.entries(EXPENSE_CATEGORIES)].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
              filter === id ? "border-[#c97b63] text-white bg-[#c97b63]/10" : "border-white/10 text-white/40 hover:text-white/70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="border border-white/8 rounded-2xl overflow-hidden">
        {shown.length === 0 ? (
          <p className="text-center py-14 text-white/30 text-sm">No expenses in this period.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {shown.map((e) => (
              <div key={e.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-16 text-xs text-white/35 shrink-0">
                  {new Date(e.date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/75 truncate">{e.description}</p>
                  <p className="text-[11px] text-white/30">{EXPENSE_CATEGORIES[e.category]}</p>
                </div>
                <p className="text-sm text-white/80">{naira(e.amount)}</p>
                <button onClick={() => remove(e)} title="Delete" className="p-1.5 rounded-lg text-white/25 hover:text-red-300 hover:bg-red-500/10">
                  <Trash2Icon size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {form && (
        <Modal title="Add expense" onClose={() => setForm(null)}>
          <form onSubmit={submit} className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(EXPENSE_CATEGORIES).map(([id, label]) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setForm({ ...form, category: id })}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    form.category === id ? "border-[#c97b63] text-white bg-[#c97b63]/10" : "border-white/10 text-white/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {form.category === "STOCK_PURCHASE" && (
              <p className="text-xs text-amber-300/70">
                Tip: buying perfume? Use Goods in on the Inventory page instead — it updates stock and adds the expense in one go.
              </p>
            )}
            <label className="block">
              <span className="text-xs text-white/40">What was it for?</span>
              <input
                required
                autoFocus
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Dispatch rider to Lekki, gift boxes x20"
                className={`${inputCls} mt-1.5`}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-white/40">Amount (₦)</span>
                <input
                  required
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className={`${inputCls} mt-1.5`}
                />
              </label>
              <label className="block">
                <span className="text-xs text-white/40">Date</span>
                <input
                  type="date"
                  value={form.date}
                  max={today()}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={`${inputCls} mt-1.5 [color-scheme:dark]`}
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setForm(null)} className={btnGhost}>Cancel</button>
              <button disabled={saving} className={btnPrimary}>{saving ? "Saving…" : "Save expense"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

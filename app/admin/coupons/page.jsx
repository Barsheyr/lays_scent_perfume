"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { PlusIcon, Trash2Icon, PauseIcon, PlayIcon, CopyIcon } from "lucide-react";
import Loading from "@/components/Loading";
import {
  PageHeader,
  Modal,
  inputCls,
  btnPrimary,
  btnGhost,
} from "@/components/admin/ui";

const inDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = () => ({
  code: "",
  discount: "",
  description: "",
  expiresAt: inDays(30),
  maxUses: "",
  forNewUser: false,
  oncePerCustomer: true,
});

const FIRST10 = {
  code: "FIRST10",
  discount: "10",
  description: "10% off for our first 10 customers",
  expiresAt: inDays(30),
  maxUses: "10",
  forNewUser: true,
  oncePerCustomer: true,
};

function statusOf(c) {
  if (!c.isActive) return { label: "Paused", cls: "bg-white/5 text-white/40 border-white/10" };
  if (new Date(c.expiresAt) < new Date()) return { label: "Expired", cls: "bg-red-500/10 text-red-300 border-red-400/20" };
  if (c.maxUses != null && c.used >= c.maxUses) return { label: "Fully used", cls: "bg-amber-500/10 text-amber-300 border-amber-400/20" };
  return { label: "Active", cls: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20" };
}

function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 accent-[#c97b63] w-4 h-4"
      />
      <span>
        <span className="block text-sm text-white/75">{label}</span>
        <span className="block text-xs text-white/35">{hint}</span>
      </span>
    </label>
  );
}

export default function AdminCoupons() {
  const { getToken } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const auth = async () => ({ headers: { Authorization: `Bearer ${await getToken()}` } });

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get("/api/admin/coupons", await auth());
      setCoupons(data.coupons);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post("/api/admin/coupons", form, await auth());
      toast.success(`Coupon ${form.code.toUpperCase()} created`);
      setForm(null);
      fetchCoupons();
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c) => {
    try {
      await axios.patch("/api/admin/coupons", { code: c.code, isActive: !c.isActive }, await auth());
      setCoupons((prev) => prev.map((x) => (x.code === c.code ? { ...x, isActive: !c.isActive } : x)));
      toast.success(c.isActive ? `${c.code} paused` : `${c.code} is live again`);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const remove = async (c) => {
    if (!confirm(`Delete coupon ${c.code}? Orders that already used it keep their discount.`)) return;
    try {
      await axios.delete(`/api/admin/coupons?code=${encodeURIComponent(c.code)}`, await auth());
      setCoupons((prev) => prev.filter((x) => x.code !== c.code));
      toast.success("Coupon deleted");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`${code} copied`);
    } catch {}
  };

  if (loading) return <Loading />;

  const hasFirst10 = coupons.some((c) => c.code === "FIRST10");

  return (
    <div className="text-white/50 pb-24 max-w-6xl">
      <PageHeader eyebrow="Promotions" title="Discount" accent="Coupons">
        <div className="flex flex-wrap gap-2">
          {!hasFirst10 && (
            <button onClick={() => setForm({ ...FIRST10, expiresAt: inDays(30) })} className={btnGhost}>
              Quick setup: FIRST10
            </button>
          )}
          <button onClick={() => setForm(emptyForm())} className={`${btnPrimary} flex items-center gap-1.5`}>
            <PlusIcon size={16} /> New coupon
          </button>
        </div>
      </PageHeader>

      {coupons.length === 0 ? (
        <div className="border border-white/8 bg-white/3 rounded-2xl p-10 text-center">
          <p className="text-white/70 mb-1">No coupons yet</p>
          <p className="text-sm text-white/35">
            Create one, then customers can enter it at checkout for a discount.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {coupons.map((c) => {
            const st = statusOf(c);
            const pct = c.maxUses ? Math.min(100, (c.used / c.maxUses) * 100) : 0;
            return (
              <div key={c.code} className="flex flex-wrap items-center gap-x-6 gap-y-3 border border-white/8 bg-white/3 rounded-2xl px-5 py-4">
                <div className="min-w-[180px] flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg text-white tracking-wider font-medium">{c.code}</p>
                    <button onClick={() => copy(c.code)} aria-label={`Copy ${c.code}`} className="p-1 text-white/30 hover:text-white">
                      <CopyIcon size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-white/35">{c.description}</p>
                </div>
                <p className="text-2xl text-[#c97b63] w-20">{c.discount}%</p>
                <div className="w-40">
                  <p className="text-sm text-white/70">
                    {c.used} {c.maxUses ? `of ${c.maxUses}` : ""} used
                  </p>
                  {c.maxUses ? (
                    <div className="h-1.5 mt-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-[#c97b63] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  ) : (
                    <p className="text-[11px] text-white/30">No limit</p>
                  )}
                </div>
                <div className="text-xs text-white/40 w-40">
                  <p>Ends {new Date(c.expiresAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                  <p>
                    {[c.forNewUser && "First order only", c.oncePerCustomer && "Once per customer"].filter(Boolean).join(" · ") || "Anyone, any time"}
                  </p>
                </div>
                <span className={`text-[11px] px-2.5 py-1 rounded-full border ${st.cls}`}>{st.label}</span>
                <div className="ml-auto flex gap-1">
                  <button
                    onClick={() => toggleActive(c)}
                    aria-label={c.isActive ? `Pause ${c.code}` : `Resume ${c.code}`}
                    title={c.isActive ? "Pause" : "Resume"}
                    className="p-2 rounded-lg text-white/50 hover:bg-white/5 hover:text-white"
                  >
                    {c.isActive ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                  </button>
                  <button
                    onClick={() => remove(c)}
                    aria-label={`Delete ${c.code}`}
                    title="Delete"
                    className="p-2 rounded-lg text-white/40 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2Icon size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {form && (
        <Modal title="New coupon" onClose={() => setForm(null)}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-white/40">Code</span>
                <input
                  required
                  autoFocus
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, "") })}
                  placeholder="FIRST10"
                  maxLength={20}
                  className={`${inputCls} mt-1.5 uppercase tracking-wider`}
                />
              </label>
              <label className="block">
                <span className="text-xs text-white/40">Discount (%)</span>
                <input
                  required
                  type="number"
                  min="1"
                  max="90"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  placeholder="10"
                  className={`${inputCls} mt-1.5`}
                />
              </label>
            </div>
            <label className="block">
              <span className="text-xs text-white/40">Description (shown to customers)</span>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="10% off for our first 10 customers"
                className={`${inputCls} mt-1.5`}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-white/40">Ends on</span>
                <input
                  required
                  type="date"
                  min={today()}
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className={`${inputCls} mt-1.5 [color-scheme:dark]`}
                />
              </label>
              <label className="block">
                <span className="text-xs text-white/40">Total uses allowed</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  placeholder="No limit"
                  className={`${inputCls} mt-1.5`}
                />
              </label>
            </div>
            <div className="space-y-3 pt-1">
              <Toggle
                checked={form.oncePerCustomer}
                onChange={(v) => setForm({ ...form, oncePerCustomer: v })}
                label="Once per customer"
                hint="Each account can use this code only one time"
              />
              <Toggle
                checked={form.forNewUser}
                onChange={(v) => setForm({ ...form, forNewUser: v })}
                label="First order only"
                hint="Only for customers who haven't ordered before"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setForm(null)} className={btnGhost}>Cancel</button>
              <button disabled={saving} className={btnPrimary}>{saving ? "Saving…" : "Create coupon"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

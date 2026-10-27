"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const POLL_MS = 30000;
const SEEN_KEY = "ls_admin_last_order_seen";

function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.18].forEach((t) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.15);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.16);
    });
  } catch {}
}

const naira = (n) => "₦" + Number(n || 0).toLocaleString("en-NG");

// Polls for new orders; returns the number waiting for action
export default function useOrderAlerts() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [needsAction, setNeedsAction] = useState(0);
  const lastSeen = useRef(null);

  useEffect(() => {
    try {
      lastSeen.current = localStorage.getItem(SEEN_KEY);
    } catch {}

    let stopped = false;
    const check = async () => {
      try {
        const token = await getToken();
        const res = await fetch("/api/admin/notifications", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok || stopped) return;
        const data = await res.json();
        setNeedsAction(data.needsAction);
        document.title =
          data.needsAction > 0 ? `(${data.needsAction}) Layah's Scent Admin` : "Layah's Scent Admin";

        const newest = data.latest?.[0]?.createdAt;
        if (!newest) return;
        if (lastSeen.current) {
          const fresh = data.latest.filter(
            (o) => new Date(o.createdAt) > new Date(lastSeen.current)
          );
          fresh.reverse().forEach((o) => {
            const who = o.address?.name || "a customer";
            const msg = `New order from ${who} — ${naira(o.total)}`;
            toast.success(msg, { duration: 8000, icon: "🛍" });
            if (typeof Notification !== "undefined" && Notification.permission === "granted") {
              const n = new Notification("Layah's Scent — new order", { body: msg });
              n.onclick = () => {
                window.focus();
                router.push(`/admin/orders?open=${o.id}`);
              };
            }
          });
          if (fresh.length) beep();
        }
        lastSeen.current = newest;
        try {
          localStorage.setItem(SEEN_KEY, newest);
        } catch {}
      } catch {}
    };

    check();
    const timer = setInterval(check, POLL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, []);

  return needsAction;
}

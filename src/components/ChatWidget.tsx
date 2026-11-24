"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";

type ChatMsg = {
  id: string;
  from: "user" | "bot";
  text: string;
  complaintId?: string;
  status?: string;
  tick?: "sent";
};

type Complaint = { id: string; status: string; topic: string; message: string; updatedAt?: string };
type Order = { id: string; createdAt: string; status: string; total: number; items: { name: string; qty: number }[] };
type FlowKind = "cancel" | "return" | "refund" | "support";
type Pending =
  | { kind: "cancel" | "return" | "refund"; orderId?: string }
  | { kind: "support"; issue: string }
  | null;

const QUICK_REPLIES = [
  { label: "Track my order", action: "orders" },
  { label: "Cancel an order", action: "cancel" },
  { label: "Start a return", action: "return" },
  { label: "Ask the concierge", action: "support" },
] as const;

let seq = 1;
const nid = (p: string) => `${p}${seq++}`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "g1", from: "bot", text: "Welcome to REWEAR. I'm the concierge — ask about orders, repairs, returns or fit." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [, setFlow] = useState<{ kind: FlowKind } | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastNotified = useRef("");

  function pushUser(text: string): string {
    const id = nid("u");
    setMessages((m) => [...m, { id, from: "user", text }]);
    return id;
  }

  function markSent(id: string) {
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, tick: "sent" as const } : x)));
  }

  function pushBot(text: string, complaintId?: string, status?: string) {
    setMessages((m) => [...m, { id: nid("b"), from: "bot", text, complaintId, status }]);
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, typing]);

  useEffect(() => {
    if (!open) return;
    let stop = false;

    async function poll() {
      try {
        const r = await fetch("/api/support/complaints", { cache: "no-store" });
        const d = await r.json();
        const cs = ((d?.complaints || []) as Complaint[]).slice().sort((a, b) => {
          const ta = new Date(a.updatedAt || 0).getTime();
          const tb = new Date(b.updatedAt || 0).getTime();
          return tb - ta;
        });
        const latest = cs[0];
        if (!latest || stop) return;
        const key = `${latest.id}:${latest.status}`;
        if (!lastNotified.current) {
          lastNotified.current = key;
          return;
        }
        if (key !== lastNotified.current) {
          lastNotified.current = key;
          pushBot(`Update: request ${latest.id} is now "${latest.status}".`, latest.id, latest.status);
        }
      } catch {}
    }

    void poll();
    const t = setInterval(poll, 20000);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [open]);

  async function lookupLatestOrder(): Promise<Order | null> {
    try {
      const r = await fetch("/api/orders/mine", { cache: "no-store" });
      const d = await r.json();
      const orders = ((d?.orders || []) as Order[]).slice().sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return orders[0] || null;
    } catch {
      return null;
    }
  }

  async function createTicket(topic: string, message: string, orderId?: string, userMsgId?: string) {
    setBusy(true);
    setTyping(true);
    try {
      const r = await fetch("/api/support/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, message, orderId }),
      });
      const d = await r.json();
      if (r.ok && d?.complaint) {
        if (userMsgId) markSent(userMsgId);
        pushBot(`Request ${d.complaint.id} logged with status "${d.complaint.status}". The REWEAR team will review it shortly.`, d.complaint.id, d.complaint.status);
        setFlow(null);
        setPending(null);
      } else {
        pushBot(d?.error || "Sorry, something went wrong. Please try again.");
      }
    } catch {
      pushBot("Sorry, I could not send that. Please check your connection and try again.");
    } finally {
      setTyping(false);
      setBusy(false);
    }
  }

  async function startOrderFlow(kind: "cancel" | "return" | "refund") {
    setTyping(true);
    const order = await lookupLatestOrder();
    setTyping(false);
    if (!order) {
      pushBot("I couldn't find any orders on your account yet, so there's nothing to " + kind + ".");
      return;
    }
    setFlow({ kind });
    setPending({ kind, orderId: order.id });
    pushBot(
      `Your latest order is ${order.id} · ${order.status} · ₹${order.total}. Would you like to submit a ${kind} request for this order?`
    );
  }

  async function showOrderStatus() {
    setTyping(true);
    const order = await lookupLatestOrder();
    setTyping(false);
    if (!order) {
      pushBot("I couldn't find any orders on your account yet. If you just placed one, give it a moment and try again.");
      return;
    }
    const items = order.items.map((i) => `${i.name} ×${i.qty}`).join(", ");
    pushBot(
      `Latest order: ${order.id} · ${order.status} · ₹${order.total} · Placed ${new Date(order.createdAt).toLocaleString()}. Items: ${items}.`
    );
  }

  function confirmPending(action: "yes" | "no") {
    if (!pending) return;
    pushUser(action === "yes" ? "Yes, submit it" : "No, cancel");
    if (action === "no") {
      setPending(null);
      setFlow(null);
      pushBot("No problem — nothing was submitted.");
      return;
    }
    if (pending.kind === "support") {
      void createTicket("other", pending.issue || "Support request");
    } else {
      const verb = pending.kind;
      void createTicket(verb, `${verb[0].toUpperCase() + verb.slice(1)} request for order ${pending.orderId}`, pending.orderId);
    }
  }

  async function handleSend(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    setInput("");

    if (pending) {
      const t = text.toLowerCase();
      if (["y", "yes", "yeah", "ok", "okay", "confirm", "sure"].some((w) => t.includes(w))) {
        confirmPending("yes");
      } else if (["n", "no", "nope", "cancel", "stop"].some((w) => t.includes(w))) {
        confirmPending("no");
      } else {
        pushUser(text);
        pushBot("Please tap Yes to submit or No to cancel.");
      }
      return;
    }

    pushUser(text);
    setFlow(null);
    setPending({ kind: "support", issue: text });
    pushBot("Got it. Should I log this with the REWEAR support team?");
  }

  function handleQuick(label: string, action: (typeof QUICK_REPLIES)[number]["action"]) {
    if (busy) return;
    pushUser(label);
    if (action === "orders") void showOrderStatus();
    else if (action === "support") {
      setFlow({ kind: "support" });
      pushBot("Tell me briefly what happened and I'll log it with the support team.");
    } else {
      void startOrderFlow(action);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close concierge" : "Open concierge"}
        className="fixed bottom-5 right-5 z-[90] flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-carbon/90 text-chrome shadow-2xl shadow-black/50 backdrop-blur-xl transition-transform duration-300 hover:scale-105 hover:border-violet/50 sm:bottom-6 sm:right-6"
      >
        {open ? (
          <Icon name="close" size={19} />
        ) : (
          <span className="relative flex h-5 w-5 items-center justify-center">
            <Icon name="sparkle" size={19} className="text-violet-bright" />
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-violet-bright animate-pulse-dot" />
          </span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 z-[90] flex h-[68vh] max-h-[620px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/12 bg-carbon/95 shadow-2xl shadow-black/70 backdrop-blur-2xl sm:bottom-24 sm:right-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] p-4">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-silver/40">Always on</p>
              <p className="mt-0.5 text-sm font-semibold text-chrome">REWEAR Concierge</p>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/35">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-bright animate-pulse-dot" />
              Live
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-white/[0.015] p-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  m.from === "user"
                    ? "self-end rounded-br-sm bg-violet text-void"
                    : "self-start rounded-bl-sm border border-white/[0.08] bg-white/[0.035] text-silver/80"
                }`}
              >
                {m.text}
                {m.from === "user" && m.tick === "sent" && (
                  <span className="ml-1 text-[11px] text-void/60">✓</span>
                )}
                {m.complaintId && (
                  <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] opacity-60">
                    {m.complaintId} · {m.status}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex max-w-[86%] items-center gap-1 self-start rounded-2xl rounded-bl-sm border border-white/[0.08] bg-white/[0.035] px-3 py-3">
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    className="h-1.5 w-1.5 animate-chat-typing rounded-full bg-violet-bright/60"
                    style={{ animationDelay: `${n * 0.15}s` }}
                  />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-white/[0.08] p-2.5">
            {pending ? (
              <>
                <button
                  onClick={() => confirmPending("yes")}
                  className="rounded-full bg-violet px-3 py-1.5 text-[11px] font-semibold text-void transition hover:bg-violet-bright"
                >
                  Yes, submit
                </button>
                <button
                  onClick={() => confirmPending("no")}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-silver/70 transition hover:bg-white/5"
                >
                  No, cancel
                </button>
              </>
            ) : (
              QUICK_REPLIES.map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleQuick(q.label, q.action)}
                  className="rounded-full border border-white/10 bg-violet/[0.08] px-2.5 py-1.5 text-[10px] font-medium text-violet-bright transition hover:border-violet/40 hover:bg-violet/15"
                >
                  {q.label}
                </button>
              ))
            )}
          </div>

          <div className="flex gap-2 border-t border-white/[0.08] p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleSend(input);
              }}
              placeholder={pending ? "Tap Yes or No above…" : "Ask about orders, repairs, fit…"}
              className="field py-2 text-xs"
              aria-label="Message"
            />
            <button
              onClick={() => void handleSend(input)}
              disabled={busy}
              className="shrink-0 rounded-full bg-violet px-4 py-2 text-xs font-semibold text-void transition hover:bg-violet-bright disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

type ChatMsg = { id: string; from: "user" | "bot"; text: string; complaintId?: string; status?: string; tick?: "sent" | "delivered" | "read" };
type Complaint = { id: string; status: string; topic: string; message: string };
type FlowKind = "cancel" | "return" | "refund" | "support";
type Pending = { kind: FlowKind; orderId?: string; issue?: string; order?: { id: string; createdAt: string; status: string; total: number; items: { name: string; qty: number }[] } } | null;

const QUICK_REPLIES = [
  { label: "Where is my order?", topic: "order", message: "Where is my order?" },
  { label: "Cancel my order", topic: "cancel", message: "I would like to cancel my order." },
  { label: "Request a return", topic: "return", message: "I would like to request a return." },
  { label: "Talk to support", topic: "other", message: "I need help from a support agent." },
];

const CONFIRM_QUICKS = [
  { label: "No", value: "no" },
  { label: "Cancel", value: "yes" },
];

let chatSeq = 1;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([{ id: "g1", from: "bot", text: "Hi! I'm PawBot 🐾 ... How can I help you today?" }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [flow, setFlow] = useState<{ kind: FlowKind; orderId?: string } | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastNotifiedRef = useRef<string>("");

  useEffect(() => {
    if (!open) return;
    setInput("");
    (async () => {
      try {
        const r = await fetch("/api/support/complaints", { cache: "no-store" });
        const d = await r.json();
        const cs = d?.complaints || [];
        const latest = cs[0];
        if (latest) {
          setActiveComplaint(latest);
          lastNotifiedRef.current = `${latest.id}:${latest.status}`;
        }
      } catch {}
    })();
    const t = setInterval(async () => {
      try {
        const r = await fetch("/api/support/complaints", { cache: "no-store" });
        const d = await r.json();
        const cs = d?.complaints || [];
        const latest = cs[0];
        if (latest) {
          const key = `${latest.id}:${latest.status}`;
          if (key !== lastNotifiedRef.current) {
            lastNotifiedRef.current = key;
            setActiveComplaint(latest);
            setMessages((m) => [
              ...m,
              { id: "n" + chatSeq++, from: "bot" as const, text: `Update: your complaint ${latest.id} status is now ${latest.status}.`, complaintId: latest.id, status: latest.status },
            ]);
          }
        }
      } catch {}
    }, 20000);
    return () => clearInterval(t);
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, typing]);

  function addBot(text: string, complaintId?: string, status?: string) {
    setMessages((m) => [...m, { id: "b" + chatSeq++, from: "bot" as const, text, complaintId, status }]);
  }

  function addUser(text: string, tick?: "sent" | "delivered" | "read", id?: string) {
    setMessages((m) => [...m, { id: id || ("u" + chatSeq++), from: "user" as const, text, tick }]);
  }

  async function lookupOrder(): Promise<{ id: string; createdAt: string; status: string; total: number; items: { name: string; qty: number }[] } | null> {
    try {
      const r = await fetch("/api/orders/mine", { cache: "no-store" });
      const d = await r.json();
      const rawOrders: { id: string; createdAt: string; status: string; total: number; items: { name: string; qty: number }[] }[] = (d?.orders || []) as { id: string; createdAt: string; status: string; total: number; items: { name: string; qty: number }[] }[];
      const orders = rawOrders.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (!orders.length) {
        addBot("I could not find any orders on your account yet. If you just placed one, give me a minute!");
        return null;
      }
      const o = orders[0];
      addBot(`Latest order: ${o.id} · ${o.status} · ₹${o.total} · Placed ${new Date(o.createdAt).toLocaleString()}. Items: ${o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}.`);
      return o;
    } catch {
      addBot("Sorry, I could not look up your orders right now.");
      return null;
    } finally {
      setTyping(false);
    }
  }

  async function send(text: string, topic?: string) {
    const t = text.trim();
    if (!t) return;
    setSending(true);
    setTyping(true);
    const userMsgId = "u" + chatSeq++;
    addUser(t, "sent", userMsgId);
    setInput("");
    try {
      const r = await fetch("/api/support/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic || "other", message: t }),
      });
      const d = await r.json();
      if (r.ok) {
        const c = d?.complaint;
        setActiveComplaint(c);
        setFlow(null);
        setPending(null);
        addBot(`Complaint ${c.id} filed. Status: ${c.status}. Our team will review it shortly.`, c.id, c.status);
        setMessages((m) => m.map((x) => (x.id === userMsgId ? { ...x, tick: "delivered" as const } : x)));
        setMessages((m) => m.map((x) => (x.id === userMsgId ? { ...x, tick: "read" as const } : x)));
      } else {
        addBot(d?.error || "Sorry, something went wrong. Please try again.");
      }
    } catch {
      addBot("Sorry, I could not send that. Please try again.");
    }
    setSending(false);
    setTyping(false);
  }

  function startFlow(kind: FlowKind, orderId?: string) {
    setFlow({ kind, orderId: orderId || undefined });
    setPending(null);
    if (kind === "cancel") addBot("Sure — I can help you cancel your order. Please share your order ID (e.g., PB-XXXXXX-XXXX) so I can prepare the cancellation.");
    else if (kind === "return") addBot("Sure — I can help you request a return. Please share the order ID you'd like to return.");
    else if (kind === "refund") addBot("Sure — I can help you request a refund. Please share the order ID.");
    else addBot("Sure — how can we help? Tell us briefly what happened, and we'll raise a support ticket for you.");
  }

  async function handleUserSend(text: string) {
    const t = text.trim();
    if (!t) return;
    addUser(t);
    if (flow) {
      if (flow.kind === "cancel" || flow.kind === "return" || flow.kind === "refund") {
        const orderId = t.trim();
        const o = await lookupOrder();
        const finalId = o?.id || orderId;
        setFlow({ kind: flow.kind, orderId: finalId });
        setPending({ kind: flow.kind, orderId: finalId, order: o || undefined });
        addBot(`Please review your ${flow.kind} request for order ${finalId}. If everything looks right, confirm to submit the ticket.`);
        return;
      }
      if (flow.kind === "support") {
        const issue = t.trim();
        setPending({ kind: "support", issue });
        addBot(`Thanks — I've noted your request. Summary: ${issue}. Confirm below to raise a support ticket.`);
        return;
      }
    }
    await send(t, "other");
  }

  function confirmPending(action: "yes" | "no") {
    if (!pending) return;
    if (action === "no") {
      setFlow(null);
      setPending(null);
      addBot("No problem — nothing was submitted. Your request was not raised.");
      return;
    }
    if (pending.kind === "cancel") void createComplaint("cancel", `Cancel order ${pending.orderId}`, pending.orderId);
    else if (pending.kind === "return") void createComplaint("return", `Return request for order ${pending.orderId}`, pending.orderId);
    else if (pending.kind === "refund") void createComplaint("refund", `Refund request for order ${pending.orderId}`, pending.orderId);
    else if (pending.kind === "support") void createComplaint("other", pending.issue || "Support request");
  }

  async function createComplaint(topic: string, message: string, orderId?: string) {
    const r = await fetch("/api/support/complaints", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, message, orderId }) });
    const d = await r.json();
    if (r.ok) {
      const c = d?.complaint;
      setActiveComplaint(c);
      setFlow(null);
      setPending(null);
      addBot(`Complaint ${c.id} filed. Status: ${c.status}. Our team will review it shortly.`, c.id, c.status);
    } else {
      addBot(d?.error || "Sorry, something went wrong. Please try again.");
    }
  }

  async function handleQuick(q: { label: string; topic: string; message: string }) {
    addUser(q.label);
    if (q.label === "Where is my order?") {
      await lookupOrder();
      return;
    }
    if (q.label === "Cancel my order") {
      startFlow("cancel");
      return;
    }
    if (q.label === "Request a return") {
      startFlow("return");
      return;
    }
    if (q.label === "Talk to support") {
      startFlow("support");
      return;
    }
    await send(q.message, q.topic);
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open support chat"
        className="fixed bottom-6 right-6 z-[10000] w-14 h-14 rounded-full bg-berry text-white shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition"
      >
        💬
      </button>
      {open && (
        <div className="fixed bottom-24 right-4 z-[10000] w-[92vw] max-w-sm h-[70vh] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-berry text-white p-3 flex items-center justify-between">
            <div className="font-bold text-sm">Paw Support 🐾</div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-white text-lg">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-slate-50">
            {typing && (
              <div className="max-w-[85%] px-3 py-2 rounded-2xl bg-white border border-slate-100 rounded-bl-sm self-start flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-chat-typing" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-chat-typing" style={{ animationDelay: "0.15s" }} />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-chat-typing" style={{ animationDelay: "0.3s" }} />
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${m.from === "user" ? "bg-berry text-white rounded-br-sm self-end" : "bg-white border border-slate-100 text-navy rounded-bl-sm self-start"}`}>
                {m.text}
                {m.from === "user" && m.tick && (
                  <span className="ml-1 inline-block text-[11px] font-bold" style={{ color: m.tick === "read" ? "#53bdeb" : "#25d366" }}>
                    {m.tick === "sent" ? "✓" : "✓✓"}
                  </span>
                )}
                {m.complaintId && <div className="text-[10px] mt-1 opacity-70">Complaint {m.complaintId} · {m.status}</div>}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          {pending ? (
            <div className="p-2 border-t border-slate-100 flex flex-wrap gap-2">
              {CONFIRM_QUICKS.map((q) => (
                <button key={q.value} onClick={() => confirmPending(q.value as "yes" | "no")} className="px-3 py-1.5 rounded-full bg-berry text-white text-xs font-semibold hover:bg-berry-dark transition">
                  {q.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-2 border-t border-slate-100 flex flex-wrap gap-2">
              {QUICK_REPLIES.map((q) => (
                <button key={q.label} onClick={() => handleQuick(q)} className="px-3 py-1.5 rounded-full bg-berry/10 text-berry text-xs font-semibold hover:bg-berry/20 transition">
                  {q.label}
                </button>
              ))}
            </div>
          )}
          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleUserSend(input);
              }}
              placeholder={pending ? "Type your confirmation..." : "Describe your issue..."}
              className="flex-1 px-3 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-berry"
            />
            <button onClick={() => void handleUserSend(input)} disabled={sending} className="px-4 py-2 rounded-full bg-berry text-white text-sm font-semibold hover:bg-berry-dark transition disabled:opacity-60">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

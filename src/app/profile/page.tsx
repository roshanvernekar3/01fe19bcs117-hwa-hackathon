"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import Loader from "@/components/Loader";
import AvatarViewer from "@/components/AvatarViewer";
import Icon from "@/components/ui/Icon";

type Me = { user: { email: string; name: string; role: string; avatar?: string } | null; isAdmin: boolean };

const GLYPHS = ["◈", "◇", "◉", "⌁", "✦", "⬡", "◎", "⌇", "▣", "◐", "✧", "⬢"];
const DEFAULT_GLYPH = "◈";

const statusStyles: Record<string, string> = {
  received: "border-violet/30 bg-violet/10 text-violet-bright",
  processing: "border-violet/30 bg-violet/10 text-violet-bright",
  shipped: "border-sky-300/25 bg-sky-400/[0.07] text-sky-200/80",
  delivered: "border-emerald-300/25 bg-emerald-400/[0.07] text-emerald-200/80",
  cancelled: "border-red-300/20 bg-red-400/[0.06] text-red-200/80",
};

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"profile" | "orders" | "wishlist">(() => {
    if (typeof window === "undefined") return "profile";
    const t = new URLSearchParams(window.location.search).get("tab");
    return t === "orders" || t === "wishlist" ? t : "profile";
  });
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string>("");
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<string | null>(null);
  const [viewerSrc, setViewerSrc] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<
    { id: string; label: string; name: string; phone: string; address: string; city: string; zip: string; country: string; isDefault: boolean }[]
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const m = await fetch("/api/auth/me", { cache: "no-store" }).then((r) => r.json());
        setMe(m);
        if (m?.user?.email) {
          const savedAvatar = m.user.avatar || DEFAULT_GLYPH;
          setAvatar(savedAvatar);
          setPreviewAvatar(null);
          const res = await fetch("/api/orders/mine", { cache: "no-store" });
          if (res.ok) {
            const d = await res.json();
            setOrders(d.orders || []);
          }
          const ar = await fetch("/api/addresses", { cache: "no-store" });
          if (ar.ok) {
            const ad = await ar.json();
            setAddresses(ad.addresses || []);
          }
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  async function removeAddress(id: string) {
    if (!confirm("Remove this address?")) return;
    const res = await fetch(`/api/addresses?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const d = await res.json();
    if (res.ok) setAddresses(d.addresses || []);
  }

  async function makeDefaultAddress(id: string) {
    const res = await fetch("/api/addresses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const d = await res.json();
    if (res.ok) setAddresses(d.addresses || []);
  }

  async function cancelOrder(id: string) {
    if (!confirm("Cancel this order?")) return;
    setCancelling(id);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "cancelled" }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setCancelling(null);
    }
  }

  if (loading) return <div className="pt-40"><Loader message="Loading your profile…" /></div>;

  if (!me?.user) {
    return (
      <div className="relative flex min-h-[70vh] items-center pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="container-x flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/12 text-silver/40">
            <Icon name="user" size={26} />
          </span>
          <p className="eyebrow mt-6">Account / locked</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-chrome">Please log in</h1>
          <p className="mt-3 max-w-sm text-sm text-silver/45">
            An account keeps your orders, saved pieces and repair history in one place.
          </p>
          <div className="mt-7 flex gap-3">
            <Link href="/login" className="btn btn-primary btn-sm">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-ghost btn-sm">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const user = me.user;
  const displayAvatar = previewAvatar ?? avatar;
  const isUploadedImage = !!displayAvatar && (displayAvatar.startsWith("http") || displayAvatar.startsWith("data:"));
  const isEmojiOnly = !displayAvatar || (!displayAvatar.startsWith("http") && !displayAvatar.startsWith("data:"));
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function saveEmojiAvatar() {
    setSavingAvatar(true);
    setAvatarMsg(null);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Could not save avatar");
      setAvatar(d.user.avatar);
      setPreviewAvatar(null);
      setAvatarMsg("Saved.");
    } catch (err) {
      setAvatarMsg(err instanceof Error ? err.message : "Could not save avatar");
    } finally {
      setSavingAvatar(false);
    }
  }

  async function handlePhotoUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      setAvatarMsg("Please choose an image file.");
      return;
    }
    setAvatarMsg(null);
    setSavingAvatar(true);
    try {
      const dataUrl = await compressImage(file, 512, 0.85);
      setPreviewAvatar(dataUrl);
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: dataUrl }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Could not save avatar");
      setAvatar(d.user.avatar);
      setPreviewAvatar(null);
      setAvatarMsg("Saved.");
    } catch (err) {
      setPreviewAvatar(null);
      setAvatarMsg(err instanceof Error ? err.message : "Could not save avatar");
    } finally {
      setSavingAvatar(false);
    }
  }

  async function removeUploadedPhoto() {
    setAvatarMsg(null);
    setSavingAvatar(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: DEFAULT_GLYPH }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Could not remove avatar");
      setAvatar(d.user.avatar || DEFAULT_GLYPH);
      setPreviewAvatar(null);
      setAvatarMsg("Photo removed.");
    } catch (err) {
      setAvatarMsg(err instanceof Error ? err.message : "Could not remove avatar");
    } finally {
      setSavingAvatar(false);
    }
  }

  return (
    <div className="relative pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute left-1/4 top-0 h-64 w-96 rounded-full bg-violet/10 blur-[110px]" />
      </div>

      <div className="container-x max-w-5xl pb-24">
        {/* Header */}
        <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.1] bg-white/[0.025] p-5 sm:flex-row sm:items-center sm:p-6">
          <button
            type="button"
            onClick={() => {
              if (isUploadedImage) setViewerSrc(displayAvatar);
            }}
            className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet/30 bg-violet/10 text-3xl text-violet-bright"
            aria-label={isUploadedImage ? "View profile photo" : "Profile glyph"}
          >
            {isUploadedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={displayAvatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <span>{displayAvatar || initials || DEFAULT_GLYPH}</span>
            )}
          </button>

          <div className="flex-1 text-center sm:text-left">
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-violet-bright/70">
              Member / {user.role}
            </p>
            <h1 className="mt-1 text-2xl font-medium tracking-tight text-chrome sm:text-3xl">{user.name}</h1>
            <p className="mt-0.5 text-sm text-silver/45">{user.email}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
            <Link href="/orders" className="btn btn-ghost btn-sm">
              <Icon name="truck" size={13} /> Track order
            </Link>
            {me.isAdmin && (
              <Link href="/admin" className="btn btn-primary btn-sm">
                Ops console
              </Link>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 border-b border-white/[0.08]">
          {(["profile", "orders", "wishlist"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] transition ${
                tab === t
                  ? "border-violet text-violet-bright"
                  : "border-transparent text-silver/35 hover:text-chrome"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "profile" && (
          <div className="mt-6 space-y-4">
            <section className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5 sm:p-6">
              <h2 className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/45">Identity mark</h2>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet/30 bg-violet/10 text-3xl text-violet-bright">
                  {isUploadedImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={displayAvatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    displayAvatar || initials
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-silver/30">
                    Choose a glyph or upload a photo
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {GLYPHS.map((glyph) => (
                      <button
                        key={glyph}
                        onClick={() => {
                          setAvatar(glyph);
                          setPreviewAvatar(null);
                        }}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border text-base transition ${
                          avatar === glyph && !previewAvatar
                            ? "border-violet bg-violet/15 text-violet-bright"
                            : "border-white/10 text-silver/50 hover:border-violet/40 hover:text-chrome"
                        }`}
                        aria-label={`Use glyph ${glyph}`}
                        aria-pressed={avatar === glyph && !previewAvatar}
                      >
                        {glyph}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="btn btn-ghost btn-sm cursor-pointer">
                  {savingAvatar && previewAvatar ? "Uploading…" : "Change photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={savingAvatar}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) handlePhotoUpload(file);
                    }}
                  />
                </label>

                {isEmojiOnly && !savingAvatar && (
                  <button onClick={saveEmojiAvatar} className="btn btn-primary btn-sm">
                    Save glyph
                  </button>
                )}

                {isUploadedImage && !savingAvatar && (
                  <button
                    onClick={removeUploadedPhoto}
                    className="rounded-full border border-red-400/25 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-red-300 transition hover:bg-red-500/10"
                  >
                    Remove photo
                  </button>
                )}

                {savingAvatar && <span className="text-xs text-silver/40">Saving…</span>}
              </div>

              {avatarMsg && (
                <p
                  className={`mt-3 text-xs ${
                    avatarMsg.includes("Saved") || avatarMsg.includes("removed")
                      ? "text-violet-bright"
                      : "text-red-300"
                  }`}
                  role="status"
                >
                  {avatarMsg}
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5 sm:p-6">
              <h2 className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/45">Account details</h2>
              <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-silver/30">Name</p>
                  <p className="mt-1 text-chrome">{user.name}</p>
                </div>
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-silver/30">Email</p>
                  <p className="mt-1 text-chrome">{user.email}</p>
                </div>
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-silver/30">Role</p>
                  <p className="mt-1 capitalize text-chrome">{user.role}</p>
                </div>
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-silver/30">Member since</p>
                  <p className="mt-1 text-chrome">{new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-4 border-t border-white/[0.08] pt-4">
                <Link href="/orders" className="font-mono text-[9px] uppercase tracking-[0.14em] text-violet-bright hover:text-chrome">
                  View all orders →
                </Link>
                <Link href="/wishlist" className="font-mono text-[9px] uppercase tracking-[0.14em] text-silver/40 hover:text-chrome">
                  View wishlist →
                </Link>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/45">Saved addresses</h2>
                <Link href="/checkout" className="font-mono text-[8px] uppercase tracking-[0.14em] text-violet-bright hover:text-chrome">
                  Add at checkout →
                </Link>
              </div>
              {addresses.length === 0 ? (
                <p className="mt-3 text-sm text-silver/40">
                  No saved addresses yet. Tick &ldquo;Save this address&rdquo; at checkout and it will appear here.
                </p>
              ) : (
                <div className="mt-4 space-y-2.5">
                  {addresses.map((a) => (
                    <div key={a.id} className="rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-sm font-medium text-chrome">
                          {a.label}
                          {a.isDefault && (
                            <span className="rounded-full bg-violet/15 px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-violet-bright">
                              Default
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.12em]">
                          {!a.isDefault && (
                            <button onClick={() => makeDefaultAddress(a.id)} className="text-violet-bright hover:text-chrome">
                              Make default
                            </button>
                          )}
                          <button onClick={() => removeAddress(a.id)} className="text-silver/30 hover:text-red-300">
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-silver/45">
                        {a.name} · {a.phone}
                        <br />
                        {a.address}, {a.city} {a.zip}, {a.country}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {tab === "orders" && (
          <div className="mt-6 space-y-3">
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/12 px-6 py-14 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/12 text-silver/40">
                  <Icon name="bag" size={20} />
                </span>
                <p className="mt-4 text-sm text-silver/45">No orders yet.</p>
                <Link href="/products" className="btn btn-primary btn-sm mt-5">
                  Explore Drop 01 <Icon name="arrow-right" size={13} />
                </Link>
              </div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/orders/${encodeURIComponent(o.id)}`}
                        className="font-mono text-xs uppercase tracking-[0.12em] text-chrome hover:text-violet-bright"
                      >
                        {o.id}
                      </Link>
                      <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/30">
                        {new Date(o.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-chrome">{formatPrice(o.total)}</span>
                      <span
                        className={`rounded-full border px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.12em] ${
                          statusStyles[o.status] ?? statusStyles.received
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-silver/50">
                    {o.items.map((i) => `${i.name} ×${i.qty}`).join(" · ")}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-white/[0.06] pt-3">
                    <Link
                      href={`/orders/${encodeURIComponent(o.id)}`}
                      className="font-mono text-[9px] uppercase tracking-[0.14em] text-violet-bright hover:text-chrome"
                    >
                      View details →
                    </Link>
                    {o.status !== "cancelled" && o.status !== "delivered" && o.status !== "shipped" && (
                      <button
                        onClick={() => cancelOrder(o.id)}
                        disabled={cancelling === o.id}
                        className="font-mono text-[9px] uppercase tracking-[0.14em] text-silver/30 hover:text-red-300 disabled:opacity-50"
                      >
                        {cancelling === o.id ? "Cancelling…" : "Cancel order"}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "wishlist" && (
          <div className="mt-6 rounded-2xl border border-white/[0.09] bg-white/[0.02] px-6 py-14 text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver/35">
              Your saved pieces live here
            </p>
            <Link href="/wishlist" className="btn btn-primary btn-sm mt-5">
              Open wishlist <Icon name="heart" size={13} />
            </Link>
          </div>
        )}

        {viewerSrc && <AvatarViewer src={viewerSrc} onClose={() => setViewerSrc(null)} />}
      </div>
    </div>
  );
}

function compressImage(file: File, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Could not process image"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

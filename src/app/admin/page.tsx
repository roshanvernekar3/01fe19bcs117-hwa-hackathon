"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";

type AdminOrder = {
  id: string;
  createdAt: string;
  customer: { name: string; email: string; phone?: string; address: string; city: string; zip: string; country: string };
  items: { name: string; qty: number }[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState("");

  async function loadProducts() {
    const res = await fetch("/api/admin/products", { cache: "no-store" });
    const d = await res.json();
    setProducts(d.products || []);
  }
  async function loadOrders() {
    const res = await fetch("/api/orders", { cache: "no-store" });
    const d = await res.json();
    setOrders(d.orders || []);
  }

  useEffect(() => {
    (async () => {
      await loadProducts();
      await loadOrders();
      setLoading(false);
    })();
  }, []);

  async function deleteProduct(slug: string) {
    if (!confirm(`Delete ${slug}?`)) return;
    await fetch(`/api/admin/products?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    await loadProducts();
  }

  async function saveProduct(p: Partial<Product> & { featuresInput?: string }) {
    const payload: Record<string, unknown> = { ...p };
    if (p.featuresInput !== undefined) {
      payload.features = String(p.featuresInput).split(",").map((s) => s.trim()).filter(Boolean);
      delete payload.featuresInput;
    }
    const isEdit = !!p.slug && products.some((x) => x.slug === p.slug);
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const d = await res.json();
    if (!res.ok) {
      setMsg(d.error || "Save failed");
      return;
    }
    setMsg("Saved!");
    setEditing(null);
    setCreating(false);
    await loadProducts();
  }

  if (loading) return <div className="p-10 text-center text-slate-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-navy">Admin Dashboard</h1>
        <button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login"; }} className="px-4 py-2 rounded-full border border-slate-200 text-sm hover:bg-slate-50">Logout</button>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("products")} className={`px-4 py-2 rounded-full text-sm font-semibold ${tab === "products" ? "bg-berry text-white" : "bg-white border border-slate-200"}`}>Products ({products.length})</button>
        <button onClick={() => setTab("orders")} className={`px-4 py-2 rounded-full text-sm font-semibold ${tab === "orders" ? "bg-berry text-white" : "bg-white border border-slate-200"}`}>Orders ({orders.length})</button>
      </div>

      {msg && <div className="mb-4 text-sm text-berry">{msg}</div>}

      {tab === "products" && (
        <div>
          <button onClick={() => setCreating(true)} className="mb-4 px-5 py-2.5 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition">
            + Add Product
          </button>

          {(creating || editing) && (
            <ProductForm
              initial={editing || undefined}
              onSave={saveProduct}
              onCancel={() => { setCreating(false); setEditing(null); }}
            />
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-2xl overflow-hidden border border-slate-100">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.slug} className="border-t border-slate-100">
                    <td className="p-3"><img src={p.image} alt="" className="w-12 h-12 object-cover rounded-lg" /></td>
                    <td className="p-3 font-semibold">{p.name}</td>
                    <td className="p-3 text-slate-500">{p.slug}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">₹{p.price}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => setEditing(p)} className="px-3 py-1 rounded-full border border-slate-200 hover:bg-slate-50">Edit</button>
                      <button onClick={() => deleteProduct(p.slug)} className="px-3 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 && <div className="text-slate-500">No orders yet.</div>}
          {orders.map((o: AdminOrder) => (
            <div key={o.id} className="bg-white rounded-2xl p-4 border border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-navy">{o.id}</div>
                  <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-berry">₹{o.total}</div>
                  <div className="text-xs text-slate-500 capitalize">{o.paymentMethod} · {o.paymentStatus}</div>
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-700">
                {o.customer.name} · {o.customer.email} · {o.customer.phone}<br />
                {o.customer.address}, {o.customer.city} {o.customer.zip}, {o.customer.country}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel }: { initial?: Product; onSave: (p: Record<string, unknown>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: initial?.id || "",
    slug: initial?.slug || "",
    name: initial?.name || "",
    category: initial?.category || "interactive-toys",
    tagline: initial?.tagline || "",
    description: initial?.description || "",
    price: initial?.price ?? 0,
    rating: initial?.rating ?? 4.5,
    reviews: initial?.reviews ?? 0,
    badge: initial?.badge || "",
    emoji: initial?.emoji || "🐾",
    gradient: initial?.gradient || "from-cream to-blush",
    image: initial?.image || "",
    featuresInput: initial?.features?.join(", ") || "",
    inStock: initial?.inStock !== false,
  });
  const [uploading, setUploading] = useState(false);

  function update(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: reader.result, name: file.name }),
      });
      const d = await res.json();
      if (res.ok) update("image", d.url);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 mb-6">
      <h3 className="text-lg font-bold text-navy mb-4">{initial ? "Edit Product" : "New Product"}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Name" className="px-3 py-2 rounded-xl border border-slate-200" />
        <input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="Slug" disabled={!!initial} className="px-3 py-2 rounded-xl border border-slate-200 disabled:bg-slate-50" />
        <select value={form.category} onChange={(e) => update("category", e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 bg-white">
          <option value="interactive-toys">Interactive Toys</option>
          <option value="pet-houses">Pet Houses</option>
          <option value="cat-washrooms">Cat Washrooms</option>
        </select>
        <input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="Tagline" className="px-3 py-2 rounded-xl border border-slate-200" />
        <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="Price" className="px-3 py-2 rounded-xl border border-slate-200" />
        <input value={form.badge} onChange={(e) => update("badge", e.target.value)} placeholder="Badge (optional)" className="px-3 py-2 rounded-xl border border-slate-200" />
        <input value={form.emoji} onChange={(e) => update("emoji", e.target.value)} placeholder="Emoji" className="px-3 py-2 rounded-xl border border-slate-200" />
        <input value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="Image URL" className="px-3 py-2 rounded-xl border border-slate-200" />
      </div>
      <textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Description" rows={3} className="w-full mt-3 px-3 py-2 rounded-xl border border-slate-200" />
      <input value={form.featuresInput} onChange={(e) => update("featuresInput", e.target.value)} placeholder="Features (comma separated)" className="w-full mt-3 px-3 py-2 rounded-xl border border-slate-200" />
      <div className="mt-3 flex items-center gap-3">
        <input type="file" accept="image/*" onChange={onImageFile} className="text-sm" />
        {uploading && <span className="text-xs text-slate-500">Uploading...</span>}
        {form.image && <img src={form.image} alt="" className="w-12 h-12 object-cover rounded-lg" />}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input type="checkbox" checked={form.inStock} onChange={(e) => update("inStock", e.target.checked)} id="instock" />
        <label htmlFor="instock" className="text-sm">In stock</label>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={() => onSave(form)} className="px-5 py-2 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition">Save</button>
        <button onClick={onCancel} className="px-5 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition">Cancel</button>
      </div>
    </div>
  );
}

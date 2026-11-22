"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Login failed");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-cream via-blush to-peach py-12">
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 w-full max-w-sm border border-white">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🐾</div>
          <h1 className="text-2xl font-extrabold text-navy">Welcome back</h1>
          <p className="text-muted text-sm mt-1">Log in to your PAWBERRY account</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-berry" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-berry" />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition disabled:opacity-60">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-4">
          New here? <Link href="/signup" className="text-berry font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

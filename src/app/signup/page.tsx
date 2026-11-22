"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Signup failed");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-cream via-blush to-peach py-12">
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 w-full max-w-sm border border-white">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🐾</div>
          <h1 className="text-2xl font-extrabold text-navy">Create account</h1>
          <p className="text-muted text-sm mt-1">Join the PAWBERRY family</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-berry" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-berry" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (6+ chars)" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-berry" />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition disabled:opacity-60">
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account? <Link href="/login" className="text-berry font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Brand";
import Icon from "@/components/ui/Icon";

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
    <div className="relative flex min-h-[80vh] items-center pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-violet/12 blur-[110px]" />
      </div>

      <div className="container-x flex justify-center pb-20">
        <div className="w-full max-w-sm">
          <div className="text-center">
            <div className="flex justify-center">
              <Logo />
            </div>
            <p className="eyebrow mt-8">Access the system</p>
            <h1 className="mt-3 text-3xl font-medium tracking-tight text-chrome sm:text-4xl">
              Welcome <span className="text-gradient">back.</span>
            </h1>
            <p className="mt-2 text-sm text-silver/45">Log in to track orders, repairs and saved pieces.</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-3">
            <div>
              <label htmlFor="email" className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="field"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="field"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/25 bg-red-500/[0.07] px-3.5 py-2.5 text-xs text-red-200">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-60">
              {loading ? "Signing in…" : "Log in"}
              {!loading && <Icon name="arrow-right" size={15} />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-silver/40">
            New here?{" "}
            <Link href="/signup" className="font-medium text-violet-bright hover:text-chrome">
              Create an account
            </Link>
          </p>

          <p className="mt-8 text-center font-mono text-[8px] uppercase leading-relaxed tracking-[0.16em] text-silver/25">
            Protected by encrypted sessions
            <br />
            Wear the future. Waste nothing.
          </p>
        </div>
      </div>
    </div>
  );
}

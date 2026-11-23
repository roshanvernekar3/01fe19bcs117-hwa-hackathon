"use client";

import { useEffect, useState } from "react";
import Mascot from "@/components/Mascot";
import PawLoader from "@/components/PawLoader";

type Review = { id: string; name: string; rating: number; text: string; createdAt: string };

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", { cache: "no-store" });
      const d = await res.json();
      setReviews(d.reviews || []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, text }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      setName("");
      setText("");
      setRating(5);
      setMsg("Thank you! Your review has been shared.");
      await load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-20 bg-white/60 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Customer Reviews</h2>
          <p className="text-muted mt-2">Real words from real pet parents.</p>
        </div>

        {loading ? (
          <PawLoader message="Loading reviews…" />
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <Mascot type="cat" size="lg" anim="peek" />
            <div className="text-muted mt-3">No reviews yet — be the first to share your experience!</div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl p-5 border border-slate-100 hover-lift">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-berry">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <div className="mt-3 font-semibold text-navy text-sm">— {r.name}</div>
              </div>
            ))}
          </div>
        )}

        {/* submit form */}
        <div className="mt-12 max-w-2xl mx-auto bg-white/80 rounded-3xl p-6 border border-white shadow-sm">
          <h3 className="text-xl font-bold text-navy mb-4">Share your experience</h3>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-berry"
              />
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-berry bg-white"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} stars</option>
                ))}
              </select>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell us about your pet's experience..."
              required
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-berry"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            {msg && <div className="text-sm text-slate-600">{msg}</div>}
          </form>
        </div>
      </div>
    </section>
  );
}

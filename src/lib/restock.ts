import { put, head, list, del } from "@vercel/blob";

export async function getSubscribers(slug: string): Promise<string[]> {
  try {
    const meta = await head(`restock/${slug}.json`);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as string[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function addSubscriber(slug: string, email: string): Promise<{ added: boolean; subscribers: string[] }> {
  const list = await getSubscribers(slug);
  const norm = email.trim().toLowerCase();
  if (list.includes(norm)) return { added: false, subscribers: list };
  const next = [...list, norm];
  await put(`restock/${slug}.json`, JSON.stringify(next), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return { added: true, subscribers: next };
}

export async function clearSubscribers(slug: string) {
  try {
    await del(`restock/${slug}.json`);
  } catch {}
}

export async function sendRestockEmail(to: string, product: { name: string; slug: string; price: number }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "RESEND_API_KEY not configured" };
  const from = process.env.RESEND_FROM || "PAWBERRY <onboarding@resend.dev>";
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://01fe19bcs117-hwa-hackathon.vercel.app";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `${product.name} is back in stock at PAWBERRY! 🐾`,
        html: `<div style="font-family:sans-serif;max-width:520px;margin:auto;padding:24px;background:#fdf8f3;border-radius:16px">
          <h1 style="color:#2f3e46">Great news! 🎉</h1>
          <p style="color:#6b7a7a"><strong>${product.name}</strong> is back in stock.</p>
          <p style="color:#6b7a7a">Price: ₹${product.price}</p>
          <a href="${site}/products/${product.slug}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#e879a0;color:#fff;border-radius:999px;text-decoration:none;font-weight:600">Shop now</a>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px">You subscribed to restock alerts for this product.</p>
        </div>`,
      }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return { sent: false, reason: d?.message || `HTTP ${res.status}` };
    }
    return { sent: true };
  } catch (e) {
    return { sent: false, reason: e instanceof Error ? e.message : "send failed" };
  }
}

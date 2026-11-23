export function bust(url: string) {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
}

export async function fetchBlobJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(bust(url), { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

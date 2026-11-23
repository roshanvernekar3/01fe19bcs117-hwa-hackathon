import { put, head } from "@vercel/blob";

export type Address = {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  isDefault: boolean;
};

function key(email: string) {
  return `addresses/${email.toLowerCase().replace(/[^a-z0-9]/g, "_")}.json`;
}

export async function getAddresses(email: string): Promise<Address[]> {
  try {
    const meta = await head(key(email));
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as Address[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function saveAddresses(email: string, addresses: Address[]) {
  await put(key(email), JSON.stringify(addresses), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export function newAddressId() {
  return `addr_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

import { put, head } from "@vercel/blob";
import { fetchBlobJson } from "@/lib/blob";

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
    const data = await fetchBlobJson<Address[]>(meta.url);
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

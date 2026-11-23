import { NextRequest, NextResponse } from "next/server";
import { getAddresses, saveAddresses, newAddressId, type Address } from "@/lib/addresses";

export const dynamic = "force-dynamic";

function auth(req: NextRequest) {
  return req.cookies.get("pb_user")?.value || null;
}

function clean(input: Partial<Address>): Omit<Address, "id" | "isDefault"> {
  return {
    label: String(input.label || "Home").trim().slice(0, 40) || "Home",
    name: String(input.name || "").trim().slice(0, 80),
    phone: String(input.phone || "").trim().slice(0, 30),
    address: String(input.address || "").trim().slice(0, 200),
    city: String(input.city || "").trim().slice(0, 80),
    zip: String(input.zip || "").trim().slice(0, 20),
    country: String(input.country || "India").trim().slice(0, 60),
  };
}

export async function GET(req: NextRequest) {
  const email = auth(req);
  if (!email) return NextResponse.json({ addresses: [] });
  return NextResponse.json({ addresses: await getAddresses(email) });
}

export async function POST(req: NextRequest) {
  const email = auth(req);
  if (!email) return NextResponse.json({ error: "Please log in to save addresses." }, { status: 401 });
  const body = await req.json();
  const data = clean(body);
  if (!data.name || !data.address || !data.city || !data.zip) {
    return NextResponse.json({ error: "Name, address, city and ZIP are required." }, { status: 400 });
  }
  const list = await getAddresses(email);
  const normalized = `${data.address}|${data.zip}`.toLowerCase();
  const existing = list.find((a) => `${a.address}|${a.zip}`.toLowerCase() === normalized);
  if (existing) {
    return NextResponse.json({ address: existing, addresses: list });
  }
  const makeDefault = list.length === 0 || body?.isDefault === true;
  const address: Address = {
    ...data,
    id: newAddressId(),
    isDefault: makeDefault,
  };
  const next = makeDefault ? list.map((a) => ({ ...a, isDefault: false })).concat(address) : [...list, address];
  await saveAddresses(email, next);
  return NextResponse.json({ address, addresses: next });
}

export async function PATCH(req: NextRequest) {
  const email = auth(req);
  if (!email) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  const body = await req.json();
  const id = String(body?.id || "");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const list = await getAddresses(email);
  const next = list.map((a) => ({ ...a, isDefault: a.id === id }));
  await saveAddresses(email, next);
  return NextResponse.json({ addresses: next });
}

export async function DELETE(req: NextRequest) {
  const email = auth(req);
  if (!email) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const list = await getAddresses(email);
  const filtered = list.filter((a) => a.id !== id);
  if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) filtered[0].isDefault = true;
  await saveAddresses(email, filtered);
  return NextResponse.json({ addresses: filtered });
}

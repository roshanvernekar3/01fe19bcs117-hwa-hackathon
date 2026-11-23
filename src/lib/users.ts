import { put, list, head } from "@vercel/blob";
import crypto from "crypto";

export type User = {
  email: string;
  name: string;
  passwordHash: string;
  role: "user" | "admin";
  avatar?: string;
  createdAt: string;
};

function key(email: string) {
  return `users/${email.toLowerCase().replace(/[^a-z0-9]/g, "_")}.json`;
}

export function hashPassword(password: string, salt?: string) {
  const s = salt || crypto.randomBytes(16).toString("hex");
  const h = crypto.scryptSync(password, s, 64).toString("hex");
  return `${s}:${h}`;
}

export function verifyPassword(password: string, stored: string) {
  const [s, h] = stored.split(":");
  if (!s || !h) return false;
  const calc = crypto.scryptSync(password, s, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(calc, "hex"), Buffer.from(h, "hex"));
}

export async function getUser(email: string): Promise<User | null> {
  try {
    const meta = await head(key(email));
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as User;
  } catch {
    return null;
  }
}

export async function saveUser(user: User) {
  await put(key(user.email), JSON.stringify(user), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function listUsers(): Promise<User[]> {
  try {
    const { blobs } = await list({ prefix: "users/", limit: 100 });
    const users = await Promise.all(
      blobs.map(async (b) => {
        try {
          const res = await fetch(b.url, { cache: "no-store" });
          if (!res.ok) return null;
          return (await res.json()) as User;
        } catch {
          return null;
        }
      })
    );
    return users.filter(Boolean) as User[];
  } catch {
    return [];
  }
}

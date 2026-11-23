import { put, list, del, head } from "@vercel/blob";
import { fetchBlobJson } from "@/lib/blob";

export type SupportTopic = "order" | "delivery" | "return" | "refund" | "cancel" | "payment" | "product" | "other";
export type ComplaintStatus = "open" | "in-progress" | "resolved" | "closed";

export type SupportReply = {
  id: string;
  author: "user" | "admin";
  authorEmail: string;
  authorName: string;
  message: string;
  createdAt: string;
};

export type Complaint = {
  id: string;
  userEmail: string;
  userName: string;
  topic: SupportTopic;
  orderId?: string;
  message: string;
  status: ComplaintStatus;
  replies: SupportReply[];
  createdAt: string;
  updatedAt: string;
};

function key(id: string) {
  return `support/complaints/${id}.json`;
}

function versionPath(id: string) {
  return `support/complaints/${id}/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.json`;
}

async function writeVersion(c: Complaint) {
  await put(versionPath(c.id), JSON.stringify(c), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function prune(id: string) {
  try {
    const { blobs } = await list({ prefix: `support/complaints/${id}/`, limit: 1000 });
    if (blobs.length <= 1) return;
    const sorted = [...blobs].sort((a, b) => a.uploadedAt.getTime() - b.uploadedAt.getTime());
    const stale = sorted.slice(1).map((b) => b.url);
    if (stale.length) await del(stale);
  } catch {}
}

export async function listComplaints(): Promise<Complaint[]> {
  try {
    const { blobs } = await list({ prefix: "support/complaints/", limit: 200 });
    const items = await Promise.all(blobs.map((b) => fetchBlobJson<Complaint>(b.url)));
    return items.filter(Boolean) as Complaint[];
  } catch {
    return [];
  }
}

export async function getComplaint(id: string): Promise<Complaint | null> {
  try {
    const meta = await head(key(id));
    if (!meta) return null;
    return await fetchBlobJson<Complaint>(meta.url);
  } catch {
    return null;
  }
}

export async function createComplaint(input: { userEmail: string; userName: string; topic: SupportTopic; orderId?: string; message: string }): Promise<Complaint> {
  const _complaints = await listComplaints();
  const id = "CMP-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  const complaint: Complaint = {
    id,
    userEmail: input.userEmail,
    userName: input.userName,
    topic: input.topic,
    orderId: input.orderId,
    message: input.message,
    status: "open",
    replies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await writeVersion(complaint);
  return complaint;
}

export async function updateComplaint(
  id: string,
  patch: { status?: ComplaintStatus; reply?: { authorEmail: string; authorName: string; message: string } }
): Promise<Complaint | null> {
  const c = await getComplaint(id);
  if (!c) return null;
  if (patch.status) c.status = patch.status;
  if (patch.reply) {
    c.replies.push({
      id: "R-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 5),
      author: "admin",
      authorEmail: patch.reply.authorEmail,
      authorName: patch.reply.authorName,
      message: patch.reply.message,
      createdAt: new Date().toISOString(),
    });
    c.status = "in-progress";
  }
  c.updatedAt = new Date().toISOString();
  await writeVersion(c);
  return c;
}

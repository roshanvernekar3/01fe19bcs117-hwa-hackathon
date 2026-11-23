export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payment gateway not configured" }, { status: 503 });
  }
  try {
    const body = await req.json();
    const amount = Math.round(Number(body.amount) * 100); // paise
    if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await rzp.orders.create({
      amount,
      currency: "INR",
      receipt: body.receipt || `rcpt_${Date.now()}`,
    });
    return NextResponse.json({ order, keyId });
  } catch {
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}

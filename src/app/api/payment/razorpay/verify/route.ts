export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return NextResponse.json({ error: "Payment gateway not configured" }, { status: 503 });
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = hmac.digest("hex");
    if (digest !== razorpay_signature) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }
    return NextResponse.json({ verified: true, paymentId: razorpay_payment_id });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

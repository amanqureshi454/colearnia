export const dynamic = "force-dynamic"; // must be the very first line

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
type CheckoutRequestBody = {
  plan: string;
  duration: string;
  email: string;
  locale?: string;
  token?: string;
  promoCode?: string;
  discountPercentage?: string | number;
};

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey)
    return NextResponse.json(
      { error: "Stripe secret key not configured." },
      { status: 500 }
    );

  const stripe = new Stripe(secretKey, { apiVersion: "2025-06-30.basil" });

  let requestData: CheckoutRequestBody = {} as CheckoutRequestBody;
  try {
    requestData = req
      ? ((await req.json()) as CheckoutRequestBody)
      : ({} as CheckoutRequestBody);
  } catch (err) {
    console.error("Failed to parse request JSON:", err);
    requestData = {} as CheckoutRequestBody;
  }

  const plan = requestData?.plan;
  const duration = requestData?.duration;
  const email = requestData?.email;
  const locale = requestData?.locale || "en";
  const token = requestData?.token;
  const promoCode = requestData?.promoCode;
  const discountPercentage = requestData?.discountPercentage;

  if (!plan || !duration || !email) {
    return NextResponse.json(
      { error: "Missing plan, duration, or email" },
      { status: 400 }
    );
  }

  const PRICE_MAP: Record<string, string | undefined> = {
    student_plus_monthly: process.env.STRIPE_PRICE_ID_STUDENT_PLUS_MONTHLY,
    student_plus_yearly: process.env.STRIPE_PRICE_ID_STUDENT_PLUS_YEARLY,
    teacher_plus_monthly: process.env.STRIPE_PRICE_ID_TEACHER_PLUS_MONTHLY,
    teacher_plus_yearly: process.env.STRIPE_PRICE_ID_TEACHER_PLUS_YEARLY,
  };

  const mapKey = `${plan}_${duration}`;
  const priceId = PRICE_MAP[mapKey];

  if (!priceId) {
    return NextResponse.json(
      { error: "Invalid plan or duration" },
      { status: 400 }
    );
  }

  // Decode token safely
  let userId = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      userId = decoded.userId;
    } catch {}
  }

  const sessionData: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email,
    success_url: `${process.env.DOMAIN_URL}${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.DOMAIN_URL}/${locale}/pricing`,
    allow_promotion_codes: true,
    metadata: {
      token: token || "",
      plan,
      duration,
      priceId,
      userId: userId || "",
      email,
      promoCode: promoCode || "",
      discountPercentage: discountPercentage?.toString() || "",
    },
    subscription_data: {
      metadata: {
        token: token || "",
        plan,
        duration,
        userId: userId || "",
        email,
        promoCode: promoCode || "",
        discountPercentage: discountPercentage?.toString() || "",
      },
    },
  };

  const session = await stripe.checkout.sessions.create(sessionData);

  const db = await getDb();
  await db.collection("checkout_sessions").insertOne({
    sessionId: session.id,
    email,
    plan,
    duration,
    userId,
    promoCode: promoCode || null,
    discountPercentage: discountPercentage || null,
    couponId: null,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ url: session.url });
}

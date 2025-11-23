// app/api/checkout_sessions/route.ts

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const preferredRegion = "auto";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
  [key: string]: unknown;
}

interface CheckoutRequestBody {
  plan: string;
  duration: string;
  email: string;
  locale: string;
  token?: string;
  promoCode?: string;
  discountPercentage?: number;
}

export async function POST(req: NextRequest) {
  try {
    // --- DYNAMIC IMPORT — THIS FIXES THE BUILD ERROR ---
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-06-30.basil", // or whatever version you're using
    });
    // ---------------------------------------------------

    const PRICE_MAP: Record<string, string | undefined> = {
      student_trial_week: process.env.STRIPE_PRICE_ID_STUDENT_TRIAL_WEEKLY,
      student_basic_monthly: process.env.STRIPE_PRICE_ID_STUDENT_BASIC_MONTHLY,
      student_basic_yearly: process.env.STRIPE_PRICE_ID_STUDENT_BASIC_YEARLY,
      student_plus_monthly: process.env.STRIPE_PRICE_ID_STUDENT_PLUS_MONTHLY,
      student_plus_yearly: process.env.STRIPE_PRICE_ID_STUDENT_PLUS_YEARLY,
      teacher_plus_monthly: process.env.STRIPE_PRICE_ID_TEACHER_PLUS_MONTHLY,
      teacher_plus_yearly: process.env.STRIPE_PRICE_ID_TEACHER_PLUS_YEARLY,
    };

    const requestData = (await req.json()) as CheckoutRequestBody;
    const {
      plan,
      duration,
      email,
      locale,
      token,
      promoCode,
      discountPercentage,
    } = requestData;

    if (!plan || !duration || !email) {
      return NextResponse.json(
        { error: "Missing plan, duration, or email" },
        { status: 400 }
      );
    }

    const mapKey = `${plan}_${duration}`;
    const priceId = PRICE_MAP[mapKey];

    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan or duration" },
        { status: 400 }
      );
    }

    let userId: string | null = null;
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET!
        ) as DecodedToken;
        userId = decoded?.userId ?? null;
      } catch (err) {
        // Invalid token, proceed without userId
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/${locale}/pricing`,
      allow_promotion_codes: true,
      metadata: {
        plan,
        duration,
        priceId,
        userId: userId ?? "",
        email,
        token: token ?? "",
        promoCode: promoCode ?? "",
        discountPercentage: discountPercentage?.toString() ?? "",
      },
      subscription_data: {
        metadata: {
          plan,
          duration,
          userId: userId ?? "",
          email,
          promoCode: promoCode ?? "",
          discountPercentage: discountPercentage?.toString() ?? "",
        },
      },
    });

    // Save to DB
    try {
      const db = await getDb();
      await db.collection("checkout_sessions").insertOne({
        sessionId: session.id,
        email,
        plan,
        duration,
        userId,
        promoCode: promoCode ?? null,
        discountPercentage: discountPercentage ?? null,
        status: "pending",
        createdAt: new Date(),
      });
    } catch (dbErr) {
      console.error("Failed to save checkout session:", dbErr);
    }

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Checkout session error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

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
    // 1. Dynamic import Stripe
    const { default: Stripe } = await import("stripe");

    // 2. Get ALL env vars only here — never at the top level
    const {
      STRIPE_SECRET_KEY,
      JWT_SECRET,
      NEXT_PUBLIC_DOMAIN_URL,
      STRIPE_PRICE_ID_STUDENT_TRIAL_WEEKLY,
      STRIPE_PRICE_ID_STUDENT_BASIC_MONTHLY,
      STRIPE_PRICE_ID_STUDENT_BASIC_YEARLY,
      STRIPE_PRICE_ID_STUDENT_PLUS_MONTHLY,
      STRIPE_PRICE_ID_STUDENT_PLUS_YEARLY,
      STRIPE_PRICE_ID_TEACHER_PLUS_MONTHLY,
      STRIPE_PRICE_ID_TEACHER_PLUS_YEARLY,
    } = process.env;

    // 3. Early return if critical vars missing (will fail fast in runtime, not build)
    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }
    if (!NEXT_PUBLIC_DOMAIN_URL) {
      return NextResponse.json(
        { error: "Domain URL not configured" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-06-30.basil", // Use a real version, not "2025-06-30.basil"
    });

    // 4. Build PRICE_MAP safely inside handler
    const PRICE_MAP: Record<string, string> = {
      student_trial_week: STRIPE_PRICE_ID_STUDENT_TRIAL_WEEKLY!,
      student_basic_monthly: STRIPE_PRICE_ID_STUDENT_BASIC_MONTHLY!,
      student_basic_yearly: STRIPE_PRICE_ID_STUDENT_BASIC_YEARLY!,
      student_plus_monthly: STRIPE_PRICE_ID_STUDENT_PLUS_MONTHLY!,
      student_plus_yearly: STRIPE_PRICE_ID_STUDENT_PLUS_YEARLY!,
      teacher_plus_monthly: STRIPE_PRICE_ID_TEACHER_PLUS_MONTHLY!,
      teacher_plus_yearly: STRIPE_PRICE_ID_TEACHER_PLUS_YEARLY!,
    };

    const body = (await req.json()) as CheckoutRequestBody;
    const {
      plan,
      duration,
      email,
      locale = "en",
      token,
      promoCode,
      discountPercentage,
    } = body;

    if (!plan || !duration || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const priceId = PRICE_MAP[`${plan}_${duration}`];
    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan or duration" },
        { status: 400 }
      );
    }

    let userId: string | null = null;
    if (token && JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        userId = decoded.userId ?? null;
      } catch (err) {
        console.log("Invalid token, continuing without userId", err);
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${NEXT_PUBLIC_DOMAIN_URL}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${NEXT_PUBLIC_DOMAIN_URL}/${locale}/pricing`,
      allow_promotion_codes: true,
      metadata: {
        plan,
        duration,
        priceId,
        userId: userId ?? "",
        email,
        promoCode: promoCode ?? "",
        discountPercentage: discountPercentage?.toString() ?? "",
      },
      subscription_data: {
        metadata: {
          plan,
          duration,
          userId: userId ?? "",
          email,
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
      console.error("DB save failed:", dbErr);
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

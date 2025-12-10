// interface DecodedToken {
//   userId: string;
//   [key: string]: unknown;
// }

// interface CheckoutRequestBody {
//   plan: string;
//   duration: string;
//   email: string;
//   locale: string;
//   token?: string;
//   promoCode?: string;
//   discountPercentage?: number;
// }

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

// ✅ ADD THIS - Forces dynamic rendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe secret key not configured." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2025-06-30.basil" });

  try {
    // ✅ Verify token FIRST before doing anything
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      userId = decoded.userId;

      if (!userId) {
        return NextResponse.json(
          { error: "Invalid token - missing userId" },
          { status: 401 }
        );
      }
    } catch (err) {
      console.log("❌ Token verification failed:", err);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // ✅ Now get the request data
    let requestData;
    try {
      requestData = await req.json();
    } catch (jsonError) {
      console.error("JSON parse error:", jsonError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { plan, duration, email, locale, promoCode, discountPercentage } =
      requestData;

    console.log("📋 Creating checkout session:", {
      plan,
      duration,
      email,
      userId,
      promoCode,
      discountPercentage,
    });

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

    // Prepare session data
    const sessionData: any = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/pricing`,
      allow_promotion_codes: true,
      metadata: {
        plan,
        duration,
        priceId,
        userId,
        email,
        promoCode: promoCode || "",
        discountPercentage: discountPercentage?.toString() || "",
      },
      subscription_data: {
        metadata: {
          plan,
          duration,
          userId,
          email,
          promoCode: promoCode || "",
          discountPercentage: discountPercentage?.toString() || "",
        },
      },
    };

    const session = await stripe.checkout.sessions.create(sessionData);

    // Pre-save checkout session to database
    try {
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
      console.log("✅ Checkout session pre-saved");
    } catch (err) {
      console.error("Failed to pre-save checkout session:", err);
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

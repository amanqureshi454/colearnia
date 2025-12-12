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
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe secret key not configured." },
      { status: 500 }
    );
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = new Stripe(secretKey, { apiVersion: "2025-06-30.basil" });
  const PRICE_MAP: Record<string, string | undefined> = {
    student_trial_week: process.env.STRIPE_PRICE_ID_STUDENT_TRIAL_WEEKLY,
    student_basic_monthly: process.env.STRIPE_PRICE_ID_STUDENT_BASIC_MONTHLY,
    student_basic_yearly: process.env.STRIPE_PRICE_ID_STUDENT_BASIC_YEARLY,
    student_plus_monthly: process.env.STRIPE_PRICE_ID_STUDENT_PLUS_MONTHLY,
    student_plus_yearly: process.env.STRIPE_PRICE_ID_STUDENT_PLUS_YEARLY,
    teacher_plus_monthly: process.env.STRIPE_PRICE_ID_TEACHER_PLUS_MONTHLY,
    teacher_plus_yearly: process.env.STRIPE_PRICE_ID_TEACHER_PLUS_YEARLY,
  };

  try {
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

    const {
      plan,
      duration,
      email,
      locale,
      token,
      promoCode,
      discountPercentage,
    } = requestData;

    console.log("📋 Creating checkout session:", {
      plan,
      duration,
      email,
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

    // Decode user info from token
    let userId = null;
    if (token) {
      if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET missing");
      } else {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
          userId = decoded.userId;
        } catch (err) {
          console.log("❌ Token decode failed:", err);
        }
      }
    }

    // Check if user has an active Trial Pass with remaining days
    let trialEndTimestamp: number | null = null;
    let remainingTrialDays = 0;
    const isUpgradeFromTrial =
      plan === "student_basic" || plan === "student_plus";

    if (isUpgradeFromTrial && email) {
      try {
        const db = await getDb();
        const existingSubscription = await db
          .collection("subscriptions")
          .findOne({ email });

        if (
          existingSubscription?.isTrialPass &&
          existingSubscription?.trialEndDate &&
          existingSubscription?.status === "active"
        ) {
          const trialEnd = new Date(existingSubscription.trialEndDate);
          const now = new Date();

          // Only apply remaining days if trial hasn't expired
          if (trialEnd > now) {
            remainingTrialDays = Math.ceil(
              (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );
            trialEndTimestamp = Math.floor(trialEnd.getTime() / 1000); // Unix timestamp for Stripe

            console.log("🎟️ User upgrading from Trial Pass");
            console.log(
              "📅 Trial End Date:",
              existingSubscription.trialEndDate
            );
            console.log("⏳ Remaining Trial Days:", remainingTrialDays);
          }
        }
      } catch (err) {
        console.error("Error checking existing subscription:", err);
      }
    }

    // Check if this is a Trial Pass purchase
    const isTrialPassPurchase = plan === "student_trial";

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
      success_url: `http://localhost:3000/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/${locale}/pricing`,
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
        upgradedFromTrial: trialEndTimestamp ? "true" : "false",
        remainingTrialDays: remainingTrialDays.toString(),
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
          upgradedFromTrial: trialEndTimestamp ? "true" : "false",
          remainingTrialDays: remainingTrialDays.toString(),
        },
      },
    };

    // For Trial Pass: cancel at period end (no auto-renewal)
    if (isTrialPassPurchase) {
      sessionData.subscription_data.metadata.cancelAtPeriodEnd = "true";
    }

    // Apply remaining trial days as free trial period on new subscription
    if (trialEndTimestamp && remainingTrialDays > 0) {
      sessionData.subscription_data.trial_end = trialEndTimestamp;
      console.log(
        "✅ Applied",
        remainingTrialDays,
        "remaining trial days to new subscription"
      );
    }

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
      console.log("✅ Checkout session pre-saved with promo code");
    } catch (err) {
      console.error("Failed to pre-save checkout session:", err);
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err);
    console.error("Error message:", err?.message);
    console.error("Error type:", err?.type);
    return NextResponse.json(
      { error: "Internal server error", details: err?.message },
      { status: 500 }
    );
  }
}

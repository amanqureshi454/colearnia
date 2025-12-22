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

  const BASE_URL =
    process.env.NEXT_PUBLIC_DOMAIN_URL || "http://localhost:3000";

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
      maxCircle,
      promoCode,
      discountPercentage,
    } = requestData;

    console.log("📋 Creating checkout session:", {
      plan,
      duration,
      email,
      maxCircle,
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

    console.log("🟡 LOOKUP:", { mapKey, priceId, plan, duration });

    if (!priceId) {
      console.error("❌ Invalid mapKey:", mapKey);
      console.error("Available keys:", Object.keys(PRICE_MAP));
      return NextResponse.json(
        { error: "Invalid plan or duration" },
        { status: 400 }
      );
    }

    // Decode user info from token (optional - won't break if it fails)
    let userId = null;
    if (token && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
        userId = decoded.userId;
      } catch (err) {
        console.log("⚠️ Token decode failed - continuing without userId");
      }
    }

    const processedMaxCircle =
      maxCircle === 0 || maxCircle === undefined ? null : maxCircle;

    // Check if this is a Trial Pass purchase
    const isTrialPassPurchase = plan === "student_trial";

    // Check if user has an active Trial Pass with remaining days (for upgrades)
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

          if (trialEnd > now) {
            remainingTrialDays = Math.ceil(
              (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );
            trialEndTimestamp = Math.floor(trialEnd.getTime() / 1000);
            console.log("🎟️ Remaining trial days:", remainingTrialDays);
          }
        }
      } catch (err) {
        console.error("Error checking existing subscription:", err);
      }
    }

    // Prepare session data based on plan type
    let sessionData: any;

    if (isTrialPassPurchase) {
      // ✅ TRIAL PASS: One-time payment (not subscription)
      sessionData = {
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        customer_email: email,
        success_url: `${BASE_URL}/${
          locale || "en"
        }/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${BASE_URL}/${locale || "en"}/pricing`,
        allow_promotion_codes: true,
        metadata: {
          token: token || "",
          plan,
          duration,
          priceId,
          userId: userId || "",
          email,
          maxCircle: processedMaxCircle?.toString() || "",
          promoCode: promoCode || "",
          discountPercentage: discountPercentage?.toString() || "",
          isTrialPass: "true",
          trialDuration: "14", // 14 days trial
        },
      };
      console.log("🎟️ Creating TRIAL PASS (one-time payment)");
    } else {
      // ✅ REGULAR PLANS: Subscription mode
      sessionData = {
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        customer_email: email,
        success_url: `${BASE_URL}/${
          locale || "en"
        }/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${BASE_URL}/${locale || "en"}/pricing`,
        allow_promotion_codes: true,
        metadata: {
          token: token || "",
          plan,
          duration,
          priceId,
          userId: userId || "",
          email,
          maxCircle: processedMaxCircle?.toString() || "",
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
            maxCircle: processedMaxCircle?.toString() || "",
            userId: userId || "",
            email,
            promoCode: promoCode || "",
            discountPercentage: discountPercentage?.toString() || "",
            upgradedFromTrial: trialEndTimestamp ? "true" : "false",
            remainingTrialDays: remainingTrialDays.toString(),
          },
        },
      };

      // Apply remaining trial days as free trial period on new subscription
      if (trialEndTimestamp && remainingTrialDays > 0) {
        sessionData.subscription_data.trial_end = trialEndTimestamp;
        console.log("✅ Applied", remainingTrialDays, "remaining trial days");
      }

      console.log("📦 Creating SUBSCRIPTION");
    }

    const session = await stripe.checkout.sessions.create(sessionData);
    console.log("✅ Stripe session created:", session.id);

    // Pre-save checkout session to database
    try {
      const db = await getDb();
      await db.collection("checkout_sessions").insertOne({
        sessionId: session.id,
        email,
        plan,
        duration,
        maxCircle: processedMaxCircle?.toString() || "",
        userId,
        promoCode: promoCode || null,
        discountPercentage: discountPercentage || null,
        couponId: null,
        status: "pending",
        isTrialPass: isTrialPassPurchase,
        createdAt: new Date().toISOString(),
      });
      console.log("✅ Checkout session pre-saved");
    } catch (err) {
      console.error("Failed to pre-save checkout session:", err);
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("💥 Stripe error:", err?.message);
    return NextResponse.json(
      { error: "Internal server error", details: err?.message },
      { status: 500 }
    );
  }
}

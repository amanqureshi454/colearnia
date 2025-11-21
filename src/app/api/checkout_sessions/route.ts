import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
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
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe secret key not configured." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2025-06-30.basil",
  });

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
    let requestData: CheckoutRequestBody;

    try {
      requestData = (await req.json()) as CheckoutRequestBody;
    } catch {
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

    // Decode token safely
    let userId: string | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET!
        ) as DecodedToken;

        if (decoded?.userId) {
          userId = decoded.userId;
        }
      } catch {
        console.warn("JWT decode failed");
      }
    }

    // Type-safe session data
    const sessionData: Stripe.Checkout.SessionCreateParams = {
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
          token: token ?? "",
          promoCode: promoCode ?? "",
          discountPercentage: discountPercentage?.toString() ?? "",
        },
      },
    };

    const session = await stripe.checkout.sessions.create(sessionData);

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
        couponId: null,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.error("Database save error:", dbErr);
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

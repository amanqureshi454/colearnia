/* eslint-disable */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  console.log("🚀 Webhook endpoint called");

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const BASE_URL =
    process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://colearnia.com";

  if (!secretKey) {
    console.error("❌ Missing Stripe secret key");
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2025-06-30.basil" });

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;

    // Try to verify webhook if we have the secret
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        console.log("✅ Webhook verified successfully");
      } catch (err) {
        console.error("❌ Webhook verification failed:", err);
        // For development, parse the body manually
        const parsedBody = JSON.parse(body);
        event = parsedBody;
      }
    } else {
      // Parse body directly if no webhook secret
      console.log("⚠️ No webhook secret, parsing body directly");
      const parsedBody = JSON.parse(body);
      event = parsedBody;
    }

    console.log("📋 Event type:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutComplete(event.data.object, stripe);
        break;
      }
      case "payment_intent.succeeded": {
        await handlePaymentSuccess(event.data.object);
        break;
      }
      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

async function handleCheckoutComplete(session: any, stripe: Stripe) {
  console.log("💳 Processing checkout.session.completed");
  console.log("Session ID:", session.id);
  console.log("Customer Email:", session.customer_email);

  try {
    const db = await getDb();

    // Get user info from metadata or session
    const email = session.customer_email || session.customer_details?.email;
    const token = session.metadata?.token;
    const plan = session.metadata?.plan || "teacher_plus";
    const duration = session.metadata?.duration || "monthly";

    // Decode user info if token exists
    let userId = `user_${Date.now()}`;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        userId = decoded.userId || userId;
      } catch (err) {
        console.log("⚠️ Token decode failed, using generated userId");
      }
    }

    // Retrieve subscription details
    let subscriptionDetails: Stripe.Subscription | null = null;
    if (session.subscription) {
      try {
        subscriptionDetails = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
      } catch (err) {
        console.log("⚠️ Failed to retrieve subscription details");
      }
    }

    const currentDate = new Date();
    const subscriptionTyped = subscriptionDetails as unknown as {
      current_period_end?: number;
    };
    const periodEnd = subscriptionTyped.current_period_end
      ? new Date(subscriptionTyped.current_period_end * 1000)
      : new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Get promo code details from metadata
    const promoCode = session.metadata?.promoCode || null;
    const discountPercentage = session.metadata?.discountPercentage
      ? parseFloat(session.metadata.discountPercentage)
      : null;

    // Calculate original and discounted amount
    // Note: session.amount_total is the FINAL amount after discount (from Stripe)
    const finalAmount = session.amount_total
      ? session.amount_total / 100
      : 99.0;

    // Calculate original amount if discount was applied
    // Formula: originalAmount = finalAmount / (1 - discount/100)
    let originalAmount = finalAmount;
    let discountApplied = 0;

    if (discountPercentage && discountPercentage > 0) {
      originalAmount = finalAmount / (1 - discountPercentage / 100);
      discountApplied = originalAmount - finalAmount;
      console.log(
        `💰 Price calculation: Original=${originalAmount.toFixed(
          2
        )}, Discount=${discountPercentage}%, Final=${finalAmount.toFixed(2)}`
      );
    }

    const subscriptionData = {
      userId,
      email,
      plan,
      duration,
      status: "active",
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId:
        (session.subscription as string) || `sub_${Date.now()}`,
      sessionId: session.id,
      priceId:
        subscriptionDetails?.items.data[0]?.price.id ||
        session.metadata?.priceId,
      currentPeriodEnd: periodEnd.toISOString(),
      createdAt: currentDate.toISOString(),
      updatedAt: currentDate.toISOString(),
      cancelAtPeriodEnd: false,
      originalAmount: originalAmount,
      discountApplied: discountApplied,
      amount: finalAmount,
      currency: session.currency?.toUpperCase() || "QAR",
      paymentStatus: "succeeded",
      paymentMethod: session.payment_method_types?.[0] || "card",
      promoCode: promoCode,
      discountPercentage: discountPercentage,
    };

    console.log("💾 Saving subscription:", subscriptionData);

    // Save to database
    const result = await db
      .collection("subscriptions")
      .updateOne({ email }, { $set: subscriptionData }, { upsert: true });

    console.log("✅ Subscription saved successfully:", result);
  } catch (error) {
    console.error("❌ Error saving subscription:", error);
    throw error;
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  console.log("💰 Processing payment_intent.succeeded");

  try {
    const db = await getDb();

    // Extract details from payment intent
    const email =
      paymentIntent.receipt_email ||
      paymentIntent.charges?.data[0]?.billing_details?.email;

    if (email) {
      // Update payment status if subscription exists
      await db.collection("subscriptions").updateOne(
        { email },
        {
          $set: {
            paymentStatus: "succeeded",
            lastPaymentDate: new Date().toISOString(),
            paymentIntentId: paymentIntent.id,
          },
        }
      );

      console.log("✅ Payment status updated for:", email);
    }
  } catch (error) {
    console.error("❌ Error updating payment status:", error);
  }
}

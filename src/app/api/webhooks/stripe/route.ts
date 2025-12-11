/* eslint-disable */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-06-30.basil",
  });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("🔔 Webhook received:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-06-30.basil",
  });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  console.log("✅ Checkout session completed:", session.id);

  const db = await getDb();

  // Get session data from our database
  const checkoutSession = await db.collection("checkout_sessions").findOne({
    sessionId: session.id,
  });

  console.log("🔍 Checkout session data:", checkoutSession);

  // Get promotion codes from Stripe session
  let promoCode = null;
  let discountPercentage = null;
  let discountApplied = 0;

  if (
    session.total_details?.breakdown?.discounts &&
    session.total_details.breakdown.discounts.length > 0
  ) {
    const discount = session.total_details.breakdown.discounts[0];
    console.log("🎫 Discount applied in Stripe:", discount);

    // Get promotion code details
    if ((discount as any).promotion_code) {
      try {
        const promotionCode = await stripe.promotionCodes.retrieve(
          (discount as any).promotion_code
        );
        console.log("🎫 Promotion code details:", promotionCode);

        promoCode = promotionCode.code;

        // Get coupon details
        if (promotionCode.coupon) {
          const coupon = await stripe.coupons.retrieve(
            promotionCode.coupon as unknown as string
          );
          console.log("🎫 Coupon details:", coupon);

          if (coupon.percent_off) {
            discountPercentage = coupon.percent_off;
          }
        }
      } catch (error) {
        console.log("⚠️ Failed to retrieve promotion code details:", error);
      }
    }

    // Calculate discount amount
    if (session.amount_total && session.amount_subtotal) {
      discountApplied = (session.amount_subtotal - session.amount_total) / 100; // Convert from cents
    }
  }

  console.log("🎫 Final promo code data:", {
    promoCode,
    discountPercentage,
    discountApplied,
  });

  // Calculate amounts
  const originalAmount = session.amount_subtotal
    ? session.amount_subtotal / 100
    : 99.0;
  const finalAmount = session.amount_total
    ? session.amount_total / 100
    : originalAmount;

  // Check if this is a Trial Pass purchase (14 days)
  const isTrialPass = session.metadata?.plan === "student_trial";
  const trialEndDate = isTrialPass
    ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
    : null;

  // Check if this is an upgrade from Trial Pass
  const upgradedFromTrial = session.metadata?.upgradedFromTrial === "true";
  const remainingTrialDays = parseInt(
    session.metadata?.remainingTrialDays || "0"
  );

  // Calculate period end based on plan type
  let periodEnd: string;
  if (isTrialPass) {
    periodEnd = trialEndDate!; // Trial Pass: 14 days
  } else if (upgradedFromTrial && remainingTrialDays > 0) {
    // Upgraded from trial: period starts after remaining trial days
    periodEnd = new Date(
      Date.now() + (remainingTrialDays + 30) * 24 * 60 * 60 * 1000
    ).toISOString();
  } else {
    periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Monthly: 30 days
  }

  // Create subscription data
  const subscriptionData = {
    user: session.metadata?.userId || "user_auto_" + Date.now(),
    userId: session.metadata?.userId || "user_auto_" + Date.now(),
    email: session.customer_email || session.metadata?.email,
    plan: session.metadata?.plan,
    duration: session.metadata?.duration,
    status: "active",
    stripeCustomerId: session.customer as string,
    stripeSubscriptionId: session.subscription as string,
    priceId: session.metadata?.priceId,
    currentPeriodEnd: periodEnd,
    // Trial Pass specific fields
    isTrialPass: isTrialPass,
    trialEndDate: trialEndDate,
    trialStartDate: isTrialPass ? new Date().toISOString() : null,
    // Upgrade from Trial Pass tracking
    upgradedFromTrial: upgradedFromTrial,
    remainingTrialDaysApplied: upgradedFromTrial ? remainingTrialDays : 0,
    subscriptionTrialEnd:
      upgradedFromTrial && remainingTrialDays > 0
        ? new Date(
            Date.now() + remainingTrialDays * 24 * 60 * 60 * 1000
          ).toISOString()
        : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancelAtPeriodEnd: false,
    paymentMethod: "card",
    paymentStatus: "succeeded",
    originalAmount: originalAmount,
    discountApplied: discountApplied,
    amount: finalAmount,
    currency: session.currency?.toUpperCase() || "QAR",
    promoCode: promoCode,
    discountPercentage: discountPercentage,
    automaticSave: true,
    saveMethod: "stripe_webhook",
    saveDate: new Date().toISOString(),
    webhookStatus: "saved_via_webhook",
    sessionId: session.id,
    notes: promoCode
      ? `Payment saved with ${discountPercentage}% discount using promo code ${promoCode}`
      : isTrialPass
      ? "Trial Pass (14 days) saved via Stripe webhook"
      : upgradedFromTrial
      ? `Upgraded from Trial Pass with ${remainingTrialDays} remaining days applied as free trial`
      : "Payment saved via Stripe webhook",
  };

  // Save to database
  await db
    .collection("subscriptions")
    .updateOne(
      { email: subscriptionData.email },
      { $set: subscriptionData },
      { upsert: true }
    );

  console.log("✅ PAYMENT SAVED VIA WEBHOOK!");
  console.log("📧 Email:", subscriptionData.email);
  console.log("📦 Plan:", subscriptionData.plan);
  console.log("🎫 Promo Code:", promoCode || "None");
  console.log("💰 Original Amount:", originalAmount.toFixed(2), "QAR");
  console.log("💰 Discount Applied:", discountApplied.toFixed(2), "QAR");
  console.log("💰 Final Amount:", finalAmount.toFixed(2), "QAR");
  console.log("📊 Status: active");
  if (isTrialPass) {
    console.log("🎟️ Trial Pass: 14 days");
    console.log("📅 Trial End Date:", trialEndDate);
  }
  if (upgradedFromTrial) {
    console.log("⬆️ Upgraded from Trial Pass");
    console.log("⏳ Remaining Trial Days Applied:", remainingTrialDays);
    console.log(
      "📅 Subscription Trial End:",
      subscriptionData.subscriptionTrialEnd
    );
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("💰 Invoice payment succeeded:", invoice.id);
  // Handle recurring payments if needed
}

/* eslint-disable */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const PRICE_MAP: Record<string, string | undefined> = {
  pro_monthly: process.env.STRIPE_PRICE_ID_STUDENT_PRO_MONTHLY,
  pro_yearly: process.env.STRIPE_PRICE_ID_STUDENT_PRO_YEARLY,
  premium_monthly: process.env.STRIPE_PRICE_ID_STUDENT_PREMIUM_MONTHLY,
  premium_yearly: process.env.STRIPE_PRICE_ID_STUDENT_PREMIUM_YEARLY,
  teacher_plus_monthly: process.env.STRIPE_PRICE_ID_TEACHER_PLUS_MONTHLY,
  teacher_plus_yearly: process.env.STRIPE_PRICE_ID_TEACHER_PLUS_YEARLY,
};

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    const { newPlan, newDuration } = await req.json();

    if (!newPlan || !newDuration) {
      return NextResponse.json(
        { error: "Missing newPlan or newDuration" },
        { status: 400 }
      );
    }

    // Get current subscription from database
    const db = await getDb();
    const currentSubscription = await db
      .collection("subscriptions")
      .findOne({ userId });

    if (!currentSubscription || !currentSubscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Get new price ID
    const mapKey = `${newPlan}_${newDuration}`;
    const newPriceId = PRICE_MAP[mapKey];

    if (!newPriceId) {
      return NextResponse.json(
        { error: "Invalid plan or duration" },
        { status: 400 }
      );
    }

    // Retrieve current subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      currentSubscription.stripeSubscriptionId
    );

    // Update subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(
      currentSubscription.stripeSubscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: "create_prorations", // Handle prorations for upgrades/downgrades
      }
    );

    // Update subscription in database
    const currentPeriodEnd = new Date(
      updatedSubscription.current_period_end * 1000
    );

    await db.collection("subscriptions").updateOne(
      { userId },
      {
        $set: {
          plan: newPlan,
          duration: newDuration,
          priceId: newPriceId,
          currentPeriodEnd: currentPeriodEnd.toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
      subscription: {
        plan: newPlan,
        duration: newDuration,
        currentPeriodEnd: currentPeriodEnd.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

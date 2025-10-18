import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    // Get current subscription from database
    const db = await getDb();
    const currentSubscription = await db
      .collection("subscriptions")
      .findOne({ userId });

    if (!currentSubscription || !currentSubscription.stripeCustomerId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Create customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: currentSubscription.stripeCustomerId,
      return_url: `${
        process.env.DOMAIN_URL || "http://localhost:3000"
      }/pricing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

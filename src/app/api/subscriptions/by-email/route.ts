export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const preferredRegion = "auto";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const db = await getDb();
    const subscription = await db
      .collection("subscriptions")
      .findOne({ email });

    if (!subscription) {
      // Return free plan as default when no subscription exists
      const freePlan = {
        plan: "free",
        status: "active",
        currentPeriodEnd: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(), // 1 year from now
        amount: 0,
        currency: "QAR",
        duration: "monthly",
        email: email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFreePlan: true,
        features: [
          "Unlimited Join Study Circles",
          "Create Circles (Up to 3)",
          "Access Quizzes & Leaderboard",
          "Earn Achievement Badges",
          "Progress Analytics",
        ],
      };

      // console.log("📦 Returning free plan for user:", email);
      return NextResponse.json(freePlan);
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error fetching subscription by email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

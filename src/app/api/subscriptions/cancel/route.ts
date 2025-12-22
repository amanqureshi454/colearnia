export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("📧 Cancelling subscription for:", email);

    const db = await getDb();
    const subscriptionsCollection = db.collection("subscriptions");

    // Get current subscription
    const currentSubscription = await subscriptionsCollection.findOne({
      email,
    });

    if (!currentSubscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const currentDate = new Date();

    // ✅ Check if user has remaining trial/subscription time
    const hasRemainingTime =
      currentSubscription.currentPeriodEnd &&
      new Date(currentSubscription.currentPeriodEnd) > currentDate;

    const trialEndDate = currentSubscription.trialEndDate
      ? new Date(currentSubscription.trialEndDate)
      : null;

    const hasRemainingTrialTime = trialEndDate && trialEndDate > currentDate;

    // ✅ Determine the actual end date (when access expires)
    let accessEndDate = currentDate;
    if (currentSubscription.isTrialPass && hasRemainingTrialTime) {
      accessEndDate = trialEndDate;
    } else if (hasRemainingTime) {
      accessEndDate = new Date(currentSubscription.currentPeriodEnd);
    }

    // ✅ Update subscription data
    const updateData: any = {
      status: "cancelled",
      cancelAtPeriodEnd: true,
      cancelledAt: currentDate.toISOString(),
      updatedAt: currentDate.toISOString(),
      // Keep access until the end date
      accessExpiresAt: accessEndDate.toISOString(),
    };

    // ✅ If NO remaining time, switch to free plan immediately
    if (!hasRemainingTime && !hasRemainingTrialTime) {
      updateData.plan = "free";
      updateData.status = "free";
      updateData.isTrialPass = false;
      updateData.amount = 0;
      updateData.originalAmount = 0;
      updateData.duration = "N/A";
      updateData.trialEndDate = null;
      updateData.maxCircle = 0;
      updateData.notes = "Downgraded to Free plan";
    } else {
      // ✅ User still has access - mark for downgrade at period end
      updateData.notes = `Subscription cancelled. Access until ${accessEndDate.toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )}. Will switch to Free plan after.`;
    }

    await subscriptionsCollection.updateOne({ email }, { $set: updateData });

    console.log("✅ Subscription cancelled:", {
      email,
      hasRemainingTime: hasRemainingTime || hasRemainingTrialTime,
      accessEndDate: accessEndDate.toISOString(),
    });

    return NextResponse.json({
      success: true,
      message:
        hasRemainingTime || hasRemainingTrialTime
          ? `Subscription cancelled. You'll have access until ${accessEndDate.toLocaleDateString()}`
          : "Switched to Free plan",
      accessExpiresAt: accessEndDate.toISOString(),
      hasRemainingAccess: hasRemainingTime || hasRemainingTrialTime,
    });
  } catch (error) {
    console.error("❌ Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}

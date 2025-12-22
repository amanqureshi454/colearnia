export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const {
      sessionId,
      email,
      plan,
      maxCircle,
      duration,
      promoCode,
      discountPercentage,
    } = await req.json();

    console.log("📧 Payment details:", {
      sessionId,
      email,
      plan,
      duration,
      maxCircle,
      promoCode,
      discountPercentage,
    });

    const db = await getDb();
    const subscriptionsCollection = db.collection("subscriptions");

    // Create subscription data
    const userId = "user_auto_" + Date.now();
    const currentDate = new Date();

    // ✅ Check if this is a Trial Pass
    const isTrialPass = plan === "student_trial";

    // ✅ Calculate period end based on plan type
    let periodEnd: Date;
    if (isTrialPass) {
      // Trial Pass: 14 days
      periodEnd = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    } else if (duration === "yearly") {
      // Yearly plans: 365 days
      periodEnd = new Date(currentDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    } else {
      // Monthly plans: 30 days
      periodEnd = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    // ✅ Calculate original amount based on plan
    let originalAmount = 0;

    if (isTrialPass) {
      // Trial Pass: 7 QAR
      originalAmount = 7;
    } else if (plan === "student_basic") {
      originalAmount = duration === "yearly" ? 490 : 49;
    } else if (plan === "student_plus") {
      originalAmount = duration === "yearly" ? 990 : 99;
    } else if (plan === "teacher_plus") {
      originalAmount = duration === "yearly" ? 999 : 99;
    } else if (plan === "institution") {
      originalAmount = 0; // Contact sales / custom pricing
    }

    let finalAmount = originalAmount;
    let discountApplied = 0;
    let finalDiscountPercentage = discountPercentage;

    // ✅ Don't apply discounts to Trial Pass
    if (!isTrialPass) {
      if (discountPercentage && discountPercentage > 0) {
        discountApplied = originalAmount * (discountPercentage / 100);
        finalAmount = originalAmount - discountApplied;
        console.log(
          `💰 Price calculation: Original=${originalAmount.toFixed(
            2
          )}, Discount=${discountPercentage}%, Final=${finalAmount.toFixed(2)}`
        );
      } else if (promoCode) {
        // If promo code exists but no discount percentage, assume 20% discount
        finalDiscountPercentage = 20;
        discountApplied = originalAmount * (finalDiscountPercentage / 100);
        finalAmount = originalAmount - discountApplied;
        console.log(
          `💰 Price calculation with promo code: Original=${originalAmount.toFixed(
            2
          )}, Discount=${finalDiscountPercentage}%, Final=${finalAmount.toFixed(
            2
          )}`
        );
      }
    }

    const processedMaxCircle =
      maxCircle === 0 || maxCircle === undefined || maxCircle === null
        ? null
        : maxCircle;

    const subscriptionData: any = {
      user: userId,
      userId: userId,
      email: email,
      plan: plan,
      duration: duration,
      status: "active",
      stripeCustomerId: "cus_auto_" + Date.now(),
      stripeSubscriptionId: isTrialPass ? null : "sub_auto_" + Date.now(),
      priceId: "price_auto_" + Date.now(),
      currentPeriodEnd: periodEnd.toISOString(),
      createdAt: currentDate.toISOString(),
      updatedAt: currentDate.toISOString(),
      cancelAtPeriodEnd: isTrialPass ? true : false, // ✅ Trial Pass auto-cancels
      paymentMethod: "card",
      paymentStatus: "succeeded",
      originalAmount: originalAmount,
      maxCircle: isTrialPass ? 1 : processedMaxCircle, // ✅ Trial Pass: 1 circle
      discountApplied: discountApplied,
      amount: finalAmount,
      currency: "QAR",
      promoCode: isTrialPass ? null : promoCode || null,
      discountPercentage: isTrialPass ? null : finalDiscountPercentage || null,
      automaticSave: true,
      saveMethod: "success_page_automatic_save",
      saveDate: currentDate.toISOString(),
      webhookStatus: "saved_via_success_page",
      sessionId: sessionId,
      // ✅ Trial Pass specific fields
      isTrialPass: isTrialPass,
      trialEndDate: isTrialPass ? periodEnd.toISOString() : null,
      notes: isTrialPass
        ? "Trial Pass - 14 days access, auto-expires"
        : promoCode
        ? `Payment saved with ${finalDiscountPercentage}% discount using promo code ${promoCode}`
        : "Payment saved automatically via success page",
    };

    // console.log("💾 Saving subscription:", {
    //   email,
    //   plan,
    //   isTrialPass,
    //   amount: finalAmount,
    //   periodEnd: periodEnd.toISOString(),
    // });

    // Save to database
    await subscriptionsCollection.updateOne(
      { email: email },
      { $set: subscriptionData },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: isTrialPass
        ? "Trial Pass activated for 14 days"
        : "Payment saved automatically to database",
      email: email,
      plan: plan,
      status: "active",
      isTrialPass: isTrialPass,
      expiresAt: periodEnd.toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in automatic payment save:", error);
    return NextResponse.json(
      { error: "Failed to save payment automatically" },
      { status: 500 }
    );
  }
}

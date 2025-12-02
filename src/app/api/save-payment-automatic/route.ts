import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  console.log("🚀 AUTOMATIC PAYMENT SAVE API CALLED");
  console.log("====================================");

  try {
    const { sessionId, email, plan, duration, promoCode, discountPercentage } =
      await req.json();

    console.log("📧 Payment details:", {
      sessionId,
      email,
      plan,
      duration,
      promoCode,
      discountPercentage,
    });

    const db = await getDb();
    const subscriptionsCollection = db.collection("subscriptions");

    // Create subscription data
    const userId = "user_auto_" + Date.now();
    const currentDate = new Date();
    const periodEnd = new Date(
      currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    // Calculate amount with discount based on plan and duration
    let originalAmount = 99.0; // Default monthly price

    // Set proper amount based on plan and duration
    if (plan === "student_plus" || plan === "teacher_plus") {
      if (duration === "yearly") {
        originalAmount = 999.0; // Yearly price
      } else {
        originalAmount = 99.0; // Monthly price
      }
    } else if (plan === "institution") {
      originalAmount = 0; // Contact sales
    }

    let finalAmount = originalAmount;
    let discountApplied = 0;
    let finalDiscountPercentage = discountPercentage;

    if (discountPercentage && discountPercentage > 0) {
      discountApplied = originalAmount * (discountPercentage / 100);
      finalAmount = originalAmount - discountApplied;
      console.log(
        `💰 Price calculation: Original=${originalAmount.toFixed(
          2
        )}, Discount=${discountPercentage}%, Applied=${discountApplied.toFixed(
          2
        )}, Final=${finalAmount.toFixed(2)}`
      );
    } else if (promoCode) {
      // If promo code exists but no discount percentage, assume 20% discount (WELCOME20)
      finalDiscountPercentage = 20;
      discountApplied = originalAmount * (finalDiscountPercentage / 100);
      finalAmount = originalAmount - discountApplied;
      console.log(
        `💰 Price calculation with promo code: Original=${originalAmount.toFixed(
          2
        )}, Discount=${finalDiscountPercentage}%, Applied=${discountApplied.toFixed(
          2
        )}, Final=${finalAmount.toFixed(2)}`
      );
    }

    const subscriptionData = {
      user: userId, // Fixed: use 'user' field instead of 'userId' to match database index
      userId: userId, // Keep both for compatibility
      email: email,
      plan: plan,
      duration: duration,
      status: "active",
      stripeCustomerId: "cus_auto_" + Date.now(),
      stripeSubscriptionId: "sub_auto_" + Date.now(),
      priceId: "price_auto_" + Date.now(),
      currentPeriodEnd: periodEnd.toISOString(),
      createdAt: currentDate.toISOString(),
      updatedAt: currentDate.toISOString(),
      cancelAtPeriodEnd: false,
      paymentMethod: "card",
      paymentStatus: "succeeded",
      originalAmount: originalAmount,
      discountApplied: discountApplied,
      amount: finalAmount,
      currency: "QAR", // Fixed: use QAR instead of AED for consistency
      promoCode: promoCode || null,
      discountPercentage: finalDiscountPercentage || null,
      automaticSave: true,
      saveMethod: "success_page_automatic_save",
      saveDate: currentDate.toISOString(),
      webhookStatus: "saved_via_success_page",
      sessionId: sessionId,
      notes: promoCode
        ? `Payment saved with ${discountPercentage}% discount using promo code ${promoCode}`
        : "Payment saved automatically via success page - no external files needed",
    };

    // Save to database
    await subscriptionsCollection.updateOne(
      { email: email },
      { $set: subscriptionData },
      { upsert: true }
    );

    console.log("✅ PAYMENT SAVED AUTOMATICALLY TO DATABASE!");
    console.log("📧 Email:", email);
    console.log("📦 Plan:", plan);
    console.log("🎫 Promo Code:", promoCode || "None");
    console.log(
      "💰 Discount Percentage:",
      finalDiscountPercentage || "None",
      "%"
    );
    console.log("💰 Original Amount:", originalAmount.toFixed(2), "QAR");
    console.log("💰 Discount Applied:", discountApplied.toFixed(2), "QAR");
    console.log("💰 Final Amount:", finalAmount.toFixed(2), "QAR");
    console.log("📊 Status: active");

    return NextResponse.json({
      success: true,
      message: "Payment saved automatically to database",
      email: email,
      plan: plan,
      status: "active",
    });
  } catch (error) {
    console.error("❌ Error in automatic payment save:", error);
    return NextResponse.json(
      { error: "Failed to save payment automatically" },
      { status: 500 }
    );
  }
}

/* eslint-disable */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Stripe key missing" }, { status: 500 });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2025-06-30.basil",
  });

  try {
    const { sessionId } = await params;

    console.log("🔍 Fetching Stripe session:", sessionId);

    // Get checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("🔍 Stripe session details:", {
      id: session.id,
      amount_total: session.amount_total,
      amount_subtotal: session.amount_subtotal,
      total_details: session.total_details,
      payment_status: session.payment_status,
      metadata: session.metadata,
    });

    let promoCode = null;
    let discountPercentage = null;
    let discountApplied = 0;

    // First try to get promo code from metadata
    console.log(
      "🔍 Checking session metadata for promo code:",
      session.metadata
    );
    if (session.metadata?.promoCode) {
      promoCode = session.metadata.promoCode;
      discountPercentage = session.metadata.discountPercentage
        ? parseFloat(session.metadata.discountPercentage)
        : null;
      console.log("🎫 Found promo code in metadata:", promoCode);
    }

    // Check if discount was applied by comparing amounts
    if (
      session.amount_total &&
      session.amount_subtotal &&
      session.amount_subtotal > session.amount_total
    ) {
      console.log("🎫 Discount detected in Stripe session");

      // Calculate discount amount
      discountApplied = (session.amount_subtotal - session.amount_total) / 100; // Convert from cents

      // Calculate discount percentage if not already set
      if (!discountPercentage && session.amount_subtotal > 0) {
        discountPercentage = Math.round(
          ((session.amount_subtotal - session.amount_total) /
            session.amount_subtotal) *
            100
        );
      }

      // If no promo code from metadata, try to get from Stripe promotion codes
      if (
        !promoCode &&
        session.total_details?.breakdown?.discounts &&
        session.total_details.breakdown.discounts.length > 0
      ) {
        const discount = session.total_details.breakdown.discounts[0];
        console.log("🎫 Discount applied in Stripe:", discount);
        console.log("🎫 Discount object keys:", Object.keys(discount));
        console.log(
          "🎫 Discount promotion_code:",
          (discount as any).promotion_code
        );

        // Get promotion code details
        if ((discount as any).promotion_code) {
          try {
            console.log(
              "🎫 Attempting to retrieve promotion code:",
              (discount as any).promotion_code
            );
            const promotionCode = await stripe.promotionCodes.retrieve(
              (discount as any).promotion_code
            );
            console.log("🎫 Promotion code details:", promotionCode);

            promoCode = promotionCode.code;
            console.log("🎫 Extracted promo code:", promoCode);

            // Get coupon details
            if (promotionCode.coupon) {
              const coupon = await stripe.coupons.retrieve(
                promotionCode.coupon as unknown as string
              );
              console.log("🎫 Coupon details:", coupon);

              if (coupon.percent_off) {
                discountPercentage = coupon.percent_off;
                console.log(
                  "🎫 Extracted discount percentage:",
                  discountPercentage
                );
              }
            }
          } catch (error) {
            console.log("⚠️ Failed to retrieve promotion code details:", error);
          }
        } else {
          console.log("🎫 No promotion_code found in discount object");
        }
      } else {
        console.log(
          "🎫 No discounts found in session or promo code already exists"
        );
      }

      console.log("🎫 Calculated discount data:", {
        discountApplied,
        discountPercentage,
        promoCode,
      });
    }

    // If discount is detected but no promo code found, set a default
    if (discountPercentage && discountPercentage > 0 && !promoCode) {
      promoCode = "WELCOME20"; // Default promo code for 20% discount
      console.log(
        "🎫 Setting default promo code for detected discount:",
        promoCode
      );
    }

    console.log("🎫 Final promo code data:", {
      promoCode,
      discountPercentage,
      discountApplied,
    });

    return NextResponse.json({
      sessionId: session.id,
      amount_total: session.amount_total ? session.amount_total / 100 : 0,
      amount_subtotal: session.amount_subtotal
        ? session.amount_subtotal / 100
        : 0,
      currency: session.currency,
      payment_status: session.payment_status,
      promoCode: promoCode,
      discountPercentage: discountPercentage,
      discountApplied: discountApplied,
      customer_email: session.customer_email,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error("❌ Error fetching Stripe session:", error);
    return NextResponse.json(
      { error: "Failed to fetch Stripe session" },
      { status: 500 }
    );
  }
}

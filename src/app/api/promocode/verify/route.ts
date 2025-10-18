import { NextRequest, NextResponse } from "next/server";

interface PromoCodeResponse {
  success: boolean;
  code?: string;
  discountPercent?: number;
  discountPercentage?: number;
  description?: string;
  validUntil?: string;
  message?: string;
  valid?: boolean;
  remainingUses?: number;
}

export async function POST(req: NextRequest) {
  try {
    const { promoCode } = await req.json();

    if (!promoCode) {
      return NextResponse.json(
        { success: false, message: "Promo code is required" },
        { status: 400 }
      );
    }

    // Call external API to verify promo code
    const verifyUrl = `https://admin-service-375591904635.us-central1.run.app/api/promocodes/verify/${promoCode}`;
    
    console.log("🎫 Verifying promo code:", promoCode);
    
    const response = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid or expired promo code" 
        },
        { status: 400 }
      );
    }

    const data: PromoCodeResponse = await response.json();

    if (!data.success && !data.valid) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Invalid promo code" 
        },
        { status: 400 }
      );
    }

    // The external API returns discountPercent, we need to map it to discountPercentage
    const discountPercentage = data.discountPercent || data.discountPercentage || 0;

    console.log("✅ Promo code verified:", data);
    console.log("💰 Discount percentage:", discountPercentage);

    return NextResponse.json({
      success: true,
      code: data.code,
      discountPercentage: discountPercentage,
      description: data.description,
      validUntil: data.validUntil,
      remainingUses: data.remainingUses,
      message: `Promo code applied! ${discountPercentage}% discount`,
    });
  } catch (error) {
    console.error("❌ Error verifying promo code:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to verify promo code" 
      },
      { status: 500 }
    );
  }
}

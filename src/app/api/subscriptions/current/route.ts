/* eslint-disable */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let email = null;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      email = decoded.email;
    } catch (jwtError) {
      console.log("JWT decode failed, trying to get email from request body");
      // If JWT fails, try to get email from request
      const body = await req.json().catch(() => null);
      email = body?.email;
    }

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
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
      };

      return NextResponse.json({
        subscription: freePlan,
        message: "Free plan assigned by default",
      });
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

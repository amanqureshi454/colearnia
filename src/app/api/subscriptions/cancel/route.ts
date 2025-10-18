import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const db = await getDb();
    const subscriptionsCollection = db.collection("subscriptions");
    
    // Find the latest subscription for this email
    const latestSubscription = await subscriptionsCollection.findOne(
      { email },
      { sort: { createdAt: -1 } }
    );

    if (!latestSubscription) {
      return NextResponse.json({ 
        error: "No subscription found for this email" 
      }, { status: 404 });
    }

    // Update the subscription to free plan
    const updateResult = await subscriptionsCollection.updateOne(
      { _id: latestSubscription._id },
      { 
        $set: {
          plan: "free",
          status: "cancelled",
          amount: 0,
          currency: "QAR",
          duration: "N/A",
          currentPeriodEnd: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          cancelledAt: new Date().toISOString(),
          cancelReason: "user_requested"
        }
      }
    );

    if (updateResult.modifiedCount === 1) {
      console.log(`✅ Subscription cancelled for ${email} - moved to free plan`);
      return NextResponse.json({ 
        message: "Subscription cancelled successfully. You are now on the Free plan.",
        newPlan: "free"
      });
    } else {
      console.log(`❌ Failed to cancel subscription for ${email}`);
      return NextResponse.json({ 
        error: "Failed to cancel subscription" 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function SuccessPage() {
  // AUTOMATIC DATABASE SAVE - NO EXTERNAL FILES NEEDED
  useEffect(() => {
    const savePaymentAutomatically = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get("session_id");

        if (sessionId) {
          // Get user email from localStorage
          const userData = localStorage.getItem("user");
          const userEmail = userData
            ? JSON.parse(userData).email
            : "unknown@email.com";

          // Get plan info from localStorage (saved during checkout)
          const pendingCheckout = localStorage.getItem("pendingCheckout");
          const planInfo = pendingCheckout
            ? JSON.parse(pendingCheckout)
            : { plan: "teacher_plus", duration: "monthly", maxCircle: null };

          // Fetch session details from Stripe to get promo code information
          let promoCode = null;
          let discountPercentage = null;
          let maxCircle = planInfo.maxCircle || null; // ✅ Get from localStorage first

          try {
            const sessionResponse = await fetch(
              `/api/stripe-session/${sessionId}`
            );
            if (sessionResponse.ok) {
              const sessionData = await sessionResponse.json();
              promoCode = sessionData.promoCode;
              discountPercentage = sessionData.discountPercentage;

              // ✅ Get maxCircle from Stripe session metadata (override if available)
              if (
                sessionData.maxCircle !== undefined &&
                sessionData.maxCircle !== null
              ) {
                maxCircle = sessionData.maxCircle;
              }

              console.log("🎫 Promo code from Stripe session:", promoCode);
              console.log(
                "💰 Discount percentage from Stripe session:",
                discountPercentage
              );
              console.log("🔵 maxCircle from Stripe session:", maxCircle); // ✅ Debug log
            }
          } catch (error) {
            console.log(
              "⚠️ Failed to fetch session details from Stripe:",
              error
            );
          }

          console.log("📦 Sending to save-payment-automatic:", {
            sessionId,
            email: userEmail,
            plan: planInfo.plan,
            duration: planInfo.duration,
            maxCircle, // ✅ Debug log
            promoCode,
            discountPercentage,
          });

          // Call API to save payment
          const response = await fetch("/api/save-payment-automatic", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId: sessionId,
              email: userEmail,
              plan: planInfo.plan,
              duration: planInfo.duration,
              maxCircle: maxCircle, // ✅ ADD THIS LINE
              promoCode: promoCode,
              discountPercentage: discountPercentage,
            }),
          });

          if (response.ok) {
            console.log("✅ Payment saved automatically to database!");
            // ✅ Clear pending checkout after successful save
            localStorage.removeItem("pendingCheckout");
          } else {
            console.log("⚠️ Payment save failed, but continuing...");
          }
        }
      } catch (error) {
        console.log("⚠️ Automatic save error:", error);
      }
    };

    savePaymentAutomatically();
  }, []);

  return (
    <div className="bg-gray-100 h-screen flex justify-center items-center">
      <div className="bg-white p-6 md:mx-auto">
        <svg
          viewBox="0 0 24 24"
          className="text-green-600 w-16 h-16 mx-auto my-6"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Payment Done!
          </h3>
          <p className="text-gray-600 my-2">
            Thank you for completing your secure online payment.
          </p>
          <p> Have a great day! </p>
          <div className="py-10 text-center">
            <Link
              href={"https://uat.studycircleapp.com/"}
              className="px-4 py-3 bg-brand block text-white font-semibold"
            >
              Join Study Circle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

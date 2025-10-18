"use client";

import { useEffect, useState } from "react";

interface SubscriptionData {
  plan: string;
  status: string;
  currentPeriodEnd: string;
  amount: number;
  currency: string;
  duration: string;
}

export default function CurrentPlanDisplay() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchCurrentPlan = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      const response = await fetch("/api/subscriptions/by-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("📊 API Response:", data);
        if (data && data.plan) {
          setSubscription(data);
          console.log("✅ Subscription set:", data);
        } else {
          console.log("❌ No subscription data in response");
        }
      } else {
        console.log("❌ API request failed:", response.status);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    setCancelLoading(true);
    setMessage(null);

    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        setMessage("User not logged in.");
        setCancelLoading(false);
        return;
      }
      const user = JSON.parse(userData);

      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });

      if (response.ok) {
        setMessage(
          "Subscription cancelled successfully. You are now on the Free plan."
        );
        await fetchCurrentPlan(); // Refresh the displayed plan
      } else {
        const errorData = await response.json();
        setMessage(
          `Error cancelling subscription: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      setMessage("An unexpected error occurred during cancellation.");
    } finally {
      setCancelLoading(false);
    }
  };

  console.log(subscription);
  if (!subscription) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          Current Plan
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-green-600">Free Plan</span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            active
          </span>
        </div>
        <div className="mt-4 pt-4 border-t border-green-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Plan includes:</span>
            <span className="font-medium">Basic features</span>
          </div>
        </div>
      </div>
    );
  }

  const formatPlanName = (plan: string) => {
    switch (plan) {
      case "free":
        return "Free Plan";
      case "pro":
        return "Student Pro";
      case "premium":
        return "Student Premium";
      case "teacher_plus":
        return "Teacher Plus";
      case "institution":
        return "Institution";
      default:
        return plan.charAt(0).toUpperCase() + plan.slice(1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  console.log(subscription);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Current Plan
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">
              {formatPlanName(subscription.plan)}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                subscription.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {subscription.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">
            {subscription.amount} {subscription.currency}
          </div>
          <div className="text-sm text-gray-500">
            per {subscription.duration}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Next billing date:</span>
          <span className="font-medium">
            {formatDate(subscription.currentPeriodEnd)}
          </span>
        </div>
      </div>

      {/* Cancel Subscription Button */}
      {subscription.plan !== "free" && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <button
            onClick={handleCancelSubscription}
            disabled={cancelLoading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {cancelLoading ? "Cancelling..." : "Cancel Subscription"}
          </button>
          {message && (
            <p
              className={`mt-2 text-sm text-center ${
                message.includes("Error") ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

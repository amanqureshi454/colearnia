// "use client";

// import { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";

// interface Subscription {
//   plan: string;
//   duration: string;
//   status: string;
//   currentPeriodEnd: string;
//   cancelAtPeriodEnd?: boolean;
//   endDate?: string;
// }

// interface SubscriptionManagerProps {
//   onPlanChange?: () => void;
// }

// const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ onPlanChange }) => {
//   const [subscription, setSubscription] = useState<Subscription | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState<string | null>(null);

//   useEffect(() => {
//     fetchCurrentSubscription();
//   }, []);

//   const fetchCurrentSubscription = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const response = await fetch("/api/subscriptions/current", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setSubscription(data.subscription);
//       }
//     } catch (error) {
//       console.error("Error fetching subscription:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePlanUpdate = async (newPlan: string, newDuration: string) => {
//     try {
//       setActionLoading(`${newPlan}_${newDuration}`);
//       const token = localStorage.getItem("token");

//       const response = await fetch("/api/subscriptions/update", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           newPlan,
//           newDuration,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         toast.success("Plan updated successfully!");
//         await fetchCurrentSubscription();
//         onPlanChange?.();
//       } else {
//         toast.error(data.error || "Failed to update plan");
//       }
//     } catch (error) {
//       console.error("Error updating plan:", error);
//       toast.error("Something went wrong");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleCancelSubscription = async (cancelAtPeriodEnd: boolean = true) => {
//     try {
//       setActionLoading("cancel");
//       const token = localStorage.getItem("token");

//       const response = await fetch("/api/subscriptions/cancel", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           cancelAtPeriodEnd,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         toast.success(data.message);
//         await fetchCurrentSubscription();
//         onPlanChange?.();
//       } else {
//         toast.error(data.error || "Failed to cancel subscription");
//       }
//     } catch (error) {
//       console.error("Error canceling subscription:", error);
//       toast.error("Something went wrong");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleOpenPortal = async () => {
//     try {
//       setActionLoading("portal");
//       const token = localStorage.getItem("token");

//       const response = await fetch("/api/subscriptions/portal", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();
//       if (response.ok && data.url) {
//         window.location.href = data.url;
//       } else {
//         toast.error("Failed to open customer portal");
//       }
//     } catch (error) {
//       console.error("Error opening portal:", error);
//       toast.error("Something went wrong");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "active":
//         return "text-green-600";
//       case "canceled":
//         return "text-red-600";
//       case "canceled_at_period_end":
//         return "text-yellow-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center p-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!subscription) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
//         <h3 className="text-xl font-semibold mb-4">Current Subscription</h3>
//         <div className="text-center p-8">
//           <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
//             <h4 className="text-lg font-semibold text-green-800 mb-2">Free Plan</h4>
//             <p className="text-green-600 mb-4">You're currently on our free plan with basic features.</p>
//             <div className="text-sm text-gray-600">
//               <p>• Unlimited Join Study Circles</p>
//               <p>• Create Circles (Up to 3)</p>
//               <p>• Access Quizzes & Leaderboard</p>
//               <p>• Earn Achievement Badges</p>
//               <p>• Progress Analytics</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
//       <h3 className="text-xl font-semibold mb-4">Current Subscription</h3>

//       <div className="space-y-4">
//         <div className="flex justify-between items-center">
//           <span className="font-medium">Plan:</span>
//           <span className="capitalize">{subscription.plan}</span>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="font-medium">Duration:</span>
//           <span className="capitalize">{subscription.duration}</span>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="font-medium">Status:</span>
//           <span className={`capitalize ${getStatusColor(subscription.status)}`}>
//             {subscription.status.replace("_", " ")}
//           </span>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="font-medium">Current Period Ends:</span>
//           <span>{formatDate(subscription.currentPeriodEnd)}</span>
//         </div>

//         {subscription.endDate && (
//           <div className="flex justify-between items-center">
//             <span className="font-medium">Subscription Ends:</span>
//             <span>{formatDate(subscription.endDate)}</span>
//           </div>
//         )}
//       </div>

//       <div className="mt-6 space-y-3">
//         <h4 className="font-medium">Quick Actions</h4>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           {/* Plan Change Buttons */}
//           {subscription.plan !== "pro" && (
//             <button
//               onClick={() => handlePlanUpdate("pro", subscription.duration)}
//               disabled={actionLoading !== null}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//             >
//               {actionLoading === `pro_${subscription.duration}` ? "Updating..." : "Upgrade to Pro"}
//             </button>
//           )}

//           {subscription.plan !== "premium" && (
//             <button
//               onClick={() => handlePlanUpdate("premium", subscription.duration)}
//               disabled={actionLoading !== null}
//               className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
//             >
//               {actionLoading === `premium_${subscription.duration}` ? "Updating..." : "Upgrade to Premium"}
//             </button>
//           )}

//           {subscription.plan !== "free" && (
//             <button
//               onClick={() => handlePlanUpdate("free", subscription.duration)}
//               disabled={actionLoading !== null}
//               className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
//             >
//               {actionLoading === `free_${subscription.duration}` ? "Downgrading..." : "Downgrade to Free"}
//             </button>
//           )}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           {/* Duration Change Buttons */}
//           {subscription.duration !== "monthly" && (
//             <button
//               onClick={() => handlePlanUpdate(subscription.plan, "monthly")}
//               disabled={actionLoading !== null}
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
//             >
//               {actionLoading === `${subscription.plan}_monthly` ? "Updating..." : "Switch to Monthly"}
//             </button>
//           )}

//           {subscription.duration !== "yearly" && (
//             <button
//               onClick={() => handlePlanUpdate(subscription.plan, "yearly")}
//               disabled={actionLoading !== null}
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
//             >
//               {actionLoading === `${subscription.plan}_yearly` ? "Updating..." : "Switch to Yearly"}
//             </button>
//           )}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           {/* Cancel Buttons */}
//           {subscription.status === "active" && (
//             <button
//               onClick={() => handleCancelSubscription(true)}
//               disabled={actionLoading !== null}
//               className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
//             >
//               {actionLoading === "cancel" ? "Canceling..." : "Cancel at Period End"}
//             </button>
//           )}

//           {subscription.status === "canceled_at_period_end" && (
//             <button
//               onClick={() => handleCancelSubscription(false)}
//               disabled={actionLoading !== null}
//               className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
//             >
//               {actionLoading === "cancel" ? "Canceling..." : "Cancel Immediately"}
//             </button>
//           )}
//         </div>

//         {/* Customer Portal */}
//         <button
//           onClick={handleOpenPortal}
//           disabled={actionLoading !== null}
//           className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
//         >
//           {actionLoading === "portal" ? "Opening..." : "Manage Subscription (Stripe Portal)"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionManager;

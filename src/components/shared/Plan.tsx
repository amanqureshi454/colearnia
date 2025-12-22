import { Check } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { pricingData } from "@/data/pricing";
import PlanCTA from "./PricingBtn";
import RoleRestrictionModal from "./RoleRestrictionModal";
import DowngradeModal from "./DowngradeModal";

export type UserType = "student" | "teacher";
type DurationType = "monthly" | "yearly";

interface PlanProps {
  currentTab: UserType;
  durationTab: DurationType;
}

const PLAN_KEY_MAP: Record<string, string> = {
  Basic: "student_basic",
  Plus: "student_plus",
  "Trial Pass": "student_trial",
  Guest: "student_free",
  "Teacher Plus": "teacher_plus",
  Free: "teacher_free",
};

interface SubscriptionData {
  plan: string;
  status: string;
  currentPeriodEnd: string;
  amount: number;
  currency: string;
  duration: string;
  accessExpiresAt?: string; // ✅ Add this
  trialEndDate?: string;
  isTrialPass?: boolean;
}

gsap.registerPlugin(ScrollTrigger);

const Plan: React.FC<PlanProps> = ({ currentTab, durationTab }) => {
  const pricingRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Modal states
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [attemptedPlanType, setAttemptedPlanType] = useState<string>("");
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [isDowngrading, setIsDowngrading] = useState(false);

  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  const currentPlans = pricingData.plans[currentTab];

  // Check if user can purchase the plan based on their role
  const canUserPurchasePlan = (planType: string): boolean => {
    if (!userRole) return true;

    const isTeacherPlan =
      planType.toLowerCase().includes("teacher") || currentTab === "teacher";
    const isStudentPlan =
      !planType.toLowerCase().includes("teacher") && currentTab === "student";

    if (userRole === "teacher" && isStudentPlan) return false;
    if (userRole === "student" && isTeacherPlan) return false;

    return true;
  };

  // ✅ Show downgrade modal instead of direct action
  const handleDowngradeClick = () => {
    setShowDowngradeModal(true);
  };

  // ✅ Confirm downgrade action
  const handleConfirmDowngrade = async () => {
    const userData =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (!userData) return;

    try {
      setIsDowngrading(true);
      const userEmail = JSON.parse(userData)?.email;

      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Plan will be downgraded at the end of your billing period"
        );
        setShowDowngradeModal(false);
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }, 1500);
      } else {
        toast.error(data.error || "Failed to downgrade plan");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsDowngrading(false);
    }
  };

  const handleFreePlan = async () => {
    const userData =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (!userData) {
      const pathname =
        typeof window !== "undefined" ? window.location.pathname : "";
      const locale = pathname.split("/")[1] || "en";
      if (typeof window !== "undefined") {
        window.location.href = `/${locale}/signin`;
      }
      return;
    }

    const planType = currentTab === "teacher" ? "Teacher Free" : "Student Free";
    if (!canUserPurchasePlan(planType)) {
      setAttemptedPlanType(planType);
      setShowRoleModal(true);
      setLoadingPlan(null);
      setLoading(false);
      return;
    }

    // ✅ If user has subscription, show downgrade modal (don't set loading)
    if (subscription?.plan) {
      setShowDowngradeModal(true);
      setLoadingPlan(null); // ✅ Reset loading immediately
      return;
    }

    // No subscription - just redirect to signin or dashboard
    try {
      setLoading(true);
      const userEmail = JSON.parse(userData)?.email;
      console.log("🆓 Setting up Free plan for:", userEmail);
      toast.success("You're on the Free plan!");
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };
  // Animation effect
  useEffect(() => {
    if (!pricingRef.current) return;

    const boxes = pricingRef.current.querySelectorAll(".pricing-box");
    if (boxes.length === 0) return;

    const ctx = gsap.context(() => {
      boxes.forEach((box, i) => {
        gsap.set(box, { opacity: 0, y: 120 });

        gsap.to(box, {
          scrollTrigger: {
            trigger: pricingRef.current,
            start: "top 70%",
          },
          y: 0,
          delay: i * 0.2,
          opacity: 1,
          duration: 1.5,
          ease: "power",
        });
      });
    }, pricingRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [currentTab]);

  const handleSubscribe = async (
    plan: string,
    duration: string,
    priceId?: string,
    maxCircle?: number
  ) => {
    if (!canUserPurchasePlan(plan)) {
      setAttemptedPlanType(plan);
      setShowRoleModal(true);
      setLoadingPlan(null);
      setLoading(false);
      return;
    }

    const planKey = `${plan}_${duration}`;
    console.log("handleSubscribe called:", { plan, duration, planKey });

    setSelectedPriceId(priceId ?? planKey);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userData =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (!token || !userData) {
      const pathname =
        typeof window !== "undefined" ? window.location.pathname : "";
      const locale = pathname.split("/")[1] || "ar";
      if (typeof window !== "undefined") {
        window.location.href = `/${locale}/signin`;
      }
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan,
          duration,
          token,
          maxCircle: maxCircle === 0 ? null : maxCircle,
          locale:
            typeof window !== "undefined"
              ? window.location.pathname.split("/")[1] || "ar"
              : "ar",
          email: JSON.parse(userData)?.email,
        }),
      });

      const data = await res.json();
      if (data.url) {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "pendingCheckout",
            JSON.stringify({
              email: JSON.parse(userData)?.email,
              plan,
              duration,
              maxCircle: maxCircle === 0 ? null : maxCircle,
              timestamp: Date.now(),
            })
          );

          setTimeout(() => {
            window.location.href = data.url;
          }, 300);
        }
      } else {
        toast.error("Failed to start checkout session");
        setLoadingPlan(null);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setLoadingPlan(null);
      setLoading(false);
    }
  };

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json().catch(() => null);
      const subscription = data?.subscription || data;

      console.log("📦 Fetched subscription:", subscription);

      if (subscription?.plan) {
        setSubscription(subscription);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);

    try {
      const userData = localStorage.getItem("user");
      if (!userData || userData === "undefined") return;

      const user = JSON.parse(userData);
      if (user?.role) {
        setUserRole(user.role);
      }
    } catch (error) {
      console.error("Failed to parse user:", error);
    }
  }, []);

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  // Helper function to check if a plan is active
  // Helper function to check if a plan is active
  const checkIsActive = (planType: string): boolean => {
    if (!subscription) return false;

    // ✅ Check if user has remaining access (even if cancelled)
    const hasAccess =
      subscription.status === "active" ||
      (subscription.status === "cancelled" &&
        subscription.accessExpiresAt &&
        new Date(subscription.accessExpiresAt) > new Date());

    if (!hasAccess) return false;

    // For Trial Pass
    if (planType === "Trial Pass") {
      return (
        subscription?.plan === "student_trial" &&
        subscription?.isTrialPass === true
      );
    }

    // For Guest/Free - active only if plan is "free" or no subscription
    if (planType === "Guest") {
      return (
        subscription?.plan === "free" || subscription?.plan === "student_free"
      );
    }

    // For Teacher Free plan
    if (planType === "Free") {
      return subscription?.plan === "teacher_free";
    }

    // For regular subscription plans
    const mappedPlan = PLAN_KEY_MAP[planType];
    return (
      mappedPlan === subscription?.plan &&
      subscription?.duration === durationTab &&
      !subscription?.isTrialPass
    );
  };

  return (
    <>
      {/* Modals */}
      <RoleRestrictionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        userRole={userRole || ""}
        attemptedPlanType={attemptedPlanType}
      />

      <DowngradeModal
        isOpen={showDowngradeModal}
        onClose={() => {
          setShowDowngradeModal(false);
          setLoadingPlan(null); // ✅ Reset loading state
          setLoading(false); // ✅ Reset loading state
        }}
        onConfirm={handleConfirmDowngrade}
        currentPlan={subscription?.plan || ""}
        endDate={subscription?.currentPeriodEnd || ""}
        isLoading={isDowngrading}
      />

      <div
        ref={pricingRef}
        className={`flex justify-center w-full sm:flex-col tab:flex-row ${
          currentTab === "teacher" ? "gap-5" : "gap-3"
        } tab:flex-wrap items-center sm:mt-6 tab:mt-14 max-w-[1400px] mx-auto tab:px-4`}
      >
        {currentPlans
          ?.filter((plan) =>
            durationTab === "yearly"
              ? plan.type !== "Guest" && plan.type !== "Trial Pass"
              : true
          )
          .map(
            (
              plan: {
                type: string;
                price: { monthly: string; yearly: string };
                time: string;
                description: string;
                benefits: string[];
                buttonText: string;
                maxCircle?: number;
              },
              index: number
            ) => {
              const isActive = checkIsActive(plan.type);
              const isFreeStudentPlan = plan.type === "Student Free";
              const isFreeTeacherPlan = plan.type === "Teacher Free";
              const isFreePlan = isFreeStudentPlan || isFreeTeacherPlan;
              const isInstitutionPlan = plan.type === "Institution";
              const hasSubscription = !!subscription?.plan;

              return (
                <div
                  key={index}
                  className={`pricing-box relative ${
                    currentTab === "student"
                      ? durationTab === "yearly"
                        ? "tab:w-[32%]"
                        : "tab:w-[45%] md:w-[24%]"
                      : "tab:w-[45%] md:w-[32%]"
                  } sm:w-full p-4 rounded-2xl border border-gray-200 flex flex-col overflow-hidden justify-between ${
                    plan.type === "Plus" || plan.type === "Teacher Plus"
                      ? "bg-background"
                      : "bg-white shadow-[0px_4px_9px_0px_#0000000D]"
                  }`}
                >
                  {plan.type === "Plus" || plan.type === "Teacher Plus" ? (
                    <div
                      className={`absolute ${
                        currentTab === "teacher"
                          ? "-left-20 top-28"
                          : "-left-32 top-36"
                      } rounded-full w-[560px] h-[560px] bg-brand`}
                    />
                  ) : null}

                  <div className="flex flex-col relative z-30 gap-4 justify-between h-full">
                    <div className="flex flex-col gap-3">
                      <div className="h-max text-center mt-3">
                        <h3
                          className={`text-3xl font-inter font-semibold ${
                            plan.type === "Plus" || plan.type === "Teacher Plus"
                              ? "text-white"
                              : "text-black"
                          }`}
                        >
                          {plan.type}
                        </h3>

                        <p
                          className={`mt-3 font-inter font-medium text-lg ${
                            plan.type === "Plus" || plan.type === "Teacher Plus"
                              ? "text-white"
                              : "text-paragraph"
                          }`}
                        >
                          {plan.description}
                        </p>

                        <p
                          className={`mt-8 text-4xl font-inter font-extrabold ${
                            plan.type === "Plus" || plan.type === "Teacher Plus"
                              ? "text-white"
                              : "text-black"
                          }`}
                        >
                          {plan.price[durationTab]} QAR
                        </p>
                      </div>

                      {isActive && (
                        <div className="px-4 py-1.5 mx-auto text-center text-sm w-max bg-secondary rounded-lg text-white font-inter font-medium">
                          Active Plan
                        </div>
                      )}

                      <ul
                        className={`mt-3 flex flex-col justify-between md:h-[440px] text-sm ${
                          currentTab === "teacher" ? "p-5" : "p-3"
                        } rounded-xl ${
                          plan.type === "Plus" ? "bg-white" : "bg-[#F9FAFB]"
                        }`}
                      >
                        <div className="space-y-2">
                          {plan.benefits.map((benefit: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <div className="w-6 h-6 bg-heading rounded-full shrink-0 flex justify-center items-center">
                                <Check
                                  size={12}
                                  className="text-white shrink-0"
                                />
                              </div>
                              <p className="text-sm font-inter font-medium text-black">
                                {benefit}
                              </p>
                            </li>
                          ))}
                        </div>

                        <PlanCTA
                          plan={plan}
                          isActive={isActive}
                          hasSubscription={hasSubscription}
                          loading={loading}
                          loadingPlan={loadingPlan}
                          setLoadingPlan={setLoadingPlan}
                          durationTab={durationTab}
                          handleSubscribe={handleSubscribe}
                          handleFreePlan={handleFreePlan}
                          isInstitutionPlan={isInstitutionPlan}
                        />
                      </ul>
                    </div>
                  </div>
                </div>
              );
            }
          )}
      </div>
    </>
  );
};

export default Plan;

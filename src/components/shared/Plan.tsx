import { Check } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import BtnLoader from "../ui/btn-loader";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { pricingData } from "@/data/pricing";
export type UserType = "student" | "teacher";
type DurationType = "monthly" | "yearly";

interface PlanProps {
  currentTab: UserType;
  durationTab: DurationType;
}
const PLAN_KEY_MAP: Record<string, string> = {
  Basic: "student_basic",
  Pro: "student_plus",
  "Trial Pass": "student_trial",
  Guest: "student_trial",
  "Teacher Plus": "teacher_plus",
};
interface SubscriptionData {
  plan: string;
  status: string;
  currentPeriodEnd: string;
  amount: number;
  currency: string;
  duration: string;
}
gsap.registerPlugin(ScrollTrigger);

const Plan: React.FC<PlanProps> = ({ currentTab, durationTab }) => {
  const pricingRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  const currentPlans = pricingData.plans[currentTab];

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

    try {
      setLoading(true);
      const userEmail = JSON.parse(userData)?.email;
      console.log("🆓 Switching to Free plan for:", userEmail);
      // Use the existing cancel subscription API
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Successfully switched to Free plan!");
        // Refresh the page to update the plan display
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }, 1000);
      } else {
        toast.error(data.error || "Failed to switch to Free plan");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Animation effect - moved to Plan component
  useEffect(() => {
    if (!pricingRef.current) return;

    const boxes = pricingRef.current.querySelectorAll(".pricing-box");
    if (boxes.length === 0) return;

    const ctx = gsap.context(() => {
      boxes.forEach((box, i) => {
        gsap.set(box, { opacity: 0, y: 120 });

        gsap.to(box, {
          scrollTrigger: {
            trigger: pricingRef.current, // Trigger on the container itself
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
    priceId?: string
  ) => {
    const planKey = `${plan}_${duration}`;
    console.log("handleSubscribe called:", {
      plan,
      duration,
      priceId,
      planKey,
    });

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          duration,
          token,
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
              timestamp: Date.now(),
            })
          );

          setTimeout(() => {
            window.location.href = data.url;
          }, 300);
        }
      } else {
        toast.error("Failed to start checkout session");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
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

  const normalize = (str: string) => str?.toLowerCase().replace(/\s|_/g, "");

  // console.log(subscription);
  return (
    <div
      ref={pricingRef}
      className={`flex justify-center w-full sm:flex-col tab:flex-row  ${
        currentTab === "teacher" ? "gap-5" : "gap-3"
      } tab:flex-wrap items-center  sm:mt-6 tab:mt-14 max-w-[1400px] mx-auto tab:px-4`}
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
              priceID?: { monthly?: string; yearly?: string };
            },
            index: number
          ) => {
            const isActive =
              subscription?.status === "active" &&
              normalize(subscription?.plan) === normalize(plan.type) &&
              subscription?.duration === durationTab;

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
                      ? "tab:w-[32%]" // ⭐ ADDED → yearly student card width
                      : "tab:w-[45%] md:w-[24%]"
                    : "tab:w-[45%] md:w-[32%]"
                } sm:w-full  p-4 rounded-2xl flex flex-col overflow-hidden justify-between ${
                  plan.type === "Pro" || plan.type === "Teacher Plus"
                    ? "bg-background"
                    : "bg-white shadow-[0px_4px_9px_0px_#0000000D]"
                }`}
              >
                {isActive && (
                  <p className=" absolute top-3 left-3 text-white text-xs rounded-full">
                    Active Plan
                  </p>
                )}
                {plan.type === "Pro" || plan.type === "Teacher Plus" ? (
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
                          plan.type === "Pro" || plan.type === "Teacher Plus"
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        {plan.type}
                      </h3>

                      <p
                        className={`mt-3 font-inter font-medium text-lg ${
                          plan.type === "Pro" || plan.type === "Teacher Plus"
                            ? "text-white"
                            : "text-paragraph"
                        }`}
                      >
                        {plan.description}
                      </p>

                      <p
                        className={`mt-8 text-4xl font-inter font-extrabold ${
                          plan.type === "Pro" || plan.type === "Teacher Plus"
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        {plan.price[durationTab]} QAR
                      </p>
                    </div>
                    {/* {plan.type === "Pro" && (
                    <div className="px-4 py-2.5 mx-auto text-center w-max bg-secondary rounded-xl text-white font-inter font-medium">
                      Save $50 a year
                    </div>
                  )} */}
                    <ul
                      className={`mt-3  flex flex-col justify-between md:h-[440px] text-sm ${
                        currentTab === "teacher" ? "p-5" : "p-3"
                      } rounded-xl ${
                        plan.type === "Pro" ? "bg-white" : " bg-[#F9FAFB]"
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

                      {/* Button Logic */}
                      {/* ────────────────────────────── BUTTON LOGIC ────────────────────────────── */}
                      {isActive ? (
                        // ── 1. CURRENT ACTIVE PLAN → GO TO DASHBOARD ────────────────────────
                        <Link
                          href={
                            process.env.NEXT_PUBLIC_DASHBOARD_URL ||
                            "https://uat.studycircleapp.com/"
                          }
                          className="mt-8 py-4 w-full flex justify-center items-center
               rounded-2xl text-sm font-medium border border-[#727272]
               text-[#3D3B3B] hover:scale-105 transition-all
               duration-200"
                        >
                          Go to Dashboard
                        </Link>
                      ) : isFreePlan && hasSubscription && !isActive ? (
                        // ── 2. USER HAS PAID PLAN → SWITCH TO FREE ───────────────────────────
                        <button
                          onClick={() => {
                            setLoadingPlan(plan.type);
                            handleFreePlan();
                          }}
                          disabled={loading}
                          className={`mt-8 py-4 shadow-[0px_4px_9px_0px_#0000000D] 
               ${
                 plan.type === "Pro" || plan.type === "Teacher Plus"
                   ? "bg-heading text-white"
                   : "bg-white text-heading border border-[#727272]"
               } cursor-pointer hover:scale-105 transition-all
               duration-200 w-full rounded-3xl text-sm font-normal
               flex items-center justify-center gap-2`}
                        >
                          {loading && loadingPlan === plan.type ? (
                            <>
                              <BtnLoader
                                size={24}
                                color={
                                  plan.type.includes("Plus")
                                    ? "#ffffff"
                                    : "#000000"
                                }
                              />
                              Switching to {plan.type}...
                            </>
                          ) : (
                            `Switch to ${plan.type}`
                          )}
                        </button>
                      ) : isInstitutionPlan ? (
                        // ── 3. INSTITUTION → REDIRECT TO CONTACT PAGE ───────────────────────
                        <button
                          onClick={() => {
                            setLoadingPlan(plan.type);
                            // replace with your real contact URL
                            window.location.href = "/contact";
                          }}
                          className={`mt-8 py-4 shadow-[0px_4px_9px_0px_#0000000D] 
               ${
                 plan.type === "Pro" || plan.type === "Teacher Plus"
                   ? "bg-heading text-white"
                   : "bg-white text-heading border border-[#727272]"
               } cursor-pointer hover:scale-105 transition-all
               duration-200 w-full rounded-3xl text-sm font-normal
               flex items-center justify-center gap-2`}
                        >
                          {plan.buttonText}
                        </button>
                      ) : (
                        // ── 4. DEFAULT → SUBSCRIBE (new user / upgrade) ───────────────────────
                        <button
                          onClick={() => {
                            setLoadingPlan(plan.type);

                            const backendPlan = PLAN_KEY_MAP[plan.type];
                            const durationToSend =
                              backendPlan === "student_trial"
                                ? "week"
                                : durationTab;

                            handleSubscribe(
                              backendPlan,
                              durationToSend,
                              backendPlan === "student_trial"
                                ? process.env.NEXT_PUBLIC_STRIPE_TRIAL_PRICE_ID
                                : plan.priceID?.[durationTab]
                            );
                          }}
                          disabled={loading}
                          className={`mt-8 py-4 w-full flex justify-center items-center
               rounded-2xl text-sm font-medium border border-[#727272]
               text-[#3D3B3B] hover:bg-gray-50 hover:scale-105
               transition-all duration-200 disabled:opacity-50
               disabled:cursor-not-allowed`}
                        >
                          {loading && loadingPlan === plan.type ? (
                            <>
                              <BtnLoader
                                size={24}
                                color={
                                  plan.type.includes("Plus")
                                    ? "#ffffff"
                                    : "#000000"
                                }
                              />
                              Redirecting...
                            </>
                          ) : (
                            plan.buttonText
                          )}
                        </button>
                      )}
                      {/* ─────────────────────────────────────────────────────────────────────── */}
                    </ul>
                  </div>
                </div>
              </div>
            );
          }
        )}
    </div>
  );
};

export default Plan;

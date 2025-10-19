import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import BtnLoader from "../ui/btn-loader";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { pricingData } from "@/data/pricing";
type UserType = "I'm Student" | "I'm Teacher";
type DurationType = "monthly" | "yearly";

interface PlanProps {
  currentTab: UserType;
  durationTab: DurationType;
}
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
      className="flex justify-center sm:flex-col tab:flex-row items-center gap-5 sm:mt-6 tab:mt-14 max-w-[1200px] mx-auto tab:px-4"
    >
      {currentPlans?.map(
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
          // const isUserOnThisPlan = subscription?.plan === plan.type;
          const isFreeStudentPlan = plan.type === "Student Free";
          const isFreeTeacherPlan = plan.type === "Teacher Free";
          const isFreePlan = isFreeStudentPlan || isFreeTeacherPlan;
          const isInstitutionPlan = plan.type === "Institution";
          const hasSubscription = !!subscription?.plan;
          // const isNewUser = !hasSubscription;
          return (
            <div
              key={index}
              className={`pricing-box relative border ${
                currentTab === "I'm Student" ? "tab:w-[42%]" : "tab:w-[32%]"
              } sm:w-full border-[#CFCFCF] p-6 rounded-2xl flex flex-col justify-between ${
                plan.type === "Premium" ? "bg-[#FAF6E9]" : "bg-white"
              }`}
            >
              {isActive && (
                <p className="px-3 absolute -top-4 left-1/2 -translate-x-1/2 py-1.5 text-white bg-[#C99E56] font-melodyM text-xs rounded-full">
                  Active Plan
                </p>
              )}
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="h-[140px] mt-3">
                    <h3
                      className={`text-3xl font-melodyB text-[#3D3B3B] font-bold`}
                    >
                      {plan.type}
                    </h3>
                    <p
                      className={`mt-3 font-melodyM font-medium text-[#3D3B3B]  text-xl`}
                    >
                      {plan.description}
                    </p>
                    {!isFreePlan && !isInstitutionPlan && (
                      <p
                        className={`mt-2 text-4xl text-[#3D3B3B] font-inter font-extrabold`}
                      >
                        {plan.price[durationTab]}
                        <span
                          className={`text-xs ${
                            plan.type.includes("Plus")
                              ? "text-white"
                              : "text-[#6F6C90]"
                          } font-normal`}
                        >
                          /{durationTab === "monthly" ? "month" : "year"}
                        </span>
                      </p>
                    )}
                  </div>
                  {/* Button Logic */}
                  {isActive ? (
                    // Active plan → Go to Dashboard (both free & paid)
                    <Link
                      href={
                        process.env.NEXT_PUBLIC_DASHBOARD_URL ||
                        "https://uat.studycircleapp.com/"
                      }
                      className="mt-8 py-4 w-full flex justify-center hover:scale-105 transition-all ease-in-out duration-200 items-center rounded-2xl text-sm font-medium border border-[#727272] text-[#3D3B3B]"
                    >
                      Go to Dashboard
                    </Link>
                  ) : isFreePlan && hasSubscription && !isActive ? (
                    // User already has a paid plan → Show “Switch to Free”
                    <button
                      onClick={() => {
                        setLoadingPlan(plan.type);
                        handleFreePlan();
                      }}
                      className="mt-8 py-4 w-full flex justify-center cursor-pointer hover:scale-105 transition-all ease-in-out duration-200 items-center rounded-2xl text-sm font-medium border border-[#727272] text-[#3D3B3B] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading && loadingPlan === plan.type ? (
                        <>
                          <BtnLoader
                            size={24}
                            color={
                              plan.type.includes("Plus") ? "#ffffff" : "#000000"
                            }
                          />
                          Switching to {plan.type}...
                        </>
                      ) : (
                        `Switch to ${plan.type}`
                      )}
                    </button>
                  ) : isInstitutionPlan ? (
                    // Institution Plan → Contact Sales
                    <button
                      onClick={() => {
                        setLoadingPlan(plan.type);
                        // Contact sales logic
                      }}
                      className="mt-8 py-4 cursor-pointer hover:scale-105 transition-all ease-in-out duration-200 w-full px-4 rounded-2xl text-sm font-normal flex items-center justify-center gap-2 border border-[#727272] text-[#3D3B3B] hover:bg-gray-50"
                    >
                      {plan.buttonText}
                    </button>
                  ) : (
                    // Default → Subscribe (for new users or upgrades)
                    <button
                      onClick={() => {
                        setLoadingPlan(plan.type);
                        handleSubscribe(
                          plan.type.replace(/\s+/g, "_").toLowerCase(),
                          durationTab,
                          plan.priceID?.[durationTab]
                        );
                      }}
                      disabled={loading}
                      className={`mt-8 py-4 cursor-pointer hover:scale-105 transition-all ease-in-out duration-200 w-full px-4 rounded-2xl text-sm font-normal flex items-center justify-center gap-2 ${
                        plan.type.includes("Plus")
                          ? "bg-brand text-white"
                          : "border border-[#727272] text-[#3D3B3B] hover:bg-gray-50"
                      }`}
                    >
                      {loading && loadingPlan === plan.type ? (
                        <>
                          <BtnLoader
                            size={24}
                            color={
                              plan.type.includes("Plus") ? "#ffffff" : "#000000"
                            }
                          />
                          Redirecting...
                        </>
                      ) : (
                        plan.buttonText
                      )}
                    </button>
                  )}

                  <ul className="mt-6 sm:h-max tab:h-[280px] space-y-2 text-sm">
                    {plan.benefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Image
                          src="/images/svg/Check Circle.svg"
                          className="w-6 h-6 object-cover"
                          alt="Check icon"
                          width={24}
                          height={24}
                        />
                        <p className="text-lg font-inter font-medium text-[#3D3B3B]">
                          {benefit}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sm:pt-10 md:pt-20">
                  <div className="flex cursor-pointer items-center gap-1 justify-center">
                    <p className="font-melodyM text-sm text-[#4B5572] font-normal">
                      View full comparison
                    </p>
                    <ArrowRight size={16} className="text-[#4B5572]" />
                  </div>
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

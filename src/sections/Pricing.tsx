"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import { Tab } from "@/components/ui/Tab";
import SplitText from "gsap/SplitText";
import Plan from "@/components/shared/Plan";
import SectionHeader from "@/components/shared/HeadingWrapper";
import SectionWrapper from "@/components/shared/SectionWrapper";

gsap.registerPlugin(ScrollTrigger, SplitText);

type DurationType = "monthly" | "yearly";
type UserType = "student" | "teacher";

interface Type {
  name: string;
  value?: string; // ✅ Make optional for backward compatibility
}

const Pricing = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLHeadingElement>(null);
  const tab = useRef<HTMLDivElement>(null);
  const t2 = useTranslations("tabs");

  const [currentTab, setCurrentTab] = useState<UserType>("teacher");
  const [durationTab, setDurationTab] = useState<DurationType>("monthly");
  const [mounted, setMounted] = useState(false);

  const t = useTranslations("Pricing.pricingOptions");

  useEffect(() => {
    setMounted(true);

    try {
      const userData = localStorage.getItem("user");
      if (!userData || userData === "undefined") return;

      const user = JSON.parse(userData);
      if (user?.role) {
        // Set the current tab based on user role
        if (user.role === "teacher") {
          setCurrentTab("teacher");
        } else if (user.role === "student") {
          setCurrentTab("student");
        }
      }
    } catch (error) {
      console.error("Failed to parse user:", error);
    }
  }, [setCurrentTab]);
  // ✅ FIX 1: Add value property for user type tabs

  const type: Type[] = [
    { name: t2("student"), value: "student" },
    { name: t2("teacher"), value: "teacher" },
  ];

  // ✅ FIX 2: Add value property for duration tabs
  const duration: Type[] = [
    { name: "Monthly", value: "monthly" },
    { name: "Yearly", value: "yearly" },
  ];

  useEffect(() => {
    if (!headingRef.current || !paraRef.current || !tab.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#pricing",
          start: "top 80%",
        },
      });

      const headingSplit = new SplitText(headingRef.current!, {
        type: "lines, words",
        linesClass: "line",
      });

      tl.from(headingSplit.words, {
        duration: 0.8,
        opacity: 0,
        yPercent: 120,
        ease: "power2.out",
        stagger: 0.015,
      });

      const paraSplit = new SplitText(paraRef.current!, {
        type: "lines, words",
        linesClass: "line",
      });

      tl.from(
        paraSplit.words,
        {
          duration: 0.7,
          opacity: 0,
          yPercent: 120,
          ease: "power2.out",
          stagger: 0.01,
        },
        "-=0.5"
      );

      tl.from(
        tab.current,
        {
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5"
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <SectionWrapper>
      <SectionHeader heading={t("title")} subheading={t("description")} />

      <div ref={tab} className="tab mt-8">
        {/* ✅ FIX 3: User Type Tabs with proper value passing */}
        <Tab
          space="px-8 py-3"
          tabColor="bg-heading"
          currentTab={currentTab}
          layoutIdPrefix="studentTab"
          setCurrentTab={(tabValue: string) =>
            setCurrentTab(tabValue as UserType)
          }
          type={type}
        />

        {/* ✅ FIX 4: Duration Tabs with proper value passing */}
        <Tab
          space="px-3 py-1"
          tabColor="bg-secondary"
          currentTab={durationTab}
          layoutIdPrefix="yearTab"
          setCurrentTab={(tabValue: string) =>
            setDurationTab(tabValue as DurationType)
          }
          type={duration}
        />
      </div>

      {/* ✅ Plan Component with Props */}
      <Plan currentTab={currentTab} durationTab={durationTab} />
    </SectionWrapper>
  );
};

export default Pricing;

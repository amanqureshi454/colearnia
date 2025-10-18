"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import { Tab } from "@/components/ui/Tab";
import SplitText from "gsap/SplitText";
import Plan from "@/components/shared/Plan"; // Import the Plan component

gsap.registerPlugin(ScrollTrigger, SplitText);

type UserType = "I'm Student" | "I'm Teacher";
type DurationType = "monthly" | "yearly";

interface Type {
  name: string;
}

const Pricing = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLHeadingElement>(null);
  const tab = useRef<HTMLDivElement>(null);

  const [currentTab, setCurrentTab] = useState<UserType>("I'm Student");
  const [durationTab, setDurationTab] = useState<DurationType>("monthly");

  const t = useTranslations("Pricing.pricingOptions");
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;

  // Define tab types
  const type: Type[] = [{ name: "I'm Student" }, { name: "I'm Teacher" }];
  const duration: Type[] = [{ name: "monthly" }, { name: "yearly" }];

  useEffect(() => {
    if (!headingRef.current || !paraRef.current || !tab.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#pricing",
          start: "top 80%",
        },
      });

      const headingSplit = new SplitText(headingRef.current, {
        type: "lines, words",
        linesClass: "line",
      });

      tl.from(headingSplit.words, {
        duration: 0.8,
        opacity: 0,
        yPercent: 120,
        ease: "power",
        stagger: 0.015,
      });

      const paraSplit = new SplitText(paraRef.current, {
        type: "lines, words",
        linesClass: "line",
      });

      tl.from(
        paraSplit.words,
        {
          duration: 0.7,
          opacity: 0,
          yPercent: 120,
          ease: "power",
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
    <div
      ref={containerRef}
      id="pricing"
      className={`w-full h-full relative bg-background overflow-hidden py-16 px-4 ${
        isRTL ? "font-cairo" : "font-melodyB"
      }`}
    >
      <div dir={isRTL ? "rtl" : "ltr"} className="w-full text-center">
        <h1
          ref={headingRef}
          className="text-brand font-extrabold sm:text-4xl md:text-[55px]"
        >
          {t("title")}
        </h1>
        <h2
          ref={paraRef}
          className={`text-brand text-second ${
            isRTL
              ? "font-cairo font-normal leading-[2]"
              : "font-melodyM leading-[1.5]"
          } font-medium mt-2 sm:text-sm md:text-lg`}
        >
          {t("description")}
        </h2>
      </div>

      <div ref={tab} className="tab">
        <Tab
          space="px-8 py-3"
          tabColor="bg-brand"
          currentTab={currentTab}
          layoutIdPrefix="studentTab"
          setCurrentTab={(tabValue: string) =>
            setCurrentTab(tabValue as UserType)
          }
          type={type}
        />
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

      {/* Plan Component with Props */}
      <Plan currentTab={currentTab} durationTab={durationTab} />

      <div className="absolute sm:hidden tab:block bg-[url('/images/svg/pricing.svg')] bottom-0 left-0 h-[500px] w-full bg-cover bg-no-repeat" />
    </div>
  );
};

export default Pricing;

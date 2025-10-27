"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import SectionWrapper from "@/components/shared/SectionWrapper";
import SectionHeader from "@/components/shared/HeadingWrapper";
import Button from "@/components/shared/Button";

gsap.registerPlugin(SplitText, ScrollTrigger);

const SimpleStep = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("SimpleStep");
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;

  // DATA — Edit this array only
  const steps = [
    {
      id: 1,
      number: "1",
      title: t("step.1.title"),
      description: t("step.1.description"),
    },
    {
      id: 2,
      number: "2",
      title: t("step.2.title"),
      description: t("step.2.description"),
    },
    {
      id: 3,
      number: "3",
      title: t("step.3.title"),
      description: t("step.3.description"),
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    document.fonts.ready.then(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });

      const cards = containerRef.current?.querySelectorAll(".feature-card");
      if (cards && cards.length > 0) {
        tl.from(
          cards,
          {
            opacity: 0,
            y: 100,
            duration: 1,
            ease: "power1.out",
            stagger: 0.18,
          },
          0
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
  return (
    <SectionWrapper>
      <div ref={containerRef} className="">
        <SectionHeader heading={t("Title")} subheading={t("Subtitle")} />
        <div className="flex flex-col tab:flex-row flex-wrap items-center justify-center tab:gap-3 sm:gap-5 md:gap-0 mt-14 mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Card */}
              <div
                dir={isRTL ? "rtl" : "ltr"}
                className="flex flex-col relative feature-card sm:w-full tab:w-[30%]  sm:px-5 tab:px-3 md:px-5 py-6 rounded-xl shadow-[0px_4px_9px_0px_#0000000D] md:max-w-xs bg-white"
              >
                {/* Number Circle */}
                <div
                  className={`tab:absolute sm:relative ${
                    isRTL ? "tab:-right-5" : "tab:-left-5"
                  } tab:-top-5 tab:mb-0 sm:mb-3 bg-secondary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-md z-10`}
                >
                  {step.number}
                </div>

                {/* Title & Description */}
                <h3 className="font-inter font-semibold text-xl text-[#193c51] w-full">
                  {step.title}
                </h3>
                <p className="mt-2 font-inter font-medium text-xs text-paragraph w-full">
                  {step.description}
                </p>
              </div>

              {/* Green Arrow Connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex -ml-1 items-center justify-center w-16 h-8">
                  <Image
                    src="/images/svg/arrow-green.svg"
                    alt="Next step"
                    width={64}
                    height={16}
                    className="w-16 h-4 object-contain"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="pt-10 flex justify-center items-center">
          <Button text={t("StartFree")} />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default SimpleStep;

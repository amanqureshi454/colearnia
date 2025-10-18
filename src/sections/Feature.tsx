"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useCardReveal } from "@/lib/useCardReveal";

gsap.registerPlugin(SplitText, ScrollTrigger);

const Feature = () => {
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const t = useTranslations("how-it-work");
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;

  const feature = [
    {
      title: t("Feature-title-1"),
      description: t("feature-chat"),
      icon: "/images/svg/messages-2.svg",
    },
    {
      title: t("Feature-title-2"),
      description: t("feature-analytics"),
      icon: "/images/svg/status-up.svg",
    },
    {
      title: t("Feature-title-3"),
      description: t("feature-bar"),
      icon: "/images/svg/chart (1).svg",
    },
    {
      title: t("Feature-title-4"),
      description: t("feature-share"),
      icon: "/images/svg/share (1).svg",
    },
  ];

  useCardReveal({
    trigger: "#feature-section",
    headingRef,
    paraRef,
    cardSelector: ".feature-card", // Optional
  });

  return (
    <div
      id="feature-section"
      className={`bg-background w-full px-4 ${
        isRTL ? "font-cairo" : "font-melodyB"
      }`}
    >
      <div className="py-20 md:w-[80%] sm:w-full mx-auto">
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="flex items-center justify-center gap-4"
        >
          <h3
            ref={headingRef}
            className="text-brand font-extrabold leading-normal text-center sm:text-4xl md:text-5xl"
          >
            {t("Feature-Title")}
          </h3>
        </div>
        <p
          ref={paraRef}
          className="text-brand sm:w-full md:w-7/12 mt-5 text-center mx-auto font-medium leading-[28px] sm:text-sm md:text-lg"
        >
          {t("Feature-Description")}
        </p>
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="flex items-center w-full flex-wrap mt-10 justify-center gap-4"
        >
          {feature.map((item, i) => {
            return (
              <div
                key={i}
                className={`feature-card flex bg-secondary sm:h-max tab:h-[160px] sm:flex-col tab:flex-row rounded-xl sm:w-full tab:w-[49%] sm:justify-center tab:justify-start gap-6 px-6 py-4 items-center ${
                  isRTL ? "font-cairo" : "font-inter"
                }`}
              >
                <div className="w-max">
                  <Image
                    src={item.icon}
                    alt="Feature"
                    width={60}
                    height={60}
                    className="w-16 h-16 object-cover"
                  />
                </div>
                <div dir={isRTL ? "rtl" : "ltr"} className="w-full">
                  <h4 className="text-white text-lg font-bold">{item.title}</h4>
                  <p className="text-white mt-2 leading-normal font-light text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Feature;

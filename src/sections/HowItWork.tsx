"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SectionHeader from "@/components/shared/HeadingWrapper";
import SectionWrapper from "@/components/shared/SectionWrapper";

gsap.registerPlugin(ScrollTrigger);

const HowItWork = () => {
  const t = useTranslations("studyValue");
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;

  // -------------------------------------------------
  // 1. DATA – edit / extend this array only
  // -------------------------------------------------
  const features = [
    {
      id: 1,
      image: "/images/svg/feature (2).svg",
      title: t("feature.0.title"),
      description: t("feature.0.desc"),
    },
    {
      id: 2,
      image: "/images/svg/feature (1).svg",
      title: t("feature.1.title"),
      description: t("feature.1.desc"),
    },
    {
      id: 3,
      image: "/images/svg/feature (3).svg",
      title: t("feature.2.title"),
      description: t("feature.2.desc"),
    },
  ];

  // -------------------------------------------------

  // Card Reveal Animation
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
    <div
      id="how-it-work"
      ref={containerRef}
      className="w-full h-full relative z-40"
    >
      <SectionWrapper>
        <SectionHeader heading={t("Title")} subheading={t("Subtitle")} />

        {/* ---- LOOP OVER FEATURES ---- */}
        <div className="flex flex-col tab:flex-row gap-8 md:gap-12 tab:mt-14 sm:mt-7 justify-center items-center overflow-hidden">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="feature-card flex flex-col gap-2 items-center text-center"
            >
              <Image
                alt={feature.title}
                className="md:w-44 md:h-44 sm:w-32 sm:h-32 rounded-full object-cover"
                width={176}
                height={176}
                src={feature.image}
              />
              <h2 className="font-inter font-semibold sm:text-xl tab:text-2xl md:text-3xl mt-4 text-heading">
                {feature.title}
              </h2>
              <p className="font-inter font-medium sm:text-sm md:text-lg text-heading">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
};

export default HowItWork;

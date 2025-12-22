"use client";

import { useSplitTextAnimation } from "@/lib/useSectionReveal";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import Button from "@/components/shared/Button";
import SectionWrapper from "@/components/shared/SectionWrapper";

gsap.registerPlugin(ScrollTrigger, SplitText);
const About = () => {
  const t = useTranslations("about");
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const featureListRef = useRef<HTMLUListElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isRTL = pathname?.startsWith("/ar") ?? false;

  useSplitTextAnimation({
    headingRef,
    paraRef,
    triggerId: "about",
  });

  const features = [
    t("features.0") || "Built by educators",
    t("features.1") || "Designed for motivation & accountability",
    t("features.2") || "Clear progress tracking",
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true, // 👈 prevents re-fire bugs
        },
      });

      // === Feature List Animation ===
      if (featureListRef.current) {
        const featureItems = featureListRef.current.querySelectorAll("li");

        gsap.set(featureItems, {
          opacity: 0,
          y: 20,
        });

        tl.to(featureItems, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
        });
      }

      // === Buttons Animation ===
      if (buttonsRef.current) {
        tl.from(
          buttonsRef.current.children,
          {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15,
          },
          "-=0.3"
        );
      }

      // === Image Animation ===
      if (imageRef.current) {
        gsap.set(imageRef.current, {
          opacity: 0,
          scale: 1.05,
        });

        tl.to(
          imageRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=0.6"
        );
      }

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert(); // 👈 cleans ONLY this section
    };
  }, []);

  return (
    <SectionWrapper>
      <div
        ref={containerRef}
        id="about"
        className={`w-full h-full relative flex justify-between tab:flex-row sm:flex-col gap-8  items-center `}
      >
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="tab:w-1/2 sm:w-full flex flex-col gap-4 items-center"
        >
          <h1
            ref={headingRef}
            className=" w-full text-heading leading-[1.2] font-bold font-inter sm:text-4xl tab:text-3xl md:text-5xl"
          >
            {t("Title")}
          </h1>
          <p
            ref={paraRef}
            className="tab:text-lg  sm:text-sm font-inter font-medium tab:mt-3 text-paragraph w-full"
          >
            {t("subtitle")}
          </p>
          <ul ref={featureListRef} className="space-y-3 w-full tab:mt-3">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Image
                    src="/images/svg/check.svg"
                    className="w-5 h-5 object-cover"
                    alt="check"
                    width={20}
                    height={20}
                  />
                </div>
                <span className={` font-inter text-lg text-black font-medium`}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
          <div ref={buttonsRef} className="flex flex-row gap-4 w-full tab:mt-5">
            <Button text={t("AboutCTA1")} />
            <button className="w-max  px-5 py-3.5 text-center duration-200 border border-heading ease-in-out hover:scale-105  rounded-full cursor-pointer sm:text-sm md:text-lg font-inter font-medium flex justify-center items-center gap-2 bg-transparent text-black">
              <span className="text-black">{t("AboutCTA2")}</span>
            </button>
          </div>
        </div>
        <div
          ref={imageRef}
          className="tab:w-1/2 sm:w-full h-[420px] rounded-2xl"
        >
          <Image
            width={300}
            height={350}
            src="/images/svg/about.svg"
            className="w-full h-full rounded-2xl object-cover"
            alt="About us"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;

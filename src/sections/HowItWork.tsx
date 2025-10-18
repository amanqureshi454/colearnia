"use client";

import { useSplitTextAnimation } from "@/lib/useSectionReveal";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HowItWork = () => {
  const t = useTranslations("Hero");
  const headingRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;

  useSplitTextAnimation({
    headingRef,
    triggerId: "how-it-work",
  });

  useEffect(() => {
    if (!imageWrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(imageWrapperRef.current, { opacity: 0, scale: 1.05, y: 100 });

      gsap.to(imageWrapperRef.current, {
        scrollTrigger: {
          trigger: imageWrapperRef.current,
          start: "top 80%",
        },
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }, imageWrapperRef); // ✅ scoped only to that ref

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="how-it-work"
      className={`w-full h-full bg-brand ${
        isRTL ? "font-cairo" : "font-melodyB"
      } relative py-16`}
    >
      <div dir={isRTL ? "rtl" : "ltr"} className="w-full h-full px-4">
        <h1
          ref={headingRef}
          className="text-center text-third font-extrabold sm:text-4xl md:text-5xl"
        >
          {t("How-it")}
        </h1>
      </div>

      {/* ✅ Animate this visible wrapper */}
      <div className="overflow-hidden">
        <div
          ref={imageWrapperRef}
          className="w-full mt-5 flex justify-center opacity-0 transition-opacity duration-700"
        >
          <Image
            src="/images/png/how-it.png"
            alt="How it works"
            width={1000}
            height={500}
            className="md:w-9/12 sm:w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default HowItWork;

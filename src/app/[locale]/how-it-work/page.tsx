"use client";

import Button from "@/components/shared/Button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ForTeacher from "@/sections/ForTeacher";
import ForStudent from "@/sections/ForStudent";
import Feature from "@/sections/Feature";
import { useHeroReveal } from "@/lib/useHeroReveal";
gsap.registerPlugin(SplitText);
const Page = () => {
  const t = useTranslations("how-it-work");
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;

  useHeroReveal({
    headingRef,
    paraRef,
    buttonSelector: ".hero-button",
    bgSelector: ".hero-bg-wrapper",
  });

  return (
    <>
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={`w-full font-melodyB h-full bg-background relative tab:pt-[160px] sm:pt-[150px]  ${
          isRTL ? "font-cairo" : "font-melodyB"
        }`}
      >
        <div className="flex justify-between gap-8 pb-6 items-center px-4 sm:w-full sm:flex-col md:flex-row tab:w-[90%] mx-auto">
          <div className="md:w-1/2 sm:w-full h-full">
            <div className="relative z-20 gap-4 mx-auto flex flex-col justify-start items-start">
              <h1
                ref={headingRef}
                className={`tab:text-[4.6em] ${
                  isRTL ? "font-cairo " : "font-melodyM "
                } sm:text-5xl font-bold text-brand leading-[1.3] `}
              >
                {t("Title")}
              </h1>
              <p
                ref={paraRef}
                className={`text-xl  ${
                  isRTL ? "font-cairo font-normal" : "font-melodyM "
                } font-medium sm:text-sm md:text-lg  leading-[1.8] text-[#434957]`}
              >
                {t("Subtitle")}
              </p>
              <div className="hero-button">
                <Button
                  style="bg-third sm:w-[180px] md:w-[230px] mt-5"
                  text={t("CTA_Button")}
                />
              </div>
            </div>
          </div>
          <div className="md:w-1/2 sm:w-full h-full">
            <Image
              src="/images/png/how-it-work (1).png"
              alt="How it Works"
              height={500}
              className={`w-full hero-bg-wrapper sm:object-cover ${
                isRTL ? "tab:-ml-16 sm:m-0" : "sm:m-0 tab:-mr-16"
              } h-full tab:object-contain`}
              width={700}
            />
          </div>
        </div>
      </div>
      <ForTeacher />
      <ForStudent />
      <Feature />
    </>
  );
};

export default Page;

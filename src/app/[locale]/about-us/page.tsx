"use client";

import Button from "@/components/shared/Button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { useCardReveal } from "@/lib/useCardReveal";
import { useHeroReveal } from "@/lib/useHeroReveal";
const Page = () => {
  const t = useTranslations("About");
  const pathname = usePathname();
  const headingRef = useRef(null);
  const headingRef2 = useRef<HTMLHeadingElement>(null);
  const paraRef2 = useRef<HTMLParagraphElement>(null);
  const paraRef = useRef(null);
  const isRTL = pathname?.startsWith("/ar") ?? false;
  const studentCards = [
    {
      title: t("different-title-1"),
      description: t("different-subtitle-1"),
    },
    {
      title: t("different-title-2"),
      description: t("different-subtitle-2"),
    },
    {
      title: t("different-title-3"),
      description: t("different-subtitle-3"),
    },
    {
      title: t("different-title-4"),
      description: t("different-subtitle-4"),
    },
  ];

  useHeroReveal({
    headingRef,
    paraRef,
    buttonSelector: ".hero-button",
    bgSelector: ".hero-bg-wrapper",
  });
  useCardReveal({
    trigger: "#different",
    headingRef: headingRef2,
    paraRef: paraRef2,
    cardSelector: ".about-card", // Optional
  });
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#about-2",
          start: "top 50%",
        },
      });

      // Step 1: Fade in whole section
      tl.from("#about-2", {
        opacity: 0,
        duration: 0.6,
        ease: "power1.out",
      });

      // Step 2: SplitText animation (only after reveal)
      const headingSplit = new SplitText(".mission-head", {
        type: "lines, words",
        linesClass: "line",
      });

      const paraSplit = new SplitText(".mission-sub", {
        type: "lines, words",
        linesClass: "line",
      });

      const headingWords = headingSplit.words;
      const paraWords = paraSplit.words;

      tl.from(
        headingWords,
        {
          duration: 0.8,
          opacity: 0,
          yPercent: 120,
          ease: "power1",
          stagger: 0.035,
        },
        "-=0.1" // slight overlap with fade-in if desired
      );

      tl.from(
        paraWords,
        {
          duration: 0.7,
          opacity: 0,
          yPercent: 120,
          ease: "power1",
          stagger: 0.018,
        },
        "-=0.5"
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`w-full font-melodyB h-full bg-background relative tab:pt-[160px] sm:pt-[150px]  ${
        isRTL ? "font-cairo" : "font-melodyB"
      }`}
    >
      <div className="flex justify-between gap-8 items-center px-4 sm:w-full sm:flex-col md:flex-row md:w-[90%] mx-auto">
        <div className="md:w-5/12 sm:w-full h-full">
          <Image
            src="/images/png/about.png"
            alt="How it Works"
            height={500}
            className={`w-full hero-bg-wrapper sm:object-cover h-full md:object-contain`}
            width={600}
          />
        </div>
        <div className="md:w-1/2 sm:w-full h-full">
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className="relative z-20 gap-4 mx-auto flex flex-col justify-start items-start"
          >
            <h1
              ref={headingRef}
              className={`md:text-[70px] ${
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
            <div className="hero-button overflow-hidden">
              <Button
                style="bg-third sm:w-[180px] md:w-[230px] mt-5"
                text={t("CTA_Button")}
              />
            </div>
          </div>
        </div>
      </div>
      <div id="about-2" className="relative mt-20 ">
        <Image
          src="/images/png/image (4).png"
          alt="Target Background"
          width={1000}
          height={600}
          className="w-full tab:h-[600px] sm:h-[450px] object-cover"
        />

        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="absolute top-1/2 tab:left-28 -translate-y-1/2 bg-white md:px-10 md:py-16 sm:p-5 rounded-4xl shadow-xl sm:left-1/2 sm:-translate-x-1/2 tab:-translate-x-0 tab:w-[90%] sm:w-10/12 max-w-lg text-center z-10"
        >
          <h3
            className={`md:text-3xl mission-head sm:text-2xl ${
              isRTL ? "font-cairo" : "font-melodyM"
            } font-semibold text-brand mb-3`}
          >
            {t("our-mission")}
          </h3>
          <p
            className={`text-[#434957] ${
              isRTL ? "font-cairo" : "font-melodyM"
            } mission-sub md:text-sm sm:text-sm leading-relaxed mb-5`}
          >
            {t("our-mission-sub")}
          </p>
          <div
            className={`flex justify-center ${
              isRTL ? "font-cairo" : "font-inter"
            } gap-4 flex-wrap`}
          >
            <button className="bg-third text-white px-6 py-2.5 rounded-lg text-sm font-medium">
              {t("get-started-btn")}
            </button>
            <button className=" bg-brand text-third px-6 py-2.5 rounded-lg text-sm font-medium ">
              {t("Contact-btn")}
            </button>
          </div>
        </div>
      </div>
      <div
        id="different"
        className={`bg-background px-4 w-full ${
          isRTL ? "font-cairo" : "font-melodyB"
        }`}
      >
        {" "}
        <div dir={isRTL ? "rtl" : "ltr"} className="py-20 md:w-[90%] mx-auto">
          <div className="flex items-center justify-center gap-4">
            <h3
              ref={headingRef2}
              className="text-brand font-extrabold leading-normal text-center ta sm:text-4xl md:text-5xl"
            >
              {t("What Makes Us Different ?")}
            </h3>
          </div>
          <p
            ref={paraRef2}
            className=" text-brand/80 sm:w-full md:w-7/12 mt-3 text-center mx-auto  font-medium leading-[20px] sm:text-sm md:text-lg"
          >
            {t("Different-sub")}
          </p>
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className="flex items-center sm:flex-col md:flex-row mt-10 justify-center gap-4"
          >
            {studentCards.map((teacher, i) => {
              return (
                <div
                  dir={isRTL ? "rtl" : "ltr"}
                  style={{ boxShadow: "0px 1.2px 4.79px 0px #19213D14" }}
                  key={i}
                  className="bg-brand about-card h-[240px] sm:w-full md:w-1/4 rounded-2xl px-4 py-3  gap-2 "
                >
                  <div
                    dir={isRTL ? "rtl" : "ltr"}
                    className={`flex flex-col h-full gap-3 items-center justify-center  ${
                      isRTL ? "font-cairo" : "font-melodyB"
                    }`}
                  >
                    <h4
                      className={`text-white text-center  ${
                        isRTL ? "font-cairo" : "font-inter"
                      } font-bold text-5xl`}
                    >
                      0{i + 1}
                    </h4>
                    <h4 className="text-white text-center font-bold text-xl">
                      {teacher.title}
                    </h4>
                    <p
                      className={`text-white text-center  ${
                        isRTL ? "font-cairo" : "font-inter"
                      } text-xs`}
                    >
                      {teacher.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

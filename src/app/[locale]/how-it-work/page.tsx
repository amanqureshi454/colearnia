"use client";

import Button from "@/components/shared/Button";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import SectionWrapper from "@/components/shared/SectionWrapper";
import HeroParagraph from "@/components/shared/HeroParagraph";
import HeroHeadingTitle from "@/components/shared/HeroHeadingTitle";

import { Tab } from "@/components/ui/Tab";
import { useStepsData } from "@/data/feature";
import SectionHeader from "@/components/shared/HeadingWrapper";
import Link from "next/link";

export type UserType = "student" | "teacher";

interface Type {
  name: string;
  value: UserType;
}

gsap.registerPlugin(SplitText, ScrollTrigger);

const Page = () => {
  const t = useTranslations("how-it-work");
  const t2 = useTranslations("tabs");
  const pathname = usePathname();
  const { stepStudent, stepTeacher } = useStepsData();

  /* ---------- Refs ---------- */
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const heroParaRef = useRef<HTMLParagraphElement>(null);
  const heroCtaBtnRef = useRef<HTMLButtonElement>(null);
  const heroWatchBtnWrapperRef = useRef<HTMLDivElement>(null);
  const heroImageWrapperRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);

  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const aboutContainerRef = useRef<HTMLDivElement>(null);
  const aboutHeadingRef = useRef<HTMLHeadingElement>(null);
  const aboutParaRef = useRef<HTMLParagraphElement>(null);
  const aboutFeatureListRef = useRef<HTMLUListElement>(null);
  const aboutImageWrapperRef = useRef<HTMLDivElement>(null);
  const aboutButtonsWrapperRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  /* ---------- State ---------- */
  const [currentTab, setCurrentTab] = useState<UserType>("student");
  const isRTL = pathname?.startsWith("/ar") ?? false;

  // ✅ FIX: Add value property with actual state values
  const type: Type[] = [
    { name: t2("student"), value: "student" },
    { name: t2("teacher"), value: "teacher" },
  ];

  // ✅ Get correct steps based on currentTab value
  const steps = currentTab === "student" ? stepStudent : stepTeacher;

  const features = [
    t("features.0") || "Built by educators",
    t("features.1") || "Designed for motivation & accountability",
    t("features.2") || "Clear progress tracking",
  ];

  /* -------------------------------------------------
     1. HERO ANIMATION
     ------------------------------------------------- */
  useEffect(() => {
    let ctx: gsap.Context;

    const init = () => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // === HERO HEADING ===
        if (heroHeadingRef.current) {
          const split = new SplitText(heroHeadingRef.current, {
            type: "lines, words",
            linesClass: "line",
          });
          tl.from(split.words, {
            duration: 0.8,
            opacity: 0,
            yPercent: 120,
            ease: "power1.out",
            stagger: 0.035,
          });
        }

        // === HERO PARAGRAPH ===
        if (heroParaRef.current) {
          const split = new SplitText(heroParaRef.current, {
            type: "lines, words",
            linesClass: "line",
          });
          tl.from(
            split.words,
            {
              duration: 0.7,
              opacity: 0,
              yPercent: 120,
              ease: "power1.out",
              stagger: 0.018,
            },
            "-=0.5"
          );
        }

        // === CTA BUTTONS ===
        const cta = heroCtaBtnRef.current;
        const watch = heroWatchBtnWrapperRef.current;
        if (cta || watch) {
          tl.from(
            [cta, watch].filter(Boolean),
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

        // === HERO IMAGE ===
        const img = heroImageRef.current || heroImageWrapperRef.current;
        if (img) {
          tl.from(
            img,
            {
              opacity: 0,
              scale: 1.05,
              duration: 1.2,
              ease: "power2.out",
            },
            "-=0.8"
          );
        }

        // === BACKGROUND WRAPPER ===
        if (heroImageWrapperRef.current) {
          tl.from(
            heroImageWrapperRef.current,
            {
              opacity: 0,
              scale: 1.05,
              duration: 1.2,
              ease: "power2.out",
            },
            "-=1.2"
          );
        }
      });
    };

    const raf = requestAnimationFrame(init);
    return () => {
      cancelAnimationFrame(raf);
      ctx?.revert();
    };
  }, []);
  /* -------------------------------------------------
     2. STEPS ANIMATION - Re-run when tab changes
     ------------------------------------------------- */
  useEffect(() => {
    if (!stepsContainerRef.current) return;

    const ctx = gsap.context(() => {
      const cards =
        stepsContainerRef.current!.querySelectorAll(".feature-card");

      gsap.from(cards, {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: "power1.out",
        stagger: 0.18,
        scrollTrigger: {
          trigger: stepsContainerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, stepsContainerRef);

    return () => ctx.revert();
  }, [currentTab]); // Re-animate when tab changes

  /* -------------------------------------------------
     3. ABOUT SECTION ANIMATION
     ------------------------------------------------- */
  useEffect(() => {
    if (!aboutContainerRef.current) return;

    let ctx: gsap.Context;

    const init = () => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: aboutContainerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        // === ABOUT HEADING ===
        if (aboutHeadingRef.current) {
          const split = new SplitText(aboutHeadingRef.current, {
            type: "lines, words",
            linesClass: "line",
          });
          tl.from(split.words, {
            opacity: 0,
            yPercent: 100,
            duration: 0.8,
            stagger: 0.03,
            ease: "power2.out",
          });
        }

        // === ABOUT PARAGRAPH ===
        if (aboutParaRef.current) {
          const split = new SplitText(aboutParaRef.current, {
            type: "lines, words",
            linesClass: "line",
          });
          tl.from(
            split.words,
            {
              opacity: 0,
              yPercent: 80,
              duration: 0.7,
              stagger: 0.02,
            },
            "-=0.5"
          );
        }

        // === FEATURE LIST ===
        if (aboutFeatureListRef.current) {
          const items = aboutFeatureListRef.current.querySelectorAll("li");
          gsap.set(items, { opacity: 0, y: 20 });
          tl.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
          });
        }

        // === ABOUT IMAGE ===
        if (aboutImageWrapperRef.current) {
          gsap.set(aboutImageWrapperRef.current, { opacity: 0, scale: 1.05 });
          tl.to(aboutImageWrapperRef.current, {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
          });
        }

        // === STEP CARDS ===
        const cards =
          aboutContainerRef.current?.querySelectorAll(".feature-card") || [];
        if (cards.length) {
          tl.from(
            cards,
            {
              opacity: 0,
              y: 100,
              duration: 1,
              ease: "power1.out",
              stagger: 0.18,
            },
            "-=0.6"
          );
        }
      }, aboutContainerRef);
    };

    const raf = requestAnimationFrame(init);
    return () => {
      cancelAnimationFrame(raf);
      ctx?.revert();
    };
  }, [currentTab, t]);

  return (
    <>
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="w-full font-inter h-full bg-white sm:pt-20 tab:pt-0 relative overflow-x-hidden"
      >
        <div className="absolute bg-[#FFD6D6] blur-[400px] rounded-full w-[600px] h-[600px] -top-20 right-0" />

        {/* ==================== HERO ==================== */}
        <SectionWrapper>
          <div className="flex tab:flex-row w-full sm:flex-col min-h-[70vh] justify-between items-center lg:gap-6 sm:gap-5">
            <div className="flex gap-2 tab:w-7/12 sm:w-full flex-col">
              <div className="flex gap-4 relative w-full z-20 flex-col">
                <HeroHeadingTitle
                  headingRef={heroHeadingRef}
                  isRTL={isRTL}
                  t={t}
                />
                <HeroParagraph paraRef={heroParaRef} isRTL={isRTL} t={t} />
              </div>

              <div
                ref={heroWatchBtnWrapperRef}
                className="flex flex-row flex-wrap tab:gap-4 sm:gap-2 mt-5"
              >
                <Button text={t("CTA_Button")} />
                <button className="w-max px-6 sm:px-4 sm:py-3 text-center transition-transform duration-200 ease-in-out hover:scale-105 rounded-full cursor-pointer sm:text-sm md:text-lg font-inter font-semibold flex justify-center items-center gap-2 bg-transparent text-black">
                  <Image
                    src="/images/svg/play.svg"
                    alt="Play"
                    className="w-8 h-8 object-cover"
                    width={28}
                    height={28}
                  />
                  <span className="text-black">{t("Watch")}</span>
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div
              ref={heroImageWrapperRef}
              className="rounded-2xl tab:w-6/12 sm:w-full sm:h-[300px] tab:h-full relative z-30 aspect-square h-full"
            >
              <Image
                ref={heroImageRef}
                src="/images/png/how-it.png"
                width={600}
                height={600}
                className="w-full h-full object-contain"
                alt="How it works"
                priority
              />
            </div>
          </div>
        </SectionWrapper>

        {/* ==================== TABS + STEPS ==================== */}
        <SectionWrapper>
          <div ref={stepsContainerRef} className="">
            {/* ✅ Fixed Tab Component */}
            <Tab
              space="px-8 py-4"
              className="border tab:mb-10 border-gray-300 w-max rounded-md mx-auto"
              tabColor="bg-secondary"
              currentTab={currentTab}
              layoutIdPrefix="studentTab"
              setCurrentTab={(v) => setCurrentTab(v as UserType)}
              type={type}
            />

            <SectionHeader
              heading={
                currentTab === "student" ? t("studentTitle") : t("teacherTitle")
              }
              subheading={
                currentTab === "student" ? t("studentDesc") : t("teacherDesc")
              }
            />

            <div className="flex flex-col tab:flex-row flex-wrap items-center justify-center tab:gap-3 sm:gap-5 w-full md:gap-0 mt-14 mx-auto">
              {steps.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <div
                    dir={isRTL ? "rtl" : "ltr"}
                    className={`feature-card flex flex-col relative sm:w-full ${
                      currentTab === "teacher"
                        ? "tab:w-[20%] min-h-[200px]"
                        : "tab:w-[30%]"
                    } sm:px-5 tab:px-3 md:px-4 py-6 rounded-xl shadow-[0px_4px_9px_0px_#0000000D] md:max-w-xs bg-white`}
                  >
                    <div
                      className={`tab:absolute sm:relative ${
                        isRTL ? "tab:-right-5" : "tab:-left-5"
                      } tab:-top-5 tab:mb-0 sm:mb-3 bg-[#0E76A8] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-md z-10`}
                    >
                      {step.number}
                    </div>

                    <Image
                      className="w-12 mb-3 mx-auto h-12 object-cover"
                      alt={step.title}
                      src={step.src}
                      width={48}
                      height={48}
                    />

                    <h3 className="font-inter text-center font-semibold text-xl text-[#193c51] w-full">
                      {step.title}
                    </h3>
                    <p className="mt-2 font-inter text-center font-medium text-xs text-paragraph w-full">
                      {step.description}
                    </p>
                  </div>

                  {idx < steps.length - 1 && (
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
          </div>
        </SectionWrapper>

        {/* ==================== ABOUT SECTION ==================== */}
        <SectionWrapper>
          <div
            ref={aboutContainerRef}
            id="about"
            className="w-full h-full relative flex justify-between tab:flex-row sm:flex-col gap-8 items-center"
          >
            <div
              dir={isRTL ? "rtl" : "ltr"}
              className="tab:w-1/2 sm:w-full flex flex-col gap-4 items-center"
            >
              <h1
                ref={aboutHeadingRef}
                className="w-full text-heading leading-[1.2] font-bold font-inter sm:text-4xl tab:text-3xl md:text-5xl"
              >
                {t("A Circle in Action")}
              </h1>

              <p
                ref={aboutParaRef}
                className="tab:text-lg sm:text-sm font-inter font-medium tab:mt-3 text-paragraph w-full"
              >
                {t("EachCircle")}
              </p>

              <ul
                ref={aboutFeatureListRef}
                className="space-y-3 w-full tab:mt-3"
              >
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Image
                      src="/images/svg/check.svg"
                      className="w-5 h-5 object-cover flex-shrink-0"
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="font-inter text-lg text-black font-medium">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <div ref={aboutButtonsWrapperRef} className="mt-6 flex gap-4" />
            </div>

            <div
              ref={aboutImageWrapperRef}
              className="tab:w-1/2 sm:w-full sm:h-[300px] tab:h-[420px] rounded-2xl"
            >
              <Image
                width={300}
                height={350}
                src="/images/png/student.png"
                className="w-full h-full rounded-2xl object-contain"
                alt="About us"
              />
            </div>
          </div>
        </SectionWrapper>

        {/* ==================== CTA ==================== */}
        <SectionWrapper>
          <div
            className={`w-full bg-[url('/images/png/cta-how.png')] relative max-w-7xl mx-auto mb-14 rounded-4xl sm:h-84 tab:h-102 
                bg-cover bg-center overflow-hidden`}
          >
            <div className="relative flex h-full gap-4 items-center justify-center flex-col p-3 text-center">
              <h1 className="text-center w-full text-white font-bold font-inter sm:text-4xl md:text-5xl">
                {t("CTATitle")}
              </h1>

              {/* Buttons */}
              <div className="flex flex-row gap-4 mt-5">
                <Link href={`/${locale}#pricing`}>
                  <Button text={t("CTA_Button")} />
                </Link>
                <Link
                  href={`${process.env.NEXT_PUBLIC_MAIN_DASHBOARD_URL}`}
                  className="w-max px-5 py-3.5 text-center bg-white ease-in-out hover:scale-105 
                       rounded-full cursor-pointer sm:text-sm md:text-lg font-inter font-medium 
                       flex justify-center items-center"
                >
                  <span className="text-heading">
                    {t("Try a Free Mission")}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </>
  );
};

export default Page;

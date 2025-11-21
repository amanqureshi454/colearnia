"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CTAReuse from "@/components/shared/CTAReuse";
import SectionWrapper from "@/components/shared/SectionWrapper";
import SectionHeader from "@/components/shared/HeadingWrapper";
import { useStepsData } from "@/data/feature";

// Register GSAP plugins
gsap.registerPlugin(SplitText, ScrollTrigger);

const Page = () => {
  const t = useTranslations("about");
  const pathname = usePathname();
  const { infoData, weValue, milestones } = useStepsData();
  const isRTL = pathname?.startsWith("/ar") ?? false;

  // Refs for animations
  const lonelySectionRef = useRef<HTMLDivElement>(null);
  const lonelyHeadingRef = useRef<HTMLHeadingElement>(null);
  const HeroHeadingRef = useRef<HTMLHeadingElement>(null);
  const SubheadingHeadingRef = useRef<HTMLHeadingElement>(null);
  const HeroImageRef = useRef<HTMLImageElement>(null);
  const lonelyImageRef = useRef<HTMLDivElement>(null);
  const weHave = useRef<HTMLDivElement>(null);

  const valueCardsRef = useRef<HTMLDivElement>(null);
  const milestonesRef = useRef<HTMLDivElement>(null);
  const HeroCardRef = useRef<HTMLDivElement>(null);

  // Reuse your existing hook

  /* -------------------------------------------------
     1. HERO-LIKE ANIMATION: Lonely Study → Circles
     ------------------------------------------------- */

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (
        !HeroHeadingRef.current &&
        !SubheadingHeadingRef.current &&
        !HeroImageRef.current
      )
        return;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // 1. Heading – SplitText
        if (HeroHeadingRef.current) {
          const split = new SplitText(HeroHeadingRef.current, {
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

        // 2. Paragraph – slide in
        if (SubheadingHeadingRef.current) {
          tl.from(
            SubheadingHeadingRef.current,
            {
              opacity: 0,
              x: isRTL ? 50 : -50,
              duration: 0.7,
              ease: "power2.out",
            },
            "-=0.5"
          );
        }

        // 3. Image – scale in
        if (HeroImageRef.current) {
          tl.from(
            HeroImageRef.current,
            {
              opacity: 0,
              scale: 0.95,
              duration: 1.2,
              ease: "power2.out",
            },
            "-=0.8"
          );
        }
        const cards = HeroCardRef.current!.querySelectorAll(".hero-card");

        gsap.from(cards, {
          opacity: 0,
          y: 80,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
        });
      });

      return () => ctx.revert();
    });

    return () => cancelAnimationFrame(raf);
  }, [isRTL]);

  // We have
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        const cards = valueCardsRef.current!.querySelectorAll(".wehave-card");

        gsap.from(cards, {
          opacity: 0,
          y: 80,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: weHave.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      return () => ctx.revert();
    });

    return () => cancelAnimationFrame(raf);
  }, [isRTL]);
  // about us
  useEffect(() => {
    if (!lonelySectionRef.current) return;

    const raf = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: lonelySectionRef.current,
            start: "top 85%",
          },
        });

        // Heading Split Text
        if (lonelyHeadingRef.current) {
          const split = new SplitText(lonelyHeadingRef.current, {
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

        // Paragraphs (with orange border)
        const paras = document.querySelectorAll(".border-l-4 p");
        tl.from(
          paras,
          {
            opacity: 0,
            x: -40,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.2,
          },
          "-=0.5"
        );

        // Quote icon
        const quote = document.querySelector(".pt-4 img");
        if (quote) {
          tl.from(quote, { opacity: 0, scale: 0.8, duration: 0.6 }, "-=0.4");
        }

        // Image
        if (lonelyImageRef.current) {
          tl.from(
            lonelyImageRef.current,
            {
              opacity: 0,
              scale: 0.95,
              duration: 1.2,
              ease: "power2.out",
            },
            "-=0.8"
          );
        }

        // Quote text overlay
        const quoteText = document.querySelector(".text-center.absolute p");
        if (quoteText) {
          tl.from(
            quoteText,
            {
              opacity: 0,
              y: 20,
              duration: 0.8,
              ease: "power2.out",
            },
            "-=0.6"
          );
        }
      }, lonelySectionRef);

      return () => ctx.revert();
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  /* -------------------------------------------------
     2. MILESTONES: Same Card Animation
     ------------------------------------------------- */
  useEffect(() => {
    if (!milestonesRef.current) return;

    const ctx = gsap.context(() => {
      const cards = milestonesRef.current!.querySelectorAll(".milestone-card");

      gsap.from(cards, {
        opacity: 0,
        y: 80,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: milestonesRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, valueCardsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="w-full h-full relative">
      {/* HERO SECTION */}
      <div className="hero-section bg-[url('/images/png/about-Background.png')] bg-cover w-full min-h-screen h-full">
        <SectionWrapper>
          <div className="hero-content tab:pt-20 sm:pt-24 sm:w-full tab:w-[60%] md:w-[52%] flex flex-col gap-4">
            <h1
              ref={HeroHeadingRef}
              className={`font-inter font-bold text-white lg:text-7xl tab:text-6xl sm:text-5xl ${
                isRTL ? "text-right leading-[1.35]" : "text-left leading-[1.1]"
              }`}
            >
              {t("AboutPage.Hero.title")}
            </h1>
            <p
              ref={SubheadingHeadingRef}
              className={`font-normal font-inter border-white tab:w-10/12 text-white lg:text-xl md:text-lg sm:text-base ${
                isRTL ? "border-r-4 pr-3" : "border-l-4 pl-3"
              }`}
            >
              {t("AboutPage.Hero.subtitle")}
            </p>
          </div>

          <div
            className={`md:h-[860px] sm:hidden tab:block tab:h-[780px] absolute top-0 ${
              isRTL ? "left-0" : "right-0"
            } tab:w-6/12 md:w-5/12 overflow-hidden`}
          >
            <Image
              ref={HeroImageRef}
              src="/images/svg/about-page-men.svg"
              alt="About Image"
              className="h-full w-full object-cover"
              width={600}
              height={600}
            />
          </div>

          {/* INFO CARDS */}
          <div
            ref={HeroCardRef}
            className="flex justify-center tab:flex-row sm:flex-col items-center sm:h-full tab:h-[300px] relative z-30 gap-6 sm:mt-5 tab:mt-16 sm:mb-[180px] tab:mb-24"
          >
            {infoData.map((item, i) => (
              <div
                key={item.id}
                className={`hero-card bg-white rounded-2xl tab:w-[31%] ${
                  i === 1 ? "tab:mt-[80px]" : "mt-0"
                } sm:w-full shrink-0 sm:min-h-[250px] md:min-h-[280px] shadow-lg hover:shadow-xl transition-shadow sm:p-5 md:p-8 flex flex-col items-center text-center`}
              >
                <div
                  className={`w-20 h-20 ${item.bgColor} rounded-lg flex items-center justify-center mb-4`}
                >
                  <img
                    src={item.iconSrc}
                    alt={item.title}
                    className="w-10 h-10 object-cover"
                  />
                </div>
                <h3 className="md:text-2xl sm:text-xl font-bold text-black mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 tab:text-xs md:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </div>
      {/* WE VALUE CARDS */}
      <SectionWrapper>
        <div className="" ref={weHave}>
          <SectionHeader heading={t("ourValue")} />
          <div
            ref={valueCardsRef}
            className="flex justify-center tab:flex-row sm:flex-col items-center sm:h-full tab:h-[250px] relative z-30 gap-4 sm:mt-8 tab:mt-12 mb-10"
          >
            {weValue.map((item, i) => (
              <div
                key={item.id}
                className={`wehave-card bg-white rounded-2xl tab:w-[24%] ${
                  i === 1 || i === 3 ? "tab:mt-[80px]" : "mt-0"
                } sm:w-full shrink-0 sm:min-h-[250px] md:min-h-[240px] shadow-[0px_1px_6px_0px_#00000029] hover:shadow-xl transition-shadow sm:p-5 md:p-8 flex flex-col items-center text-center`}
              >
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <img
                    src={item.iconSrc}
                    alt={item.title}
                    className="w-16 h-16 object-cover"
                  />
                </div>
                <h3 className="md:text-2xl sm:text-xl font-bold text-black mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 tab:text-xs md:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* LONELY STUDY → CIRCLES */}
      <SectionWrapper>
        <div
          ref={lonelySectionRef}
          className="flex justify-between tab:flex-row sm:flex-col items-center sm:gap-5 tab:gap-10"
        >
          <div className="space-y-8 sm:w-full tab:w-7/12">
            <h1
              ref={lonelyHeadingRef}
              className="w-full text-heading leading-[1.2] font-bold font-inter sm:text-4xl tab:text-5xl md:text-6xl"
            >
              {t("AboutPage.LonelyToCircles.title")}
            </h1>

            <div className="border-l-4 border-secondary bg-white pl-6 space-y-4">
              <p className="text-gray-700 tab:text-sm md:text-lg leading-relaxed">
                {t("AboutPage.LonelyToCircles.body1")}
              </p>
              <p className="text-gray-700 tab:text-sm md:text-lg leading-relaxed">
                {t("AboutPage.LonelyToCircles.body2")}
              </p>
              <div className="pt-4">
                <Image
                  src="/images/svg/quote-icon.svg"
                  alt="Quote Icon"
                  width={28}
                  height={28}
                  className="w-10 h-10 object-cover"
                />
              </div>
            </div>
          </div>

          <div
            ref={lonelyImageRef}
            className="flex relative sm:w-full tab:w-5/12 h-[480px] rounded-2xl justify-center lg:justify-end"
          >
            <div className="rounded-2xl w-full h-full">
              <Image
                src="/images/png/about-power.png"
                width={400}
                height={400}
                className="w-full h-full object-contain rounded-2xl"
                alt="about power"
              />
              <div className="text-center absolute p-4 left-1/2 sm:w-11/12 tab:w-10/12 transform -translate-x-1/2 tab:top-20 sm:top-8 md:top-10 space-y-3">
                <p className="text-white sm:text-xl md:text-2xl font-serif font-bold leading-snug">
                  {t("AboutPage.LonelyToCircles.quote")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* MILESTONES */}
      <SectionWrapper>
        <SectionHeader
          heading={t("milestones")}
          subheading={t("milestonesSubtitle")}
        />
        <div
          ref={milestonesRef}
          className="grid grid-cols-1 tab:grid-cols-2 sm:gap-4 tab:gap-8 mt-14"
        >
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="milestone-card bg-[#FFF9EE] rounded-xl sm:p-6 tab:p-8"
            >
              <div className="flex items-start gap-4">
                <Image
                  src="/images/svg/acheive.svg"
                  className="w-16 h-16 object-cover"
                  alt="Achievement"
                  width={64}
                  height={64}
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#061C3D] mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper>
        <CTAReuse
          backgroundImage="bg-[url('/images/png/about-cta.png')]"
          title={t("AboutPage.Milestones.ctaTitle")}
          subtitle={t("AboutPage.Milestones.ctaSubtitle")}
          primaryText={t("AboutPage.Milestones.ctaPrimary")}
          secondaryText={t("AboutPage.Milestones.ctaSecondary")}
        />
      </SectionWrapper>
    </div>
  );
};

export default Page;

{
  /* <SectionWrapper>
  <SectionHeader
    heading={t("Team&Advisors")}
    subheading={t("TeamSubTitle")}
  />
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-14">
    {teamMembers.map((member) => (
      <div key={member.id} className="bg-white overflow-hidden">
        <div
          className={`${member.bg} h-[350px] flex items-center justify-center`}
        >
          <Image
            src={member.src}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="py-6">
          <h3 className="text-xl font-bold text-[#061C3D] mb-1">
            {member.name}
          </h3>
          <p className="text-[#6A778B] font-normal text-sm mb-2">
            {member.role}
          </p>
          <p className="text-gray-600 text-sm font-normal mb-4">
            {member.description}
          </p>

          <div className="flex gap-3 justify-start">
            <a
              href={member.social.facebook}
              className="text-blue-600 hover:text-blue-700 transition"
            >
            </a>
            <a
              href={member.social.instagram}
              className="text-pink-600 hover:text-pink-700 transition"
            >
            </a>
            <a
              href={member.social.twitter}
              className="text-blue-400 hover:text-blue-500 transition"
            >
            </a>
            <a
              href={member.social.linkedin}
              className="text-blue-700 hover:text-blue-800 transition"
            >
            </a>
          </div>
        </div>
      </div>
    ))}
  </div>
</SectionWrapper> */
}

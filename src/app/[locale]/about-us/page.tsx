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
import CTAReuse from "@/components/shared/CTAReuse";
import SectionWrapper from "@/components/shared/SectionWrapper";
import SectionHeader from "@/components/shared/HeadingWrapper";
const Page = () => {
  const t = useTranslations("about");
  const pathname = usePathname();
  const headingRef = useRef(null);
  const headingRef2 = useRef<HTMLHeadingElement>(null);
  const paraRef2 = useRef<HTMLParagraphElement>(null);
  const paraRef = useRef(null);
  const isRTL = pathname?.startsWith("/ar") ?? false;

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

  const infoData = [
    {
      id: 1,
      title: "Our Mission",
      description:
        "Empower every learner to achieve more through collaboration, accountability, and joyful practice.",
      bgColor: "bg-[#F9F0FF]",
      iconSrc: "/images/svg/cap.svg", // use your own image path
    },
    {
      id: 2,
      title: "Our Vision",
      description:
        "A world where studying feels social, meaningful, and measurable — for every student, everywhere.",
      bgColor: "bg-[#F0F5FF]",
      iconSrc: "/images/svg/eye.svg",
    },
    {
      id: 3,
      title: "What We Value",
      description:
        "Students first • Motivation by design • Trust & privacy • Evidence-based",
      bgColor: "bg-[#E6FFDD]",
      iconSrc: "/images/svg/shield-tick.svg",
    },
  ];
  const weValue = [
    {
      id: 1,
      title: "Students first",
      description: "Every decision starts with learner outcomes.",
      iconSrc: "/images/svg/frame.svg", // use your own image path
    },
    {
      id: 2,
      title: "Trust & privacy",
      description: "We protect learner data and promote safe collaboration.",
      iconSrc: "/images/svg/security-safe.svg",
    },
    {
      id: 3,
      title: "Motivation by design",
      description: "Small wins, clear goals, visible progress.",
      iconSrc: "/images/svg/brush.svg",
    },
    {
      id: 4,
      title: "Evidence-based",
      description:
        "We use proven learning science and iterate with real classrooms.",
      iconSrc: "/images/svg/briefcase.svg",
    },
  ];
  const teamMembers = [
    {
      id: 1,
      name: "Houssem G.",
      role: "Founder",
      src: "",
      description:
        "EdTech builder & project lead. Passionate about collaborative learning",
      bg: "bg-[#108EDA]",
      social: { facebook: "#", instagram: "#", twitter: "#", linkedin: "#" },
    },
    {
      id: 2,
      name: "Layla A.",
      role: "Advisor",
      src: "",
      description:
        "Teacher & curriculum mentor. Focus on motivation & mastery.",
      bg: "bg-[#247476]",
      social: { facebook: "#", instagram: "#", twitter: "#", linkedin: "#" },
    },
    {
      id: 3,
      name: "Omar D.",
      role: "Advisor",
      src: "",
      description: "Full-stack engineer; Data & analytics for learning impact",
      bg: "bg-[#FC7A1A]",
      social: { facebook: "#", instagram: "#", twitter: "#", linkedin: "#" },
    },
    {
      id: 4,
      name: "Esther Howard",
      role: "Front-end Developer",
      src: "",
      description:
        "EdTech builder & project lead. Passionate about collaborative learning",
      bg: "bg-[#76A136]",
      social: { facebook: "#", instagram: "#", twitter: "#", linkedin: "#" },
    },
  ];
  const milestones = [
    {
      id: 1,
      title: "Milestone 1",
      description: "Prototype validated with pilot classrooms",
    },
    {
      id: 2,
      title: "Milestone 2",
      description: "Gamified missions & progress dashboard",
    },
    {
      id: 3,
      title: "Milestone 3",
      description: "Teacher tools for classes, circles & analytics",
    },
    {
      id: 4,
      title: "Milestone 4",
      description: "Bilingual (EN/AR) with RTL support",
    },
  ];
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`w-full  h-full relative  `}>
      <div className="hero-section bg-[url('/images/png/about-Background.png')] bg-cover w-full min-h-screen h-full">
        <SectionWrapper>
          <div className="hero-content tab:pt-20 sm:pt-24 sm:w-full tab:w-[60%] md:w-[52%] flex flex-col gap-4">
            <h1
              className={`font-inter font-bold  text-white  lg:text-7xl tab:text-6xl sm:text-5xl    ${
                isRTL ? "text-right leading-[1.35]" : "text-left  leading-[1.1]"
              } `}
            >
              We’re building the most motivating way to learn together.
            </h1>
            <p
              className={`font-normal font-inter border-white tab:w-10/12 text-white lg:text-xl md:text-lg sm:text-base  ${
                isRTL ? "border-r-4 pr-3" : "border-l-4 pl-3"
              }`}
            >
              StudyCircle turns studying into teamwork. We help students form
              small circles, complete focused missions, and see their progress
              clearly.
            </p>
          </div>
          <div className="md:h-[810px] sm:hidden tab:block tab:h-[750px]  absolute top-0 right-0 tab:w-6/12 md:w-5/12  overflow-hidden">
            <Image
              src="/images/svg/about-page-men.svg"
              alt="About Image"
              className="h-full w-full  object-cover"
              width={600}
              height={600}
            />
          </div>
          <div className="flex justify-center tab:flex-row sm:flex-col items-center sm:h-full tab:h-[300px] relative z-30 gap-6 sm:mt-5 tab:mt-12 sm:mb-[180px] tab:mb-32">
            {infoData.map((item, i) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl tab:w-[31%] ${
                  i === 1 ? "tab:mt-[80px]" : "mt-0"
                } sm:w-full shrink-0 sm:min-h-[250px] md:min-h-[280px] shadow-lg hover:shadow-xl transition-shadow sm:p-5  md:p-8 flex flex-col items-center text-center`}
              >
                {/* Icon wrapper */}
                <div
                  className={`w-20 h-20 ${item.bgColor} rounded-lg flex items-center justify-center mb-4`}
                >
                  <img
                    src={item.iconSrc}
                    alt={item.title}
                    className="w-10 h-10 object-cover"
                  />
                </div>

                {/* Title */}
                <h3 className="md:text-2xl sm:text-xl font-bold text-black mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 tab:text-xs md:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </div>
      <SectionWrapper>
        <SectionHeader heading={t("ourValue")} />
        <div className="flex justify-center tab:flex-row sm:flex-col items-center sm:h-full tab:h-[250px] relative z-30 gap-4 sm:mt-5 tab:mt-12 mb-10">
          {weValue.map((item, i) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl tab:w-[24%] ${
                i === 1 || i === 3 ? "tab:mt-[80px]" : "mt-0"
              } sm:w-full shrink-0 sm:min-h-[250px] md:min-h-[240px] shadow-[0px_1px_6px_0px_#00000029] hover:shadow-xl transition-shadow sm:p-5  md:p-8 flex flex-col items-center text-center`}
            >
              {/* Icon wrapper */}
              <div
                className={`w-16 h-16 flex items-center justify-center mb-4`}
              >
                <img
                  src={item.iconSrc}
                  alt={item.title}
                  className="w-16 h-16 object-cover"
                />
              </div>

              {/* Title */}
              <h3 className="md:text-2xl sm:text-xl font-bold text-black mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 tab:text-xs md:text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </SectionWrapper>
      <SectionWrapper>
        <div className="flex justify-between items-center gap-10">
          {/* Left Content Section */}
          <div className="space-y-8 w-7/12">
            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              From lonely study sessions to powerful circles.
            </h1>

            {/* Orange Left Border Content */}
            <div className="border-l-4 border-secondary  bg-white pl-6 space-y-4">
              <p className="text-gray-700 text-lg leading-relaxed">
                We started StudyCircle after seeing students lose motivation
                studying alone — even the brightest ones. Classmates wanted
                structured practice, friendly accountability, and a way to see
                real improvement.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                So we built circles: small, supportive groups with weekly
                missions and a shared view of progress. The results were
                immediate — more consistency, more confidence, and better
                outcomes.
              </p>

              {/* Quote Icon */}
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

          {/* Right Image Section */}
          <div className="flex relative w-5/12 h-[480px] rounded-2xl justify-center lg:justify-end">
            {/* Content Overlay */}
            <div className=" rounded-2xl w-full h-full">
              <Image
                src="/images/png/about-power.png"
                width={400}
                height={400}
                className="w-full h-full object-contain rounded-2xl"
                alt="about power"
              />

              {/* Quote Text */}
              <div className="text-center absolute p-4 left-1/2 w-10/12 transform -translate-x-1/2  top-10 space-y-3">
                <p className="text-white text-2xl font-serif font-bold leading-snug">
                  Learning thrives in small, supportive circles, where progress
                  is visible and wins are shared.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
      <SectionWrapper>
        <SectionHeader
          heading={t("milestones")}
          subheading={t("milestonesSubtitle")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="bg-[#FFF9EE] rounded-xl p-8 ">
              <div className="flex items-start gap-4">
                {/* Medal Icon */}
                <Image
                  src="/images/svg/acheive.svg"
                  className="w-16 h-16 object-cover"
                  alt="Acheivement"
                  width={64}
                  height={64}
                />

                {/* Content */}
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
      {/* <SectionWrapper>
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
      </SectionWrapper> */}
      <SectionWrapper>
        <CTAReuse
          backgroundImage="bg-[url('/images/png/about-cta.png')]"
          title={t("CTATitle")}
          subtitle={t("CTASubTitle")}
          primaryText={t("CTABtn1")}
          secondaryText={t("CTABtn2")}
        />
      </SectionWrapper>
    </div>
  );
};

export default Page;

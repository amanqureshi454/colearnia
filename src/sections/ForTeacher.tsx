"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { useCardReveal } from "@/lib/useCardReveal";
gsap.registerPlugin(SplitText);

const ForTeacher = () => {
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const iconRef = useRef(null);
  const t = useTranslations("how-it-work");
  const t2 = useTranslations("about");

  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;
  const teacherCards = [
    {
      title: t("tech-card-1"),
      description: t("tech-card-desc-1"),
      icon: "/images/svg/briefcase.svg",
    },
    {
      title: t("tech-card-2"),
      description: t("tech-card-desc-2"),
      icon: "/images/svg/teach-2.svg",
    },
    {
      title: t("tech-card-3"),
      description: t("tech-card-desc-3"),
      icon: "/images/svg/people.svg",
    },
    {
      title: t("tech-card-4"),
      description: t("tech-card-desc-4"),
      icon: "/images/svg/teach-2.svg",
    },
  ];

  useCardReveal({
    trigger: "#forTeacher",
    headingRef,
    paraRef,
    cardSelector: ".teacher-card", // Optional
  });

  return (
    <div
      id="forTeacher"
      className={`bg-secondary w-full px-4  ${
        isRTL ? "font-cairo" : "font-melodyB"
      }`}
    >
      <div className="py-20 tab:w-[90%] sm:w-full mx-auto">
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="flex w-full items-center justify-center gap-4"
        >
          <Image
            src="/images/svg/image 19.svg"
            alt="Teacher"
            width={100}
            ref={iconRef}
            height={100}
            className="w-16 h-16"
          />
          <h3
            ref={headingRef}
            className="text-white font-extrabold leading-normal  sm:text-4xl md:text-5xl"
          >
            {t2("for-Tech-Title")}
          </h3>
        </div>
        <p
          ref={paraRef}
          className=" text-white sm:w-full md:w-7/12 mt-5 text-center mx-auto  font-medium leading-[28px] sm:text-sm md:text-lg"
        >
          {t("description")}
        </p>
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="flex items-center sm:flex-col tab:flex-wrap md:flex-nowrap tab:flex-row mt-10 justify-center gap-4"
        >
          {teacherCards.map((teacher, i) => {
            return (
              <div
                style={{ boxShadow: "0px 1.2px 4.79px 0px #19213D14" }}
                key={i}
                className="teacher-card bg-[#F3E3CB] border-[#E1E4ED] border h-[240px] sm:w-full tab:w-[42%] md:w-1/4 rounded-2xl tab:px-4 sm:px-6 py-3  gap-2 "
              >
                <div
                  className={`flex flex-col h-full gap-3 items-center justify-center ${
                    isRTL ? "font-cairo" : "font-inter"
                  }`}
                >
                  <Image
                    src={teacher.icon}
                    alt={teacher.title}
                    width={40}
                    className="w-14 h-14 mb-2 object-cover"
                    height={40}
                  />
                  <div
                    dir={isRTL ? "rtl" : "ltr"}
                    className="flex flex-col gap-3"
                  >
                    <h4 className={`text-brand  text-center font-bold text-xl`}>
                      {teacher.title}
                    </h4>
                    <p className="text-brand text-center sm:text-sm  md:text-xs">
                      {teacher.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForTeacher;

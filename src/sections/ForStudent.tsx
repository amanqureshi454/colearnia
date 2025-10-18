"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { useCardReveal } from "@/lib/useCardReveal";
gsap.registerPlugin(SplitText);
const ForStudent = () => {
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const iconRef = useRef(null);
  const t = useTranslations("how-it-work");
  const t2 = useTranslations("about");

  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;
  const studentCards = [
    {
      title: t("student-card-1"),
      description: t("student-card-desc-1"),
      icon: "/images/svg/sms.svg",
    },
    {
      title: t("student-card-2"),
      description: t("student-card-desc-2"),
      icon: "/images/svg/share.svg",
    },
    {
      title: t("student-card-3"),
      description: t("student-card-desc-3"),
      icon: "/images/svg/people (1).svg",
    },
    {
      title: t("student-card-4"),
      description: t("student-card-desc-4"),
      icon: "/images/svg/cup.svg",
    },
  ];

  useCardReveal({
    trigger: "#forStudent",
    headingRef,
    paraRef,
    cardSelector: ".student-card", // Optional
  });

  return (
    <>
      <div
        id="forStudent"
        className={`bg-third px-4 w-full ${
          isRTL ? "font-cairo" : "font-melodyB"
        }`}
      >
        {" "}
        <div className="py-20 md:w-[90%] mx-auto">
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className="flex items-center justify-center gap-4"
          >
            <Image
              ref={iconRef}
              src="/images/svg/image 20.svg"
              alt="Teacher"
              width={100}
              height={100}
              className="w-16 h-16"
            />
            <h3
              ref={headingRef}
              className="text-white leading-normal font-extrabold sm:text-4xl md:text-5xl"
            >
              {t2("for-Student-Title")}
            </h3>
          </div>
          <p
            ref={paraRef}
            className=" text-white sm:w-full md:w-7/12 mt-5 text-center mx-auto  font-medium leading-[28px] sm:text-sm md:text-lg"
          >
            {t("description2")}
          </p>
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className="flex items-center sm:flex-col tab:flex-wrap md:flex-nowrap tab:flex-row mt-10 justify-center gap-4"
          >
            {studentCards.map((teacher, i) => {
              return (
                <div
                  dir={isRTL ? "rtl" : "ltr"}
                  style={{ boxShadow: "0px 1.2px 4.79px 0px #19213D14" }}
                  key={i}
                  className="bg-brand student-card border-[#E1E4ED] border h-[240px]  sm:w-full tab:w-[42%] md:w-1/4 rounded-2xl px-4 py-3  gap-2 "
                >
                  <div
                    className={`flex flex-col h-full gap-3 items-center justify-center  ${
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
                      <h4 className="text-white text-center font-bold text-xl">
                        {teacher.title}
                      </h4>
                      <p className="text-white text-center text-xs">
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
    </>
  );
};

export default ForStudent;

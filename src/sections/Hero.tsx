"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

// Register the plugin
gsap.registerPlugin(SplitText);

const Hero = () => {
  const t = useTranslations("Hero");
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;
  useEffect(() => {
    const tl = gsap.timeline();

    // Heading split animation
    const headingSplit = new SplitText(headingRef.current, {
      type: "lines, words",
      linesClass: "line",
    });
    const headingWords = headingSplit.words;

    // Paragraph split animation
    const paraSplit = new SplitText(paraRef.current, {
      type: "lines, words",
      linesClass: "line",
    });
    const paraWords = paraSplit.words;

    // Animate heading
    tl.from(
      headingWords,
      {
        duration: 0.8,
        opacity: 0,
        yPercent: 120,
        ease: "power1",
        stagger: 0.035,
      },
      "-=0.2"
    );

    // Animate paragraph (after heading)
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
    ); // slight overlap for better flow

    // Animate button
    tl.from(
      ".hero-button",
      {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power1",
      },
      "-=0.3"
    );
    tl.from(
      ".hero-bg-wrapper",
      {
        opacity: 0,
        scale: 1.05,
        duration: 1.2,
        ease: "power2.out",
      },
      "-=0.2"
    );
    // Cleanup
    return () => {
      headingSplit.revert();
      paraSplit.revert();
    };
  }, []);

  return (
    <>
      <div
        className={`w-full  ${
          isRTL ? "font-cairo" : "font-melodyB"
        } h-full bg-background relative sm:pt-[150px] md:pt-[160px]`}
      >
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="relative z-20 gap-4 sm:px-4 mx-auto flex flex-col justify-center items-center"
        >
          <h1
            ref={headingRef}
            className="md:text-6xl sm:text-5xl leading-[1.2] font-bold text-brand text-center"
          >
            {t("Title")}
          </h1>
          <p
            ref={paraRef}
            className=" md:text-xl sm:text-lg opacity-80 sm:w-full md:w-5/12 text-center"
          >
            {t("Subtitle")}
          </p>
          <div className="overflow-hidden hero-button">
            <button className="w-max  px-5 py-3.5 text-center transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer sm:text-lg md:text-2xl font-inter font-semibold flex justify-center items-center gap-3 bg-white/90 backdrop-blur-2xl rounded-lg">
              {t("CTA_Button")}

              <ArrowRight size={22} className="text-black" />
            </button>
          </div>
        </div>
        <div className="relative w-full z-10 md:h-[840px] sm:h-[550px] overflow-hidden px-5 ">
          <div className="absolute md:h-[840px] sm:h-[550px] left-0 top-0 overflow-hidden w-full">
            <div className="hero-bg-wrapper w-full h-full">
              <Image
                src="/images/png/hero-bg.png"
                alt="Hero Background"
                width={1000}
                height={840}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
          <div className="absolute w-full h-full -bottom-64 left-0 z-20">
            <Image
              src="/images/png/line-3.png"
              alt="Hero Background"
              width={1000}
              height={100}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;

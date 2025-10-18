"use client";

import Button from "@/components/shared/Button";
import { useSplitTextAnimation } from "@/lib/useSectionReveal";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
const About = () => {
  const t = useTranslations("about");
  const pathname = usePathname();
  const headingRef = useRef(null);
  const headingRef2 = useRef(null);
  const headingRef3 = useRef(null);
  const paraRef = useRef(null);
  const paraRef2 = useRef(null);
  const paraRef3 = useRef(null);
  const isRTL = pathname?.startsWith("/ar") ?? false;
  const videoWrapperRef = useRef(null);
  const rightImageWrapperRef = useRef(null);
  const leftImageWrapperRef = useRef(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPauseBtn, setShowPauseBtn] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowPauseBtn(false); // hide pause button
    }
  };

  const handleMouseEnter = () => {
    if (isPlaying) setShowPauseBtn(true);
  };

  const handleMouseLeave = () => {
    setShowPauseBtn(false);
  };

  useSplitTextAnimation({
    headingRef,
    paraRef,
    triggerId: "about",
  });

  useEffect(() => {
    if (!videoWrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(videoWrapperRef.current, { opacity: 0 });

      gsap.to(videoWrapperRef.current, {
        scrollTrigger: {
          trigger: videoWrapperRef.current, // ✅ Changed
          start: "top 80%", // adjust based on testing
        },
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      });
    });

    return () => ctx.revert(); // ✅ scoped cleanup
  }, []);
  useEffect(() => {
    if (
      !headingRef2.current ||
      !paraRef2.current ||
      !rightImageWrapperRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#teacher", // Target the section
          start: "top 90%",
        },
      });

      // Animate heading
      const headingSplit = new SplitText(headingRef2.current, {
        type: "lines, words",
        linesClass: "line",
      });
      tl.from(headingSplit.words, {
        duration: 0.8,
        opacity: 0,
        yPercent: 120,
        ease: "power",
        stagger: 0.015,
      });

      // Animate paragraph
      const paraSplit = new SplitText(paraRef2.current, {
        type: "lines, words",
        linesClass: "line",
      });
      tl.from(
        paraSplit.words,
        {
          duration: 0.7,
          opacity: 0,
          yPercent: 120,
          ease: "power",
          stagger: 0.01,
        },
        "-=0.5"
      );

      // Animate image from right
      tl.from(
        rightImageWrapperRef.current,
        {
          x: 100,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5"
      );
    });

    return () => ctx.revert();
  }, []);
  useEffect(() => {
    if (
      !headingRef3.current ||
      !paraRef3.current ||
      !leftImageWrapperRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#student", // Target the section
          start: "top 90%",
        },
      });

      // Animate heading
      const headingSplit = new SplitText(headingRef3.current, {
        type: "lines, words",
        linesClass: "line",
      });
      tl.from(headingSplit.words, {
        duration: 0.8,
        opacity: 0,
        yPercent: 120,
        ease: "power",
        stagger: 0.015,
      });

      // Animate paragraph
      const paraSplit = new SplitText(paraRef3.current, {
        type: "lines, words",
        linesClass: "line",
      });
      tl.from(
        paraSplit.words,
        {
          duration: 0.7,
          opacity: 0,
          yPercent: 120,
          ease: "power",
          stagger: 0.01,
        },
        "-=0.5"
      );

      // Animate image from right
      tl.from(
        leftImageWrapperRef.current,
        {
          x: -200,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5"
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        id="about"
        dir={isRTL ? "rtl" : "ltr"}
        className={`w-full h-full relative overflow-hidden bg-background py-16 px-4  ${
          isRTL ? "font-cairo" : "font-melodyB"
        }`}
      >
        <div dir={isRTL ? "rtl" : "ltr"} className="w-full h-full">
          <h1
            ref={headingRef}
            className="text-center text-brand leading-normal font-extrabold md:text-5xl sm:text-4xl"
          >
            {t("Title")}
          </h1>
          <h2
            ref={paraRef}
            className={`text-center text-second sm:mt-2 tab:mt-0 ${
              isRTL ? "font-cairo font-normal" : "font-melodyM leading-[1.2]"
            } font-medium  text-lg`}
          >
            {t("subtitle")}
          </h2>
        </div>

        <div
          ref={videoWrapperRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="md:w-7/12 sm:w-full rounded-2xl mx-auto mt-8 relative h-[450px] overflow-hidden group"
        >
          <video
            ref={videoRef}
            className="rounded-2xl border border-gray-300 w-full h-full object-cover"
            muted
            loop
            playsInline
          >
            <source src="/video/sectiontwo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* First play button (only before playing) */}
          {!isPlaying && (
            <button
              onClick={handlePlay}
              className="absolute top-1/2 left-1/2 z-20 cursor-pointer -translate-x-1/2 -translate-y-1/2"
            >
              <Image
                width={80}
                height={80}
                src="/images/svg/play.svg"
                alt="Play"
                className="w-20 h-20"
              />
            </button>
          )}

          {/* Pause button shown on hover only when video is playing */}
          {isPlaying && showPauseBtn && (
            <button
              onClick={handlePause}
              className="absolute top-1/2 left-1/2 z-20 cursor-pointer -translate-x-1/2 -translate-y-1/2"
            >
              <Image
                width={80}
                height={80}
                src="/images/png/pause.png"
                alt="Pause"
                className="w-16 h-16"
              />
            </button>
          )}
        </div>
      </div>
      <div
        id="teacher"
        dir={isRTL ? "rtl" : "ltr"}
        className={`w-full h-full relative overflow-hidden bg-secondary py-24 px-4 ${
          isRTL ? "font-cairo" : "font-melodyB"
        }`}
      >
        <div className="md:w-10/12 sm:w-full mx-auto h-full gap-8 sm:flex-col tab:flex-row flex justify-between items-center">
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className="md:w-1/2 sm:w-full h-full flex flex-col gap-5"
          >
            <h3
              ref={headingRef2}
              className=" text-white font-bold sm:text-4xl md:text-5xl"
            >
              {t("for-Tech-Title")}
            </h3>
            <p
              ref={paraRef2}
              className={`text-white/80 text-second ${
                isRTL
                  ? "font-cairo font-normal leading-[2]"
                  : "font-melodyM leading-[2] "
              } font-medium sm:text-sm md:text-lg `}
            >
              {t("for-Teacher-Sub")}
            </p>
            <div className="flex w-full justify-center gap-4">
              <Button style="bg-third w-1/2" text={t("for-Teacher-CTA-1")} />
              <Button
                style="bg-transparent border border-white w-1/2"
                text={t("for-Teacher-CTA-2")}
              />
            </div>
          </div>
          <div className="md:w-1/2 sm:w-full h-full">
            <Image
              ref={rightImageWrapperRef}
              width={500}
              height={300}
              src="/images/png/teacher.png"
              alt="Teacher"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
      <div
        id="student"
        dir={isRTL ? "rtl" : "ltr"}
        className={`w-full h-full relative overflow-hidden bg-third py-24 px-4  ${
          isRTL ? "font-cairo" : "font-melodyB"
        }`}
      >
        <div className="md:w-10/12 sm:w-full mx-auto h-full gap-8 sm:flex-col tab:flex-row  flex justify-between items-center">
          <div className="md:w-1/2 sm:w-full h-full">
            <Image
              ref={leftImageWrapperRef}
              width={500}
              height={300}
              src="/images/png/student.png"
              alt="Student"
              className="w-full h-full object-contain"
            />
          </div>
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className="md:w-1/2 sm:w-full h-full flex flex-col gap-5"
          >
            <h3
              ref={headingRef3}
              className=" text-white font-bold sm:text-4xl md:text-5xl"
            >
              {t("for-Student-Title")}
            </h3>
            <p
              ref={paraRef3}
              className={`text-white/80  text-second ${
                isRTL
                  ? "font-cairo font-normal leading-[2]"
                  : "font-melodyM leading-[2]"
              } font-medium sm:text-sm md:text-lg `}
            >
              {t("for-Student-Sub")}
            </p>
            <div className="flex w-full justify-center gap-4">
              <Button style="bg-brand w-1/2" text={t("for-Teacher-CTA-1")} />
              <Button
                style="bg-transparent border border-white w-1/2"
                text={t("for-Teacher-CTA-2")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

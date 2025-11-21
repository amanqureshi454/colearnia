"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { usePathname } from "next/navigation";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { people } from "@/data/testimonail";
import Button from "@/components/shared/Button";
import HeroHeadingTitle from "@/components/shared/HeroHeadingTitle";
import HeroParagraph from "@/components/shared/HeroParagraph";
import { Volume2, VolumeX } from "lucide-react";

// Register the plugin
gsap.registerPlugin(SplitText);

const Hero = () => {
  const t = useTranslations("Hero");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const arrowRef = useRef<HTMLImageElement>(null);
  const watchBtnRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const testRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef(null);
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;
  const [isMuted, setIsMuted] = useState(true);

  const [showVolume, setShowVolume] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Handle automatic fade-out after 2s
  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (showVolume) {
      setFadeOut(false); // reset fade
      timer = setTimeout(() => setFadeOut(true), 2000); // fade out after 2s
    }
    return () => clearTimeout(timer);
  }, [showVolume]);
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };
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

    tl.from(
      arrowRef.current,
      {
        opacity: 0,
        x: isRTL ? 50 : -50,
        duration: 0.7,
        ease: "power2.out",
      },
      "-=0.4"
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

    // CTA Buttons
    tl.from(
      [".hero-button", watchBtnRef.current],
      {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.15,
      },
      "-=0.3"
    );
    tl.from(
      testRef.current,
      {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.15,
      },
      "-=0.3"
    );

    // Video
    tl.from(
      videoRef.current,
      {
        opacity: 0,
        scale: 1.05,
        duration: 1.2,
        ease: "power2.out",
      },
      "-=0.8"
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
        className={`w-full tab:h-screen bg-white relative sm:max-w-[95%] md:max-w-[90%] lg:max-w-[85%] max-w-7xl mx-auto `}
      >
        <div className="absolute bg-[#FFD6D6] sm:hidden tab:block blur-[1000px] rounded-full w-[600px] h-[600px] -top-20 right-0"></div>
        <div className="w-full h-full tab:pt-20 sm:pt-36 flex justify-center items-center">
          <div className=" w-full h-[95%]">
            <div className="flex tab:flex-row w-full sm:flex-col justify-between items-center lg:gap-6 sm:gap-5 h-full">
              <div className="flex gap-2 tab:w-7/12 sm:w-full  flex-col">
                <div className="flex gap-4 relative w-full z-20 flex-col">
                  <HeroHeadingTitle
                    headingRef={headingRef}
                    isRTL={isRTL}
                    t={t}
                    className="your-extra-classes-here" // optional
                  />
                  <Image
                    ref={arrowRef}
                    src={`${
                      isRTL
                        ? "/images/svg/arabic-arrow.svg"
                        : "/images/svg/arrow.svg"
                    }`}
                    alt="Play"
                    className="w-7/12 h-[55px] sm:object-contain  tab:object-cover"
                    width={100}
                    height={55}
                  />
                  <HeroParagraph
                    paraRef={paraRef}
                    isRTL={isRTL}
                    t={t}
                    className="your-extra-classes" // optional
                  />
                </div>
                <div
                  ref={watchBtnRef}
                  className="flex flex-row flex-wrap tab:gap-4 sm:gap-2 mt-5"
                >
                  <Button text={t("CTA_Button")} />
                  <button className="w-max px-6 sm:px-4 sm:py-3 text-center transition-transform duration-200 ease-in-out hover:scale-105  rounded-full cursor-pointer sm:text-sm md:text-lg font-inter font-semibold flex justify-center items-center gap-2 bg-transparent text-black">
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
                <div
                  ref={testRef}
                  className="flex justify-start items-center mt-3 gap-4"
                >
                  <AnimatedTooltip items={people} />
                  <p
                    className={`text-sm  font-inter font-medium text-gray-500 ${
                      isRTL ? "mr-8" : "ml-8"
                    }`}
                  >
                    {t("Testimonials")}
                  </p>
                </div>
              </div>
              <div
                onMouseEnter={() => setShowVolume(true)}
                onMouseLeave={() => setShowVolume(false)}
                className="rounded-2xl tab:w-5/12 sm:w-full sm:h-[400px] tab:h-full relative z-30 aspect-square h-full"
              >
                <video
                  ref={videoRef}
                  src={`${
                    isRTL ? "/video/arabic.mp4" : "/video/study-circle.mp4"
                  }`}
                  className="w-full h-full object-cover rounded-2xl"
                  muted
                  autoPlay
                  loop
                  playsInline
                />
                {showVolume && (
                  <div
                    onClick={toggleMute}
                    className={`bg-brand w-16 h-16 absolute transition-opacity duration-500 ${
                      fadeOut ? "opacity-0" : "opacity-100"
                    } rounded-full top-1/2 left-1/2 transform cursor-pointer -translate-x-1/2 -translate-y-1/2 flex justify-center items-center`}
                  >
                    {isMuted ? (
                      <VolumeX className="w-7 h-7 text-black" />
                    ) : (
                      <Volume2 className="w-7 h-7 text-black" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;

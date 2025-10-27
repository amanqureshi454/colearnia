"use client";

import { useEffect } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface AnimationOptions {
  containerRef: React.RefObject<HTMLElement | null>;
  headlineRef?: React.RefObject<HTMLElement | null>;
  headingRef: React.RefObject<HTMLElement | null>;
  subheadingRef?: React.RefObject<HTMLElement | null>;
  start?: string;
}

export function useHeadingAnimation({
  containerRef,
  headlineRef,
  headingRef,
  subheadingRef,
  start = "top 80%",
}: AnimationOptions) {
  useEffect(() => {
    if (!headingRef.current) return;

    document.fonts.ready.then(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: containerRef.current,
          start,
        },
      });

      // === Headline Animation (if exists) ===
      if (headlineRef?.current) {
        gsap.set(headlineRef.current, { autoAlpha: 0, y: -12 });
        tl.to(headlineRef.current, { autoAlpha: 1, y: 0, duration: 0.5 });
      }

      // === Heading Split Text Animation ===
      const headingSplit = new SplitText(headingRef.current!, {
        type: "words, lines",
        linesClass: "line",
      });
      const headingWords = headingSplit.words;

      gsap.set(headingWords, {
        opacity: 0,
        yPercent: 120,
      });

      tl.to(
        headingWords,
        {
          duration: 0.8,
          opacity: 1,
          yPercent: 0,
          ease: "power1",
          stagger: 0.035,
        },
        headlineRef?.current ? "+=0.1" : 0
      );

      // === Subheading Split Text Animation ===
      if (subheadingRef?.current) {
        const paraSplit = new SplitText(subheadingRef.current, {
          type: "words, lines",
          linesClass: "line",
        });
        const paraWords = paraSplit.words;

        gsap.set(paraWords, {
          opacity: 0,
          yPercent: 120,
        });

        tl.to(
          paraWords,
          {
            duration: 0.7,
            opacity: 1,
            yPercent: 0,
            ease: "power1",
            stagger: 0.018,
          },
          "-=0.5"
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [containerRef, headlineRef, headingRef, subheadingRef, start]);
}

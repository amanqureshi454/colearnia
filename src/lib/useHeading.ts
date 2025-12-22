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
    if (!containerRef.current || !headingRef.current) return;

    let headingSplit: SplitText | null = null;
    let paraSplit: SplitText | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: containerRef.current!,
          start,
          once: true, // 👈 prevents re-fire issues
        },
      });

      // Headline
      if (headlineRef?.current) {
        gsap.set(headlineRef.current, { autoAlpha: 0, y: -12 });
        tl.to(headlineRef.current, { autoAlpha: 1, y: 0, duration: 0.4 });
      }

      // Heading
      headingSplit = new SplitText(headingRef.current!, {
        type: "words",
      });

      gsap.set(headingSplit.words, {
        opacity: 0,
        yPercent: 120,
      });

      tl.to(
        headingSplit.words,
        {
          opacity: 1,
          yPercent: 0,
          stagger: 0.035,
          duration: 0.8,
        },
        headlineRef?.current ? "+=0.1" : 0
      );

      // Subheading
      if (subheadingRef?.current) {
        paraSplit = new SplitText(subheadingRef.current, {
          type: "words",
        });

        gsap.set(paraSplit.words, {
          opacity: 0,
          yPercent: 120,
        });

        tl.to(
          paraSplit.words,
          {
            opacity: 1,
            yPercent: 0,
            stagger: 0.02,
            duration: 0.6,
          },
          "-=0.4"
        );
      }

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      headingSplit?.revert();
      paraSplit?.revert();
      ctx.revert(); // 👈 cleans ONLY this animation
    };
  }, [containerRef, headlineRef, headingRef, subheadingRef, start]);
}

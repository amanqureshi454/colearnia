// src/hooks/useHeroReveal.ts
import { useEffect } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

interface UseHeroRevealOptions {
  headingRef: React.RefObject<HTMLElement | null>;
  paraRef: React.RefObject<HTMLElement | null>;
  buttonSelector?: string;
  bgSelector?: string;
}

export function useHeroReveal({
  headingRef,
  paraRef,
  buttonSelector = ".hero-button",
  bgSelector = ".hero-bg-wrapper",
}: UseHeroRevealOptions) {
  useEffect(() => {
    if (!headingRef.current || !paraRef.current) return;

    const tl = gsap.timeline();

    const headingSplit = new SplitText(headingRef.current, {
      type: "lines, words",
      linesClass: "line",
    });

    const paraSplit = new SplitText(paraRef.current, {
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
      "-=0.2"
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

    tl.from(
      buttonSelector,
      {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power1",
      },
      "-=0.3"
    );

    gsap.from(bgSelector, {
      opacity: 0,
      scale: 1.05,
      duration: 1,
      ease: "power2.out",
    });

    return () => {
      headingSplit.revert();
      paraSplit.revert();
    };
  }, [headingRef, paraRef, buttonSelector, bgSelector]);
}

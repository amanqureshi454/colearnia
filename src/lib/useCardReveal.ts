// src/hooks/useCardReveal.ts
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface UseCardRevealProps {
  trigger: string;
  headingRef: React.RefObject<HTMLElement | null>;
  paraRef: React.RefObject<HTMLElement | null>;
  cardSelector?: string;
  iconRef?: React.RefObject<HTMLElement | null>; // ✅ New optional icon ref
}

export function useCardReveal({
  trigger,
  headingRef,
  paraRef,
  cardSelector,
  iconRef,
}: UseCardRevealProps) {
  useEffect(() => {
    if (!headingRef.current || !paraRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "top 70%",
        },
      });

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

      if (iconRef?.current) {
        tl.from(
          iconRef.current,
          {
            opacity: 0,
            scale: 0.6,
            duration: 0.8,
            ease: "power1",
          },
          "-=0.4"
        );
      }
      // Heading animation
      tl.from(
        headingWords,
        {
          duration: 0.8,
          opacity: 0,
          yPercent: 120,
          ease: "power1",
          stagger: 0.035,
        },
        "-=0.4"
      );

      // Paragraph animation
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

      // Optional card animation
      if (cardSelector) {
        const cards = document.querySelectorAll(cardSelector);
        if (cards.length > 0) {
          tl.from(
            cards,
            {
              opacity: 0,
              y: 100,
              duration: 1,
              ease: "power1.out",
              stagger: 0.08,
            },
            "-=0.3"
          );
        }
      }

      // ✅ Optional icon animation
    });

    return () => ctx.revert();
  }, [trigger, headingRef, paraRef, cardSelector, iconRef]);
}

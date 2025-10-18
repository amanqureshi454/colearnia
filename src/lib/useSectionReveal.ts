import { useEffect } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

type UseSplitTextAnimationProps<T extends HTMLElement = HTMLElement> = {
  headingRef: React.RefObject<T | null>;
  paraRef?: React.RefObject<T | null>;
  shinyRef?: React.RefObject<T | null>;
  triggerId: string;
};

export function useSplitTextAnimation<T extends HTMLElement = HTMLElement>({
  headingRef,
  paraRef,
  shinyRef,
  triggerId,
}: UseSplitTextAnimationProps<T>) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: `#${triggerId}`,
          start: "top 70%",
        },
      });

      // Animate heading
      if (headingRef.current) {
        const headingSplit = new SplitText(headingRef.current, {
          type: "lines, words",
          linesClass: "line",
        });
        const headingWords = headingSplit.words;

        tl.from(headingWords, {
          duration: 0.8,
          opacity: 0,
          yPercent: 120,
          ease: "power",
          stagger: 0.015,
        });
      }

      // Animate paragraph
      if (paraRef?.current) {
        const paraSplit = new SplitText(paraRef.current, {
          type: "lines, words",
          linesClass: "line",
        });
        const paraWords = paraSplit.words;

        tl.from(
          paraWords,
          {
            duration: 0.7,
            opacity: 0,
            yPercent: 120,
            ease: "power",
            stagger: 0.01,
          },
          "-=0.5"
        );
      }

      // Animate shiny button if exists
      if (shinyRef?.current) {
        tl.from(
          shinyRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power",
          },
          "-=0.4"
        );
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [headingRef, paraRef, shinyRef, triggerId]);
}

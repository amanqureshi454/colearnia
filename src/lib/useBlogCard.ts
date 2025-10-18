import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// hooks/useSectionReveal.ts
interface UseSectionRevealProps {
  trigger: string;
  headingRef: React.RefObject<HTMLElement | null>;
  itemSelector?: string;
}

export function useSectionReveal({
  trigger,
  headingRef,
  itemSelector,
}: UseSectionRevealProps) {
  useEffect(() => {
    if (!headingRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "top 75%",
          once: true, // ✅ only trigger once
        },
      });

      // Section fade in
      tl.from(trigger, {
        opacity: 0,
        y: 80,
        duration: 0.6,
        ease: "power2.out",
      });

      // Split heading
      const headingSplit = new SplitText(headingRef.current, {
        type: "lines, words",
        linesClass: "line",
      });

      tl.from(
        headingSplit.words,
        {
          duration: 0.8,
          opacity: 0,
          yPercent: 120,
          ease: "power1",
          stagger: 0.04,
        },
        "-=0.4"
      );

      // Animate blog cards
      if (itemSelector) {
        const items = document.querySelectorAll(itemSelector);
        if (items.length > 0) {
          tl.from(
            items,
            {
              opacity: 0,
              y: 100,
              duration: 1,
              ease: "power3.out",
              stagger: 0.1,
            },
            "-=0.3"
          );
        }
      }
    });

    return () => ctx.revert();
  }, [trigger, headingRef, itemSelector]);
}

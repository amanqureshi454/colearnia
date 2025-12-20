"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugin outside component to avoid re-registration
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqData: FAQItem[];
}

export default function FAQSection({ faqData }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasAnimated = useRef(false);

  // Toggle open/close
  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // GSAP Scroll Animation
  useEffect(() => {
    // Prevent re-running animation
    if (hasAnimated.current) return;

    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (items.length === 0) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Set initial state immediately
        gsap.set(items, {
          opacity: 0,
          y: 50,
          filter: "blur(10px)",
        });

        // Create a timeline triggered by the container
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
            onEnter: () => {
              hasAnimated.current = true;
            },
            // markers: true, // Uncomment for debugging
          },
        });

        // Animate all items with stagger
        tl.to(items, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
        });
      }, containerRef);

      // Store context for cleanup
      return () => ctx.revert();
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [faqData]);

  // Height animation for answer
  useEffect(() => {
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const answer = el.querySelector(".faq-answer") as HTMLElement;
      if (!answer) return;

      if (openIndex === i) {
        gsap.to(answer, {
          height: "auto",
          duration: 0.4,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(answer, {
          height: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });
      }
    });
  }, [openIndex]);

  return (
    <div>
      {/* FAQ List */}
      <div
        ref={containerRef}
        className="space-y-4 max-w-5xl mx-auto mt-12 pb-8"
      >
        {faqData.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={`
                rounded-2xl border-2 bg-white shadow-md overflow-hidden
                ${
                  openIndex === index
                    ? "border-orange-400 "
                    : "border-transparent"
                }
              `}
          >
            {/* Question */}
            <button
              onClick={() => toggle(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left gap-4 transition"
              aria-expanded={openIndex === index}
            >
              <span
                className={`
                    text-lg font-semibold text-[#193c51] transition-all
                  `}
              >
                {item.question}
              </span>
              <div
                className={`rounded-full flex justify-center items-center w-12 h-12 ${
                  openIndex === index ? "bg-heading" : "bg-transparent"
                }`}
              >
                <ChevronDown
                  className={`
                  w-7 h-7 transition-transform duration-300
                  ${
                    openIndex === index ? "rotate-180 text-white" : "text-black"
                  }
                  `}
                />
              </div>
            </button>

            {/* Answer (GSAP-controlled height) */}
            <div className="faq-answer overflow-hidden" style={{ height: 0 }}>
              <div className="px-6 pb-5">
                <p className="text-sm md:text-base text-[#2D2D2D] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

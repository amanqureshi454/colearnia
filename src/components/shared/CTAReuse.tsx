"use client";
import React, { useRef, useEffect } from "react";
import Button from "./Button";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CTAReuseProps {
  title: string; // dynamic heading text
  subtitle?: string; // optional subtitle text
  primaryText: string; // text for first button
  secondaryText: string; // text for second button
  backgroundImage?: string; // optional background image class
}

const CTAReuse: React.FC<CTAReuseProps> = ({
  title,
  subtitle,
  primaryText,
  secondaryText,
  backgroundImage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    document.fonts.ready.then(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      // Heading animation
      if (headingRef.current) {
        tl.from(headingRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      // Paragraph (subtitle) animation
      if (paraRef.current) {
        tl.from(
          paraRef.current,
          {
            opacity: 0,
            yPercent: 120,
            duration: 0.7,
            ease: "power1.out",
          },
          "-=0.4"
        );
      }

      // Buttons animation
      if (buttonsRef.current) {
        const buttons = buttonsRef.current.querySelectorAll("button, a");
        tl.from(
          buttons,
          {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15,
          },
          "-=0.3"
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full relative max-w-7xl mx-auto mb-14 rounded-4xl sm:h-84 tab:h-102 
               ${backgroundImage}  bg-cover bg-center overflow-hidden`}
    >
      <div className="relative flex h-full gap-4 items-center justify-center flex-col p-3 text-center">
        {/* Title */}
        <h1
          ref={headingRef}
          className="text-center w-full text-white font-bold font-inter sm:text-4xl md:text-5xl"
        >
          {title}
        </h1>

        {/* Subtitle (optional) */}
        {subtitle && (
          <p
            ref={paraRef}
            className="text-white font-inter text-lg font-semibold"
          >
            {subtitle}
          </p>
        )}

        {/* Buttons */}
        <div ref={buttonsRef} className="flex flex-row gap-4 mt-5">
          <Button text={primaryText} />
          <button
            className="w-max px-5 py-3.5 text-center bg-white ease-in-out hover:scale-105 
                       rounded-full cursor-pointer sm:text-sm md:text-lg font-inter font-medium 
                       flex justify-center items-center"
          >
            <span className="text-heading">{secondaryText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTAReuse;

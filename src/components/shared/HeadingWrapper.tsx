"use client";

import React, { useRef, forwardRef } from "react";
import { usePathname } from "next/navigation";

interface SectionHeaderProps {
  heading: string;
  subheading?: string;
  containerClassName?: string;
}

const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ heading, subheading, containerClassName }, ref) => {
    // refs
    const containerRef = useRef<HTMLDivElement | null>(null);
    const headlineRef = useRef<HTMLDivElement | null>(null);
    const headingRef = useRef<HTMLHeadingElement | null>(null);
    const subheadingRef = useRef<HTMLParagraphElement | null>(null);
    const pathname = usePathname();
    const isRTL = pathname?.startsWith("/ar") ?? false;

    // useHeadingAnimation({
    //   containerRef,
    //   headlineRef,
    //   headingRef,
    //   subheadingRef,
    //   start: "top 80%",
    // });

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
        }}
        className={
          containerClassName ||
          "flex flex-col items-center overflow-hidden sm:w-full tab:w-11/12 md:w-8/12 mx-auto justify-center"
        }
      >
        <h1
          ref={headingRef}
          className={`text-center text-heading font-bold font-inter ${
            isRTL ? "leading-[1.35]" : "leading-[1.1]"
          } sm:text-3xl  md:text-6xl`}
        >
          {heading}
        </h1>
        {subheading && (
          <p
            ref={subheadingRef}
            className="md:text-xl sm:text-sm font-inter font-medium mt-3 text-center text-paragraph w-full"
          >
            {subheading}
          </p>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;

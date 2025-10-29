"use client";

import React, { forwardRef } from "react";

interface HeroHeadingTitleProps {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  isRTL: boolean;
  t: (key: string) => string;
  className?: string;
}

const HeroHeadingTitle = forwardRef<
  HTMLHeadingElement | null,
  HeroHeadingTitleProps
>(({ headingRef, isRTL, t, className = "" }, ref) => {
  return (
    <h1
      ref={headingRef}
      style={{ textAlign: isRTL ? "right" : "left" }}
      className={`
          lg:text-7xl tab:text-[46px] md:text-6xl sm:text-5xl 
          font-bold text-heading 
          ${isRTL ? "text-right leading-[1.35]" : "text-left  leading-[1.15]"} 
          ${className}
        `.trim()}
    >
      {t("Title")}
    </h1>
  );
});

HeroHeadingTitle.displayName = "HeroHeadingTitle";

export default HeroHeadingTitle;

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
          lg:text-7xl font-inter tab:text-[46px] md:text-6xl !leading-[1.15] sm:text-5xl 
          font-extrabold text-heading 
          ${isRTL ? "text-right" : "text-left"} 
          ${className}
        `.trim()}
    >
      {t("Title")}
    </h1>
  );
});

HeroHeadingTitle.displayName = "HeroHeadingTitle";

export default HeroHeadingTitle;

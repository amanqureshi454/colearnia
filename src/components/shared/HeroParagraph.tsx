"use client";

import React from "react";

interface HeroParagraphProps {
  paraRef: React.RefObject<HTMLParagraphElement | null>;
  isRTL: boolean;
  t: (key: string) => string;
  className?: string;
}

const HeroParagraph = ({
  paraRef,
  isRTL,
  t,
  className = "",
}: HeroParagraphProps) => {
  return (
    <p
      ref={paraRef}
      style={{ textAlign: isRTL ? "right" : "left" }}
      className={`
          md:text-xl sm:text-sm tab:text-sm 
          font-inter font-medium 
          ${isRTL ? "text-right" : "text-left"} 
          lg:w-9/12 tab:w-full md:w-10/12 
          ${className}
        `.trim()}
      aria-hidden
      aria-label="false"
    >
      {t("Subtitle")}
    </p>
  );
};

HeroParagraph.displayName = "HeroParagraph";

export default HeroParagraph;

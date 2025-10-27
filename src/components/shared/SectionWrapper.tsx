import React from "react";
import { cn } from "@/lib/utils"; // adjust path where your cn utility is

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  className,
  children,
}) => {
  return (
    <div
      id={id}
      className={cn(
        "relative z-20  max-w-7xl mx-auto  sm:w-full  sm:max-w-[95%] md:max-w-[90%] lg:max-w-[85%] sm:py-8 md:py-12",
        className
      )}
    >
      {children}
    </div>
  );
};

export default SectionWrapper;

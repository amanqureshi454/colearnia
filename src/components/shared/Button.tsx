"use client";

import { usePathname } from "next/navigation";
import React from "react";

interface ButtonProps {
  text: string;
  style: string;
}

const Button: React.FC<ButtonProps> = ({ text, style }) => {
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;
  return (
    <button
      className={`${style} sm:h-14 tab:h-16 text-white py-2 px-4 rounded-xl ${
        isRTL ? "font-cairo font-normal" : "font-melodyM"
      } tab:text-lg sm:text-sm transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer`}
    >
      {text}
    </button>
  );
};

export default Button;

"use client";

import React from "react";

interface ButtonProps {
  text: string;
  style?: string;
}

const Button: React.FC<ButtonProps> = ({ text, style }) => {
  return (
    <button
      className={`${style} w-max md:px-6 sm:px-4 sm:py-3 text-center text-white  hover:scale-105 cursor-pointer sm:text-sm md:text-lg font-inter font-medium flex justify-center items-center gap-3 bg-brand  rounded-full`}
    >
      {text}
    </button>
  );
};

export default Button;

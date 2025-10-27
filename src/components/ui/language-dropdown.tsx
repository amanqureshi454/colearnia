"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const languages = ["en", "ar"] as const;

export default function LanguageSelector() {
  const pathname = usePathname();

  const currentLang = pathname.startsWith("/ar") ? "ar" : "en";
  const isRTL = pathname?.startsWith("/ar") ?? false;

  const [isHovered, setIsHovered] = useState(false);

  const availableLangs = languages.filter((lang) => lang !== currentLang);
  const strippedPath = pathname.replace(/^\/(en|ar)/, "");

  return (
    <div
      className="relative w-max"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Toggle button */}
      <div
        className={` flex cursor-pointer justify-center items-center gap-2 ${
          isRTL ? "mr-3" : "ml-3"
        } `}
      >
        <span className="font-normal text-sm uppercase text-black text-center">
          {currentLang}
        </span>
        <Image
          width={20}
          height={20}
          alt="dropdown-arrow"
          className="w-8 h-8 object-contain rounded-xl"
          src={`${
            isRTL
              ? "/images/svg/qatar.svg"
              : "/images/svg/united-kingdom-flag-icon.svg"
          }`}
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`absolute top-8 ${
              isRTL ? "-right-1 text-right" : "-left-1 text-left"
            } z-10 w-20 rounded-[8px]  bg-white px-2.5 py-2 text-black shadow-lg ring-1 shadow-black/40 ring-white/30 backdrop-blur-md`}
          >
            {availableLangs.map((lang) => (
              <Link
                key={lang}
                href={`/${lang}${strippedPath || "/"}`}
                scroll={false}
                className="font-normal text-md uppercase text-black hover:text-brand transition-all"
              >
                {lang}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

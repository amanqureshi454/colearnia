"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const languages = ["en", "ar"] as const;

const MobileMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("Navbar");
  const pathname = usePathname();

  const isRTL = pathname?.startsWith("/ar") ?? false;

  const navLinks = [
    { label: t("Home"), href: "" },
    { label: t("How it work"), href: "how-it-work" },
    { label: t("About Us"), href: "about-us" },
    { label: t("Blog"), href: "blog" },
    { label: t("Pricing"), href: "pricing" },
    { label: t("Contact"), href: "contact" },
  ];

  const locale = useLocale();
  const availableLangs = languages.filter((lang) => lang !== locale);

  const strippedPath = pathname.replace(/^\/(en|ar)/, "");

  const localizePath = (path: string = "") =>
    `/${locale}${path ? `/${path}` : ""}`;
  return (
    <nav
      dir={isRTL ? "rtl" : "ltr"}
      className={`fixed top-0 left-1/2 tab:px-8 sm:px-4 transform z-[199] font-manrope -translate-x-1/2 py-3 w-full transition-all duration-300 bg-brand`}
    >
      <div className="header flex justify-between items-center">
        <Link href="/" className="logo">
          <Image
            width={100}
            height={100}
            quality={100}
            src="/images/svg/logo.svg"
            className="tab:w-full sm:w-40 :object-contain h-[52px]"
            alt="Jood Pay Logo"
          />
        </Link>

        {/* 🍔 Hamburger Button */}
        <button
          aria-expanded={menuOpen}
          type="button"
          aria-label="menu"
          onClick={() => setMenuOpen((prev) => !prev)} // 👈 Toggle menuOpen
          className="group relative h-6 w-6"
          style={
            {
              "--width": "1.55rem",
              "--thickness": "0.155rem",
              "--gap": "0.25rem",
              "--color": "#fff",
              "--duration": "400ms",
            } as React.CSSProperties
          }
        >
          <span className="absolute left-1/2 top-1/2 h-[var(--thickness)] w-[var(--width)] -translate-x-1/2 translate-y-[calc(-150%-var(--gap))] transition-transform duration-[calc(var(--duration)*2/3)] before:absolute before:right-0 before:h-full before:w-full before:rounded-full before:bg-[var(--color)] before:transition-[width] before:delay-[calc(var(--duration)*1/3)] before:duration-[calc(var(--duration)*2/3)] group-aria-expanded:-translate-y-1/2 group-aria-expanded:-rotate-45 group-aria-expanded:delay-[calc(var(--duration)*1/3)] before:group-aria-expanded:w-[60%] before:group-aria-expanded:delay-0"></span>
          <span className="absolute left-1/2 top-1/2 h-[var(--thickness)] w-[var(--width)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color)] transition-transform duration-[calc(var(--duration)*2/3)] group-aria-expanded:rotate-45 group-aria-expanded:delay-[calc(var(--duration)*1/3)]"></span>
          <span className="absolute left-1/2 top-1/2 h-[var(--thickness)] w-[var(--width)] -translate-x-1/2 translate-y-[calc(50%+var(--gap))] transition-transform duration-[calc(var(--duration)*2/3)] before:absolute before:right-0 before:h-full before:w-[60%] before:rounded-full before:bg-[var(--color)] before:transition-[right] before:delay-[calc(var(--duration)*1/3)] before:duration-[calc(var(--duration)*2/3)] group-aria-expanded:-translate-y-1/2 group-aria-expanded:-rotate-45 group-aria-expanded:delay-[calc(var(--duration)*1/3)] before:group-aria-expanded:right-[40%] before:group-aria-expanded:delay-0"></span>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            key="solution-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-max pb-5 w-full"
          >
            <div className="links">
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.075 } },
                  hidden: {},
                }}
                className="flex justify-center flex-col items-left py-9 w-max overflow-hidden"
              >
                {navLinks.map((link, i) => {
                  const fullHref = `/${locale}${
                    link.href ? `/${link.href}` : ""
                  }`;

                  return (
                    <motion.li
                      key={i}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 0, opacity: 0 }}
                      transition={{
                        duration: 0.75,
                        ease: [0.33, 1, 0.68, 1],
                        delay: 0.075 * i,
                      }}
                      className={`${
                        isRTL ? "font-cairo" : "font-melodyB"
                      } px-4 py-1 overflow-hidden cursor-pointer font-bold text-4xl text-white`}
                    >
                      <motion.div onClick={() => setMenuOpen(false)}>
                        <Link href={fullHref}>{link.label}</Link>
                      </motion.div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
            {/* Button with delay */}
            <motion.div
              className="btn flex w-full flex-col justify-center items-center gap-3 overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
            >
              <Link
                href={localizePath("signup")}
                className="bg-third cursor-pointer w-full text-white px-5 py-3 flex justify-center items-center rounded-xl font-normal transition-transform duration-200 ease-in-out hover:scale-105"
              >
                {t("create-account")}
              </Link>

              <Link
                href={localizePath("signin")}
                className="bg-secondary cursor-pointer w-full text-white px-5 py-3 flex justify-center items-center rounded-xl font-normal transition-transform duration-200 ease-in-out hover:scale-105"
              >
                {t("Login")}
              </Link>
            </motion.div>
            {/* Language Switcher Reveal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
              className="relative z-20 w-full pt-10 overflow-hidden"
            >
              <div className="ml-auto w-max rounded-[10px] border-white/40 bg-white p-4 px-2.5 py-2 text-white shadow-lg ">
                {availableLangs.map((lang) => (
                  <motion.div key={lang}>
                    <Link
                      href={`/${lang}${strippedPath || "/"}`}
                      locale={lang}
                      scroll={false}
                      className="text-medium font-cairo font-medium hover:text-brand block cursor-pointer px-4 text-center -tracking-[0.5px] text-black uppercase transition-all"
                    >
                      {lang}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MobileMenu;

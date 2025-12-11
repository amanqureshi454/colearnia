"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import LanguageSelector from "../ui/language-dropdown";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import MobileMenu from "../ui/mobile-menu";

const Navbar = () => {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const userData = localStorage.getItem("user");

      if (!userData || userData === "undefined") {
        console.warn("⚠️ No valid user data found in localStorage");
        return;
      }

      const user = JSON.parse(userData);
      if (user && user.email) {
        setUserEmail(user.email);
      } else {
        console.warn("⚠️ User data does not contain email");
      }
    } catch (error) {
      console.error("❌ Failed to parse user from localStorage:", error);
    }
  }, []);
  // ✅ Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // when Y > 50
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const isRTL = pathname?.startsWith("/ar") ?? false;
  const localizePath = (path: string = "") =>
    `/${locale}${path ? `/${path}` : ""}`;
  // const isAboutUsPage = pathname?.includes("/about-us");
  const navLinks = [
    { label: t("Home"), href: "" },
    { label: t("About Us"), href: "about-us" },
    { label: t("How it work"), href: "how-it-work" },
    { label: t("Blog"), href: "blog" },
    { label: t("Contact"), href: "contact" },
    { label: t("FreeResource"), href: "resource" },
  ];

  return (
    <>
      <nav
        dir={isRTL ? "rtl" : "ltr"}
        className={`fixed top-0 lg:block sm:hidden left-1/2  -translate-x-1/2 z-[199] w-full py-2.5 transition-all duration-300 font-inter
        ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }
        `}
      >
        <div className="w-full md:max-w-[85%]  h-full flex justify-between items-center mx-auto">
          <Link href={localizePath()} className="logo">
            <Image
              width={240}
              height={50}
              quality={100}
              src="/images/svg/logo.svg"
              className="w-[200px] object-cover h-[55px]"
              alt="Study Circle Logo"
            />
          </Link>

          <div className="links w-max">
            {mounted && (
              <ul className="flex justify-center items-center w-max">
                {navLinks.map((link, i) => {
                  const fullHref = localizePath(link.href);
                  const isActive =
                    link.href === ""
                      ? pathname === localizePath() ||
                        pathname === `${localizePath()}/`
                      : pathname.startsWith(fullHref);

                  return (
                    <li key={i} className="font-normal px-3 py-1">
                      <Link
                        className={` hover:text-black font-normal text-sm leading-[150%] ${
                          isActive ? "text-black" : "text-[#A6A6A6]"
                        }`}
                        href={fullHref}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="flex w-max  items-center gap-3">
            {userEmail ? (
              <p className="text-sm text-black font-medium font-inter">
                {userEmail}
              </p>
            ) : (
              <>
                <Link
                  href={localizePath("signin")}
                  className="cursor-pointer text-black text-sm px-2 py-2 flex justify-center items-center font-medium transition-transform duration-200 ease-in-out hover:scale-105"
                >
                  {t("Login")}
                </Link>

                <Link
                  href={localizePath("signup")}
                  className="bg-heading cursor-pointer text-sm text-white px-5 py-3 flex justify-center items-center rounded-xl font-normal transition-transform duration-200 ease-in-out hover:scale-105"
                >
                  {t("create-account")}
                </Link>
              </>
            )}
            <LanguageSelector />
          </div>
        </div>
      </nav>
      <div className="w-full lg:hidden sm:block">
        <MobileMenu />
      </div>
    </>
  );
};

export default Navbar;

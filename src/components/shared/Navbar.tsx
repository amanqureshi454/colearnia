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

  const isRTL = pathname?.startsWith("/ar") ?? false;

  // ✅ helper for locale-aware paths
  const localizePath = (path: string = "") =>
    `/${locale}${path ? `/${path}` : ""}`;

  const navLinks = [
    { label: t("Home"), href: "" },
    { label: t("How it work"), href: "how-it-work" },
    { label: t("About Us"), href: "about-us" },
    { label: t("Blog"), href: "blog" },
    { label: t("Pricing"), href: "pricing" },
    { label: t("Contact"), href: "contact" },
  ];

  return (
    <>
      <nav
        dir={isRTL ? "rtl" : "ltr"}
        className={`fixed top-0 left-1/2 md:block ${
          isRTL ? "font-cairo" : "font-melodyM"
        } sm:hidden transform z-[199] bg-brand md:block -translate-x-1/2 py-2 h-[85px] w-full`}
      >
        <div className="w-full md:max-w-[95%] h-full flex justify-between items-center mx-auto">
          <Link href={localizePath()} className="logo">
            <Image
              width={240}
              height={50}
              quality={100}
              src="/images/svg/logo.svg"
              className="w-[240px] object-contain h-[42px]"
              alt="Study Circle Logo"
            />
          </Link>

          <div className="links">
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
                        className={`hover-links leading-[150%] ${
                          isActive ? "text-white" : "text-white/60"
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

          <div className="btn flex justify-center items-center gap-3">
            {userEmail ? (
              <p className="text-sm text-white font-medium font-inter">
                {userEmail}
              </p>
            ) : (
              <>
                <Link
                  href={localizePath("signup")}
                  className="bg-third cursor-pointer text-white px-5 py-3 flex justify-center items-center rounded-xl font-normal transition-transform duration-200 ease-in-out hover:scale-105"
                >
                  {t("create-account")}
                </Link>

                <Link
                  href={localizePath("signin")}
                  className="bg-secondary cursor-pointer text-white px-5 py-3 flex justify-center items-center rounded-xl font-normal transition-transform duration-200 ease-in-out hover:scale-105"
                >
                  {t("Login")}
                </Link>
              </>
            )}
            <LanguageSelector />
          </div>
        </div>
      </nav>
      <div className="w-full md:hidden sm:block">
        <MobileMenu />
      </div>
    </>
  );
};

export default Navbar;

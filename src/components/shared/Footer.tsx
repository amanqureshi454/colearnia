"use client";
import React from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

interface FooterData {
  logo: { src: string; alt: string; width: number; height: number };
  tagline: string;
  copyright: string;
  legalLinks: { label: string; href: string }[];
}

gsap.registerPlugin(SplitText, ScrollTrigger);

const Footer = () => {
  const t = useTranslations("Footer");
  const t2 = useTranslations("Navbar");

  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const footerData: FooterData = {
    logo: {
      src: "/images/png/footer-logo.png",
      alt: t("logo.alt"),
      width: 220,
      height: 80,
    },
    tagline: t("tagline"),

    copyright: t("copyright"),
    legalLinks: [
      { label: t("legalLinks.0"), href: "/terms" }, // "الشروط والأحكام"
      { label: t("legalLinks.1"), href: "/privacy" }, // "سياسة الخصوصية"
    ],
  };
  const localizePath = (path: string = "") =>
    `/${locale}${path ? `/${path}` : ""}`;

  const navLinks = [
    { label: t2("Home"), href: "" },
    { label: t2("About Us"), href: "about-us" },
    { label: t2("How it work"), href: "how-it-work" },
    { label: t2("Blog"), href: "blog" },
    { label: t2("Contact"), href: "contact" },
    { label: t2("FreeResource"), href: "resource" },
  ];

  return (
    <footer className="bg-[#0A2E5A] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="flex items-center tab:flex-row sm:flex-col justify-between gap-8">
          {/* Logo + Tagline */}
          <div className="tab:w-max sm:w-full">
            <Link href="/" className="mb-4">
              <Image
                src={footerData.logo.src}
                alt={footerData.logo.alt}
                width={footerData.logo.width}
                height={footerData.logo.height}
                className="h-20 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              {footerData.tagline}
            </p>
          </div>

          {/* Columns */}
          <div className="gap-5 tab:w-max sm:w-full flex-col  flex sm:items-start tab:items-center">
            <h3 className="font-semibold text-white w-full">{t2("Company")}</h3>

            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={localizePath(link.href)}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-center items-center gap-4 text-sm">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {footerData.copyright}
          </p>

          {/* <div className="flex gap-6">
            {footerData.legalLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

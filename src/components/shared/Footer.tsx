"use client";
import React from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

interface FooterData {
  logo: { src: string; alt: string; width: number; height: number };
  tagline: string;
  columns: FooterColumn[];
  copyright: string;
  legalLinks: { label: string; href: string }[];
}

gsap.registerPlugin(SplitText, ScrollTrigger);

const Footer = () => {
  const t = useTranslations("Footer");
  const footerData: FooterData = {
    logo: {
      src: "/images/png/footer-logo.png",
      alt: t("logo.alt"),
      width: 220,
      height: 80,
    },
    tagline: t("tagline"),
    columns: [
      {
        title: t("columns.0.title"), // "الدعم"
        links: [
          { label: t("columns.0.links.0"), href: "/help" }, // "مركز المساعدة"
          { label: t("columns.0.links.1"), href: "/account" }, // "معلومات الحساب"
          { label: t("columns.0.links.2"), href: "/about" }, // "من نحن"
          { label: t("columns.0.links.3"), href: "/contact" }, // "تواصل معنا"
        ],
      },
      {
        title: t("columns.1.title"), // "الدعم والحلول"
        links: [
          { label: t("columns.1.links.0"), href: "/support" }, // "تحدث مع فريق الدعم"
          { label: t("columns.1.links.1"), href: "/docs" }, // "وثائق المساعدة"
          { label: t("columns.1.links.2"), href: "/status" }, // "حالة النظام"
          { label: t("columns.1.links.3"), href: "/covid" }, // "استجابة كوفيد"
        ],
      },
      {
        title: t("columns.2.title"), // "المنتج"
        links: [
          { label: t("columns.2.links.0"), href: "/update" }, // "آخر التحديثات"
          { label: t("columns.2.links.1"), href: "/security" }, // "الأمان"
          { label: t("columns.2.links.2"), href: "/beta" }, // "اختبار بيتا"
          { label: t("columns.2.links.3"), href: "/pricing" }, // "أسعار المنتج"
        ],
      },
    ],
    copyright: t("copyright"),
    legalLinks: [
      { label: t("legalLinks.0"), href: "/terms" }, // "الشروط والأحكام"
      { label: t("legalLinks.1"), href: "/privacy" }, // "سياسة الخصوصية"
    ],
  };
  return (
    <footer className="bg-[#0A2E5A] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
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
          <div className="gap-5 tab:w-max sm:w-full tab:flex-row sm:flex-wrap flex items-center">
            {footerData.columns.map((column, colIndex) => (
              <div key={colIndex} className=" sm:w-[45%] tab:w-max tab:px-5">
                <h3 className="font-semibold  text-white mb-4">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-gray-400">{footerData.copyright}</p>
          <div className="flex gap-6">
            {footerData.legalLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

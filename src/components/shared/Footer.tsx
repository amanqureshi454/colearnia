"use client";
import React from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
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
const footerData: FooterData = {
  logo: {
    src: "/images/png/footer-logo.png",
    alt: "CoLearnnia Logo",
    width: 220,
    height: 80,
  },
  tagline: "Learn Together, Succeed Together",
  columns: [
    {
      title: "Support",
      links: [
        { label: "Help centre", href: "/help" },
        {
          label: "Account information",
          href: "/account",
        },
        { label: "About", href: "/about" },
        { label: "Contact us", href: "/contact" },
      ],
    },
    {
      title: "Help and Solution",
      links: [
        { label: "Talk to support", href: "/support" },
        { label: "Support docs", href: "/docs" },
        { label: "System status", href: "/status" },
        { label: "Covid responde", href: "/covid" },
      ],
    },
    {
      title: "Product",
      links: [
        { label: "Update", href: "/update" },
        { label: "Security", href: "/security" },
        { label: "Beta test", href: "/beta" },
        { label: "Pricing product", href: "/pricing" },
      ],
    },
  ],
  copyright: "© 2025 Colearnia. Copyright and rights reserved",
  legalLinks: [
    { label: "Terms and conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

gsap.registerPlugin(SplitText, ScrollTrigger);

const Footer = () => {
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

"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(SplitText, ScrollTrigger);

const Footer = () => {
  const [email, setEmail] = useState("");
  const t2 = useTranslations("Navbar");
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  const isRTL = pathname?.startsWith("/ar") ?? false;

  const navLinks = [
    { label: t2("Home"), href: "" },
    { label: t2("How it work"), href: "how-it-work" },
    { label: t2("About Us"), href: "about-us" },
    { label: t2("Blog"), href: "blog" },
    { label: t2("Pricing"), href: "pricing" },
    { label: t2("Contact"), href: "contact" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "/images/svg/facebook-f.svg", href: "#" },
    { name: "Twitter", icon: "/images/svg/x.svg", href: "#" },
    { name: "LinkedIn", icon: "/images/svg/linkedin-in.svg", href: "#" },
    { name: "WhatsApp", icon: "/images/svg/whatsapp.svg", href: "#" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };
  return (
    <footer
      className={`bg-brand text-white w-full  ${
        isRTL ? "font-cairo" : "font-melodyM"
      }`}
    >
      <div className="tab:max-w-[95%] w-full mx-auto py-10 px-6">
        <div className="flex flex-col h-full tab:flex-row justify-between items-start tab:items-center gap-8">
          <div className="flex flex-col max-w-xs">
            <h3 className="text-sm font-semibold font-inter mb-4 ">
              NEWSLETTER
            </h3>

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex justify-between items-center bg-white/20 rounded-full p-2 ">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent px-4 py-2 text-white placeholder-gray-300 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="bg-white text-black w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </form>

            <p className="text-white font-light font-inter text-xs mb-6">
              Get platform updates, new features, and teaching tips straight to
              your inbox.{" "}
              <button className="font-semibold cursor-pointer hover:underline">
                Unsubscribe
              </button>
            </p>

            <div className="flex gap-4">
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="w-10 h-10 border border-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Image
                    src={link.icon}
                    alt={link.name}
                    width={16}
                    height={16}
                    className="w-4.5 h-4 object-cover"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="flex justify-between sm:h-max tab:h-[220px] sm:gap-5 md:gap-0 sm:items-center tab:items-end flex-col ">
            <nav className="flex flex-wrap sm:gap-3 tab:gap-4 items-center justify-center font-inter sm:text-xs md:text-sm">
              {navLinks.map((link, i) => {
                const fullHref = `/${locale}${
                  link.href ? `/${link.href}` : ""
                }`;
                const isActive =
                  link.href === ""
                    ? pathname === `/${locale}` || pathname === `/${locale}/`
                    : pathname.startsWith(fullHref);

                return (
                  <Link
                    key={i}
                    className={`hover-links leading-[150%]  ${
                      isRTL ? "font-cairo" : "font-melodyM"
                    } ${isActive ? "text-white" : "text-white/60"}`}
                    href={fullHref}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <p className="text-white mb-5 text-sm">
              © Copyright – All right reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

/* eslint-disable react/no-unescaped-entities */
"use client";

import { useHeroReveal } from "@/lib/useHeroReveal";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
gsap.registerPlugin(SplitText);
import emailjs from "@emailjs/browser";
import BtnLoader from "@/components/ui/btn-loader";
const Page = () => {
  const t = useTranslations("Contact");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;

  const socialLinks = [
    { name: "Facebook", icon: "/images/svg/facebook-f.svg", href: "#" },
    { name: "Twitter", icon: "/images/svg/x.svg", href: "#" },
    { name: "LinkedIn", icon: "/images/svg/linkedin-in.svg", href: "#" },
    { name: "Instagram", icon: "/images/svg/Instagram.svg", href: "#" },
    { name: "YouTube", icon: "/images/svg/Youtube.svg", href: "#" },
  ];
  const contactInfo = [
    {
      icon: "/images/svg/sms (1).svg",
      title: "Email :",
      content: "support@colearnia.com",
      href: "mailto:support@colearnia.com",
    },
    {
      icon: "/images/svg/call.svg",
      title: "Phone :",
      content: "(974) 770 60779",
      href: "tel:+97477060779",
    },
  ];

  useHeroReveal({
    headingRef,
    paraRef,
    buttonSelector: ".hero-button",
    bgSelector: ".hero-bg-wrapper",
  });
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#contact",
          start: "top 70%",
        },
      });

      // Step 1: Fade in whole section
      tl.from("#contact", {
        opacity: 0,
        duration: 0.8,
        ease: "power1.out",
      });
    });

    return () => ctx.revert();
  }, []);

  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    if (!form.current) return;

    emailjs
      .sendForm(
        "service_5fjwaga",
        "template_jge9lpn",
        form.current,
        "TlnpTBCfq9_pJzwc-"
      )
      .then(
        () => {
          setLoading(false);
          setStatusMessage({
            type: "success",
            text: "Your message has been sent successfully!",
          });
          form.current?.reset();

          // Clear message after 3 seconds
          setTimeout(() => setStatusMessage(null), 3000);
        },
        () => {
          setLoading(false);
          setStatusMessage({
            type: "error",
            text: "Something went wrong. Please try again later.",
          });

          // Clear message after 3 seconds
          setTimeout(() => setStatusMessage(null), 3000);
        }
      );
  };

  return (
    <div
      className={`w-full  ${
        isRTL ? "font-cairo" : "font-melodyB"
      } h-full bg-background relative tab:pt-[160px] sm:pt-[150px]`}
    >
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="relative z-20 gap-4 sm:px-4 mx-auto flex flex-col justify-center items-center"
      >
        <h1
          ref={headingRef}
          className="md:text-6xl sm:text-5xl leading-normal font-bold text-brand text-center"
        >
          {t("Title")}
        </h1>
        <p
          ref={paraRef}
          className="md:text-xl sm:text-lg leading-normal opacity-80 text-center"
        >
          {t("Subtitle")}
        </p>
      </div>
      <div className="relative w-full z-10 md:h-[650px] sm:h-[550px] overflow-hidden px-5 ">
        <Image
          src="/images/png/contact-.png"
          alt="Hero Background"
          width={800}
          height={650}
          className="md:w-7/12 hero-bg-wrapper sm:w-full mx-auto h-full object-contain"
          priority
        />
      </div>
      <div id="contact" className="tab:w-[90%] sm:w-full sm:px-3  mx-auto">
        <div
          id="contact-section"
          className="w-full  text-brand md:py-6  flex flex-col tab:flex-wrap tab:flex-row justify-center items-center sm:gap-5 md:gap-0"
        >
          {contactInfo.map((item, index) => (
            <a
              href={item.href} // ✅ Added href attribute
              target="_blank" // ✅ Optional: opens in new tab for email clients
              rel="noopener noreferrer"
              key={index}
              className={`flex items-center ${
                index !== contactInfo.length - 1 ? "border-r-2 sm:border-0" : ""
              } md:h-[78px] sm:h-max border-secondary gap-5 md:px-5 sm:w-full tab:w-max ${
                isRTL ? "font-cairo" : "font-inter"
              } `}
            >
              <Image
                width={48}
                height={48}
                src={item.icon}
                alt={item.title}
                className="tab:h-12 tab:w-12 sm:h-8 sm:w-8 object-cover"
              />
              <div dir={isRTL ? "rtl" : "ltr"} className="text-sm">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="leading-normal font-semibold sm:text-sm tab:text-lg">
                  {item.content}
                </p>
              </div>
            </a>
          ))}
        </div>
        <section className="bg-brand px-6 md:px-24 md:h-[650px] sm:h-max sm:py-16 sm:mt-10 md:mt-0 md:py-0 flex justify-center items-center  mb-10 mx-auto rounded-4xl text-white ">
          <div className="grid grid-cols-1 md:w-[90%] sm:w-full mx-auto gap-16 md:grid-cols-2">
            {/* Form */}
            <form
              dir={isRTL ? "rtl" : "ltr"}
              ref={form}
              onSubmit={sendEmail}
              className={`space-y-5 ${isRTL ? "font-cairo" : "font-inter"}`}
            >
              {statusMessage && (
                <div
                  className={`text-sm font-medium px-4 py-2 rounded-md ${
                    statusMessage.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}
              {/* Your inputs stay unchanged, but add `name` attributes */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="mb-2 text-xs font-medium text-white"
                  >
                    Name*
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="from_name"
                    placeholder="Name"
                    required
                    className="rounded-md bg-background text-xs h-12 p-3 text-black outline-none placeholder:text-gray-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="mb-2 text-xs font-medium text-white"
                  >
                    Email*
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="from_email"
                    placeholder="Email"
                    required
                    className="rounded-md bg-background text-xs h-12 p-3 text-black outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Phone & School */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col">
                  <label
                    htmlFor="phone"
                    className="mb-2 text-xs font-medium text-white"
                  >
                    Phone*
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="from_phone"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="(123) 456 - 7890"
                    required
                    className="rounded-md bg-background text-xs h-12 p-3 text-black outline-none placeholder:text-gray-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="school"
                    className="mb-2 text-xs font-medium text-white"
                  >
                    School
                  </label>
                  <input
                    id="school"
                    type="text"
                    name="from_school"
                    placeholder="School"
                    className="rounded-md bg-background text-xs h-12 p-3 text-black outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col">
                <label
                  htmlFor="message"
                  className="mb-2 text-xs font-medium text-white"
                >
                  Message*
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Type your message here..."
                  className="w-full resize-none rounded-md bg-background text-xs p-3 text-black outline-none placeholder:text-gray-500"
                ></textarea>
              </div>

              {/* Submit Button */}

              <button
                type="submit"
                className="bg-secondary cursor-pointer text-white px-5 py-3 flex justify-center items-center gap-1.5 rounded-lg font-normal transition-transform duration-200 ease-in-out hover:scale-105"
              >
                {loading ? (
                  <BtnLoader color="#0000000" />
                ) : (
                  <>
                    {t("CTA_Button")}
                    <ArrowRight size={20} className="text-white" />
                  </>
                )}
              </button>
            </form>

            {/* Info */}
            <div className="flex flex-col justify-start">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">
                  Want to reach out directly?
                </h2>
                <p className="text-white">
                  Whether you're a teacher, student, school, or partner, we're
                  here to support you every step of the way.
                </p>
              </div>

              <div className="mt-6 border-t-2 pt-5 border-white">
                <h3 className="mb-3 font-medium text-lg text-white">
                  Follow us on social media
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      className="w-8 h-8 bg-third rounded-md flex items-center justify-center transition-colors"
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;

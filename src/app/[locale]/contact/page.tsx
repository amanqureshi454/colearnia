/* eslint-disable react/no-unescaped-entities */
"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
gsap.registerPlugin(SplitText);
import { Toaster, toast } from "react-hot-toast";

import emailjs from "@emailjs/browser";
import BtnLoader from "@/components/ui/btn-loader";
import HeroHeadingTitle from "@/components/shared/HeroHeadingTitle";
import SectionWrapper from "@/components/shared/SectionWrapper";
import HeroParagraph from "@/components/shared/HeroParagraph";
import { useStepsData } from "@/data/feature";

const Page = () => {
  const { contactInput } = useStepsData();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const heroParaRef = useRef<HTMLParagraphElement>(null);
  const heroImageWrapperRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const t = useTranslations("Contact");
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

  useEffect(() => {
    let ctx: gsap.Context;

    const init = () => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // === HERO HEADING ===
        if (heroHeadingRef.current) {
          heroHeadingRef.current?.removeAttribute("aria-label");
          const split = new SplitText(heroHeadingRef.current, {
            type: "lines, words",
            linesClass: "line",
          });
          tl.from(split.words, {
            duration: 0.8,
            opacity: 0,
            yPercent: 120,
            ease: "power1.out",
            stagger: 0.035,
          });
        }

        // === HERO PARAGRAPH ===
        if (heroParaRef.current) {
          const split = new SplitText(heroParaRef.current, {
            type: "lines, words",
            linesClass: "line",
          });
          tl.from(
            split.words,
            {
              duration: 0.7,
              opacity: 0,
              yPercent: 120,
              ease: "power1.out",
              stagger: 0.018,
            },
            "-=0.5"
          );
        }

        // === HERO IMAGE ===
        const img = heroImageRef.current || heroImageWrapperRef.current;
        if (img) {
          tl.from(
            img,
            {
              opacity: 0,
              scale: 1.05,
              duration: 1.2,
              ease: "power2.out",
            },
            "-=0.8"
          );
        }

        // === BACKGROUND WRAPPER ===
        if (heroImageWrapperRef.current) {
          tl.from(
            heroImageWrapperRef.current,
            {
              opacity: 0,
              scale: 1.05,
              duration: 1.2,
              ease: "power2.out",
            },
            "-=1.2"
          );
        }
      });
    };

    const raf = requestAnimationFrame(init);
    return () => {
      cancelAnimationFrame(raf);
      ctx?.revert();
    };
  }, []);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#contact",
          start: "top 70%",
        },
      });

      tl.from("#contact", {
        opacity: 0,
        duration: 0.8,
        ease: "power1.out",
      });
    });

    return () => ctx.revert();
  }, []);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.current) {
      setLoading(false);
      return;
    }

    // Verify environment variables
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("Missing EmailJS configuration");
      toast.error("❌ Email service is not configured properly");
      setLoading(false);
      return;
    }

    try {
      const result = await emailjs.sendForm(
        serviceId,
        templateId,
        form.current,
        publicKey
      );

      console.log("✅ EmailJS Success:", result.text);
      toast.success(t("toast.success"));
      form.current.reset();
    } catch (error: unknown) {
      console.error("❌ EmailJS Error:", error);
      toast.error(t("toast.error") as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full font-inter h-full bg-white sm:pt-20 tab:pt-0 relative overflow-x-hidden`}
    >
      <Toaster position="top-center" />
      <div className="absolute bg-[#FFD6D6] blur-[400px] rounded-full w-[600px] h-[600px] -top-20 right-0" />

      {/* ==================== HERO ==================== */}
      <SectionWrapper>
        <div className="flex tab:flex-row w-full sm:flex-col min-h-[70vh] tab:pt-10 justify-between items-center lg:gap-6 sm:gap-5">
          <div className="flex gap-2 tab:w-7/12 sm:w-full flex-col">
            <div className="flex gap-4 relative w-full z-20 flex-col">
              <HeroHeadingTitle
                headingRef={heroHeadingRef}
                isRTL={isRTL}
                t={t}
              />
              <HeroParagraph paraRef={heroParaRef} isRTL={isRTL} t={t} />
            </div>
          </div>

          {/* Hero Image */}
          <div
            ref={heroImageWrapperRef}
            className="rounded-2xl tab:w-6/12 sm:w-full sm:h-[300px] tab:h-full relative z-30 aspect-square h-full"
          >
            <Image
              ref={heroImageRef}
              src="/images/png/image 324.png"
              width={600}
              height={600}
              className="w-full h-full object-contain"
              alt="How it works"
              priority
            />
          </div>
        </div>
      </SectionWrapper>

      <div id="contact" className="tab:w-[90%] sm:w-full sm:px-3 mx-auto">
        <div
          id="contact-section"
          className="w-full text-brand md:py-6 flex flex-col tab:flex-wrap tab:flex-row justify-center items-center sm:gap-5 md:gap-0"
        >
          {contactInfo.map((item, index) => (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className={`flex items-center md:h-[78px] sm:h-max gap-5 md:px-5 sm:w-full tab:w-max`}
            >
              <Image
                width={48}
                height={48}
                src={item.icon}
                alt={item.title}
                className="tab:h-12 tab:w-12 sm:h-8 sm:w-8 object-cover"
              />
              <div dir={isRTL ? "rtl" : "ltr"} className="text-sm">
                <p className="font-medium text-sm text-black">{item.title}</p>
                <p className="leading-normal text-black font-semibold sm:text-sm tab:text-lg">
                  {item.content}
                </p>
              </div>
            </a>
          ))}
        </div>

        <section className="bg-brand px-6 md:px-24 md:h-[650px] sm:h-max sm:py-16 sm:mt-10 md:mt-0 md:py-0 flex justify-center items-center mb-10 mx-auto rounded-4xl text-white">
          <div className="grid grid-cols-1 md:w-[90%] sm:w-full mx-auto gap-16 md:grid-cols-2">
            {/* Form */}
            <form
              dir={isRTL ? "rtl" : "ltr"}
              ref={form}
              onSubmit={sendEmail}
              className="space-y-5"
            >
              {/* === INPUT FIELDS ARRAY === */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {contactInput.map((field, rowIndex) => (
                  <div key={rowIndex} className="flex flex-col">
                    <label
                      htmlFor={field.id}
                      className="mb-2 text-xs font-medium text-white"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="rounded-md bg-background text-xs h-12 p-3 text-white outline-none placeholder:text-gray-500"
                    />
                  </div>
                ))}
              </div>

              {/* === MESSAGE FIELD === */}
              <div className="flex flex-col">
                <label
                  htmlFor="message"
                  className="mb-2 text-xs font-medium text-white"
                >
                  {t("messageLabel")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder={t("messagePlaceholder")}
                  className="w-full resize-none rounded-md bg-background text-xs p-3 text-white outline-none placeholder:text-gray-500"
                />
              </div>

              {/* === SUBMIT BUTTON === */}
              <button
                type="submit"
                disabled={loading}
                className="bg-secondary cursor-pointer text-white px-5 py-3 flex justify-center items-center gap-1.5 rounded-lg font-normal transition-transform duration-200 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <BtnLoader color="#000000" />
                ) : (
                  <>
                    {t("ctaButton")}
                    <ArrowRight size={20} className="text-white" />
                  </>
                )}
              </button>
            </form>

            {/* Info */}
            <div className="flex flex-col justify-start">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">
                  {t("title")}
                </h2>
                <p className="text-white">{t("description")}</p>
              </div>

              <div className="mt-6 border-t-2 pt-5 border-white">
                <h3 className="mb-3 font-medium text-lg text-white">
                  {t("socialTitle")}
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

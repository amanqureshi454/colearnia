"use client";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { X, Check } from "lucide-react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import CTAReuse from "@/components/shared/CTAReuse";

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  const comparisonRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("CTA");
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;

  const studyCards = [
    {
      id: 1,
      title: t("titleCard1"),
      icon: X,
      iconColor: "#FF6B46",
      iconPosition: "right-4 top-4",
      bg: "bg-white",
      border: "shadow-[-5px_-2px_4.8px_0px_#FF6B4624]",
      listColor: "bg-[#FF6B46]",
      image: "/images/svg/wrong-cta.svg",
      imageAlt: "withoutcircle",
      imageSize: "w-6/12 h-[200px]",
      features: [t("features1.0"), t("features1.1"), t("features1.2")],
    },
    {
      id: 2,
      title: t("titleCard2"),
      icon: Check,
      iconColor: "#6DD130",
      iconPosition: "right-4 top-4",
      bg: "bg-white",
      border: "shadow-[7px_-6px_4px_0px_#6DD1301F]",
      listColor: "bg-[#6DD130]",
      image: "/images/svg/check-cta.svg",
      imageAlt: "withcircle",
      imageSize: "w-6/12 h-[200px]",
      features: [t("features2.0"), t("features2.1"), t("features2.2")],
    },
  ];

  // Card Animation
  useEffect(() => {
    const container = comparisonRef.current;
    if (!container) return;

    document.fonts.ready.then(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 70%",
        },
      });

      const cards = container.querySelectorAll(".with-card");
      if (cards && cards.length > 0) {
        tl.from(
          cards,
          {
            opacity: 0,
            y: 100,
            duration: 1,
            ease: "power1.out",
            stagger: 0.18,
          },
          0
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // useSplitTextAnimation({
  //   headingRef,
  //   triggerId: "cta",
  // });

  return (
    <SectionWrapper>
      <CTAReuse
        backgroundImage="bg-[url('/images/png/CTA-1.png')]"
        title={t("Title")}
        primaryText={t("CTA")}
        secondaryText={t("CTA2")}
      />

      {/* Comparison Section */}
      <div
        ref={comparisonRef}
        className="w-full flex flex-col tab:flex-row gap-6 mt-20 justify-center"
      >
        {studyCards.map((card) => (
          <div
            key={card.id}
            className="shadow[0px_3.31px_15.21px_0px_#0000001C] with-card rounded-xl shadow-lg"
          >
            <div
              dir={isRTL ? "rtl" : "ltr"}
              className={`tab:w-[400px] sm:w-full relative justify-start gap-5 rounded-xl p-5 flex flex-col items-start ${card.bg} ${card.border}`}
            >
              {/* Title */}
              <p className="w-7/12 text-4xl font-inter font-bold text-[#333333]">
                {card.title}
              </p>

              {/* Absolute Icon */}
              <div
                className={`w-14 h-14 absolute ${
                  isRTL ? "left-5" : "right-5"
                } opacity-60 top-5 flex items-center justify-center rounded-full ${
                  card.listColor
                }`}
              >
                <card.icon
                  size={24}
                  className=""
                  color="#fff"
                  strokeWidth={3}
                />
              </div>

              {/* List */}
              <ul className="space-y-4 w-full mt-5">
                {card.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full ${card.listColor}`}
                    >
                      <card.icon
                        size={12}
                        className=""
                        color="#fff"
                        strokeWidth={3}
                      />
                    </div>
                    <span className="font-inter text-lg text-black font-medium">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Bottom Image */}
              <div
                className={`w-full flex ${
                  isRTL ? "justify-start" : "justify-end"
                } items-end`}
              >
                <Image
                  src={card.image}
                  width={240}
                  height={200}
                  alt={card.imageAlt}
                  className={`${card.imageSize} object-cover`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default CTA;

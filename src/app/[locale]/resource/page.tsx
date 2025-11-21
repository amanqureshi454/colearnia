"use client";

import HeroHeadingTitle from "@/components/shared/HeroHeadingTitle";
import HeroParagraph from "@/components/shared/HeroParagraph";
import SectionWrapper from "@/components/shared/SectionWrapper";
import FAQ from "@/sections/FAQ";
import Pricing from "@/sections/Pricing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import ResourceModal from "@/components/ui/resource-modal";

type Resource = {
  id: number;
  title: string;
  category1: string;
  category2: string;
  image: string;
  description: string;
};

gsap.registerPlugin(SplitText);
const resources: Resource[] = [
  {
    id: 1,
    title: "Name of the resource",
    category1: "College",
    category2: "Data Science",
    image: "/images/book-sample.jpg",
    description:
      "Each circle has weekly goals, missions, and a shared progress view so everyone stays on track.",
  },
  {
    id: 2,
    title: "Python Course",
    category1: "College",
    category2: "Data Science",
    image: "/images/book-sample.jpg",
    description:
      "Each circle has weekly goals, missions, and a shared progress view so everyone stays on track.",
  },
];
const Page = () => {
  const pathname = usePathname();
  const t = useTranslations("resource");
  const isRTL = pathname?.startsWith("/ar") ?? false;

  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const heroParaRef = useRef<HTMLParagraphElement>(null);
  const heroImageWrapperRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources.filter(
    (res) =>
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category2.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );

  // === Hero Animation ===
  useEffect(() => {
    let ctx: gsap.Context;

    const init = () => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline();

        if (heroHeadingRef.current) {
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

        if (heroImageRef.current || heroImageWrapperRef.current) {
          tl.from(
            heroImageRef.current || heroImageWrapperRef.current,
            {
              opacity: 0,
              scale: 1.05,
              duration: 1.2,
              ease: "power2.out",
            },
            "-=0.8"
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

  return (
    <>
      {/* ==================== HERO SECTION ==================== */}
      <div className="w-full font-inter h-full bg-white sm:pt-20 relative overflow-x-hidden">
        <div className="absolute bg-[#FFD6D6] blur-[400px] rounded-full w-[600px] h-[600px] -top-20 right-0" />

        <div className="relative z-20 max-w-7xl mx-auto sm:w-full  sm:max-w-[95%] overflow-hidden md:max-w-[90%] lg:max-w-[85%]">
          <div className="flex tab:flex-row w-full sm:flex-col  justify-between items-center lg:gap-6 sm:gap-5">
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
              className="tab:w-6/12 rounded-4xl sm:w-full sm:h-[300px] tab:h-full relative z-30 aspect-square"
            >
              <div className="bg-[#FF9E0C] absolute top-20 rounded-t-4xl w-full h-[500px]"></div>
              <Image
                ref={heroImageRef}
                src="/images/png/image 323.png"
                width={600}
                height={500}
                className="w-full h-full relative z-50 object-contain"
                alt="How it works"
                priority
              />
            </div>
          </div>
        </div>
        {/* ORANGE DIVIDER */}
        <div className="bg-[#FF9E0C] h-20 w-full -mt-2"></div>

        {/* ==================== FREE RESOURCES SECTION ==================== */}

        {/* 🔍 Search Bar */}
        <div className="flex justify-center bg-[#ECECEC] w-full max-w-xl relative mx-auto -mt-8 rounded-full p-5">
          <Image
            src="/images/svg/search-normal.svg"
            className="w-6 h-6 object-cover left-10 absolute top-1/2 transform -translate-y-1/2"
            alt="search"
            width={20}
            height={20}
          />
          <input
            type="text"
            placeholder="Search for resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" w-full bg-white px-14 py-5 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand transition text-sm sm:text-base"
          />
        </div>
        <SectionWrapper>
          <div className="w-full max-w-5xl mx-auto min-h-screen ">
            {/* Header */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-heading mb-4">
                Explore free study resources designed to help you succeed:
              </h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-1 tab:grid-cols-2 gap-8">
              {filteredResources.length > 0 ? (
                filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition"
                  >
                    <div className="flex justify-center items-center h-[280px] bg-white">
                      <Image
                        src={res.image}
                        alt={res.title}
                        width={300}
                        height={280}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="p-5 flex flex-col gap-4">
                      <div className="bg-[#F0F5F9] rounded-lg p-4 min-h-[140px]">
                        <h3 className="text-lg font-bold font-inter text-brand">
                          {res.title}
                        </h3>
                        <p className="text-sm text-[#6A6868] font-inter font-normal mt-2">
                          {res.description}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedResource(res);
                          setIsOpen(true);
                        }}
                        className="bg-[#76A136] font-inter transition text-white text-lg font-medium rounded-full py-3.5 px-3 cursor-pointer mt-2"
                      >
                        Get it now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-semibold text-gray-600">
                    No matching resources found.
                  </h3>
                </div>
              )}
            </div>
          </div>

          {/* Popup (Modal) */}
          {isOpen && (
            <ResourceModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              selectedResource={selectedResource}
            />
          )}
        </SectionWrapper>
      </div>

      {/* Pricing & FAQ Sections */}
      <Pricing />
      <FAQ />
    </>
  );
};

export default Page;

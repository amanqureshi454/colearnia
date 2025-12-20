"use client";

import { useSplitTextAnimation } from "@/lib/useSectionReveal";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import SectionHeader from "@/components/shared/HeadingWrapper";
import SectionWrapper from "@/components/shared/SectionWrapper";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const t = useTranslations("Testimonial");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useSplitTextAnimation({
    headingRef,
    triggerId: "testimonials",
  });
  // DATA — Edit this array only
  const testimonials = [
    {
      id: 1,
      quote:
        "I am very helped by this E-wallet application, my days are very easy to use this application and its very helpful in my life, even I can pay a short time",
      author: "Aria Zinanrio",
      role: "Student, Grade 11, Doha",
      avatar: "/images/svg/test-.svg",
    },
    {
      id: 2,
      quote:
        "I am very helped by this E-wallet application, my days are very easy to use this application and its very helpful in my life, even I can pay a short time",
      author: "Aria Zinanrio",
      role: "Student, Grade 11, Doha",
      avatar: "/images/svg/test-.svg",
    },
    {
      id: 3,
      quote:
        "I am very helped by this E-wallet application, my days are very easy to use this application and its very helpful in my life, even I can pay a short time",
      author: "Aria Zinanrio",
      role: "Student, Grade 11, Doha",
      avatar: "/images/svg/test-.svg",
    },
    {
      id: 4,
      quote:
        "I am very helped by this E-wallet application, my days are very easy to use this application and its very helpful in my life, even I can pay a short time",
      author: "Aria Zinanrio",
      role: "Student, Grade 11, Doha",
      avatar: "/images/svg/test-.svg",
    },
    {
      id: 5,
      quote:
        "I am very helped by this E-wallet application, my days are very easy to use this application and its very helpful in my life, even I can pay a short time",
      author: "Aria Zinanrio",
      role: "Student, Grade 11, Doha",
      avatar: "/images/svg/test-.svg",
    },
  ];

  return (
    <SectionWrapper>
      <div id="testimonials" ref={containerRef}>
        {/* Header */}
        <div className="text-center mb-12">
          <SectionHeader heading={t("Title")} />
        </div>

        {/* Swiper Slider */}
        <div className="max-w-7xl w-full mx-auto">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              type: "bullets",
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
              renderBullet: (className) => `<span class="${className}"></span>`,
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial, i) => (
              <SwiperSlide key={i}>
                <div className="bg-white p-6 gap-4 rounded-2xl border border-[#EAEAEA] shadow-[0px_0px_4.14px_0px_#0000000A] h-full flex flex-col">
                  {/* Quote Icon */}
                  <div className="flex justify-between w-full items-center">
                    <Image
                      src="/images/svg/qoute.svg"
                      alt="qoute icon"
                      className="w-10 h-10 object-contain"
                      width={40}
                      height={40}
                    />
                    <Image
                      src="/images/svg/star.svg"
                      alt="rating stars"
                      className="w-20 h-6 object-contain"
                      width={80}
                      height={16}
                    />
                  </div>
                  {/* Quote */}
                  <p className="text-[#2D2D2D] text-sm md:text-base leading-relaxed flex-1">
                    {testimonial.quote}
                  </p>
                  {/* Author */}
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm font-inter text-[#193c51]">
                        {testimonial.author}
                      </p>
                      <p className="text-xs text-paragraph font-normal font-inter">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination */}
          <div className="flex justify-center mt-6">
            <div className="swiper-pagination swiper-pagination-custom flex gap-1 items-center !static !w-auto !mt-0" />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Testimonials;

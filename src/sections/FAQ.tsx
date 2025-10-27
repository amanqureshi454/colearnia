"use client";

import SectionHeader from "@/components/shared/HeadingWrapper";

import SectionWrapper from "@/components/shared/SectionWrapper";
import FAQSection from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import React from "react";

const FAQ = () => {
  const t = useTranslations("FAQ");
  const faqData = [
    {
      question: t("question.0.question"),
      answer: t("question.0.answer"),
    },
    {
      question: t("question.1.question"),
      answer: t("question.1.answer"),
    },
    {
      question: t("question.2.question"),
      answer: t("question.2.answer"),
    },
  ];
  return (
    <SectionWrapper>
      <SectionHeader heading={t("Title")} />
      <FAQSection faqData={faqData} />
    </SectionWrapper>
  );
};

export default FAQ;

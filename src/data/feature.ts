"use client";

import { useTranslations } from "next-intl";

// Create a custom hook to get the steps data
export const useStepsData = () => {
  const t = useTranslations("how-it-work");

  const stepStudent = [
    {
      id: 1,
      number: "1",
      title: t("stepStudent.1.title"),
      src: "/images/svg/share.svg",
      description: t("stepStudent.1.description"),
    },
    {
      id: 2,
      number: "2",
      title: t("stepStudent.2.title"),
      src: "/images/svg/gps.svg",
      description: t("stepStudent.2.description"),
    },
    {
      id: 3,
      number: "3",
      title: t("stepStudent.3.title"),
      src: "/images/svg/chart.svg",
      description: t("stepStudent.3.description"),
    },
  ];

  const stepTeacher = [
    {
      id: 1,
      number: "1",
      title: t("stepTeacher.1.title"),
      src: "/images/svg/people.svg",
      description: t("stepTeacher.1.description"),
    },
    {
      id: 2,
      number: "2",
      title: t("stepTeacher.1.title"),
      src: "/images/svg/share.svg",
      description: t("stepTeacher.1.description"),
    },
    {
      id: 3,
      number: "3",
      title: t("stepTeacher.2.title"),
      src: "/images/svg/gps.svg",
      description: t("stepTeacher.2.description"),
    },
    {
      id: 4,
      number: "4",
      title: t("stepTeacher.3.title"),
      src: "/images/svg/chart.svg",
      description: t("stepTeacher.3.description"),
    },
  ];

  return { stepStudent, stepTeacher };
};

export const infoData = [
  {
    id: 1,
    title: "Our Mission",
    description:
      "Empower every learner to achieve more through collaboration, accountability, and joyful practice.",
    bgColor: "bg-[#F9F0FF]",
    iconSrc: "/images/svg/cap.svg", // use your own image path
  },
  {
    id: 2,
    title: "Our Vision",
    description:
      "A world where studying feels social, meaningful, and measurable — for every student, everywhere.",
    bgColor: "bg-[#F0F5FF]",
    iconSrc: "/images/svg/eye.svg",
  },
  {
    id: 3,
    title: "What We Value",
    description:
      "Students first • Motivation by design • Trust & privacy • Evidence-based",
    bgColor: "bg-[#E6FFDD]",
    iconSrc: "/images/svg/shield-tick.svg",
  },
];
export const weValue = [
  {
    id: 1,
    title: "Students first",
    description: "Every decision starts with learner outcomes.",
    iconSrc: "/images/svg/frame.svg", // use your own image path
  },
  {
    id: 2,
    title: "Trust & privacy",
    description: "We protect learner data and promote safe collaboration.",
    iconSrc: "/images/svg/security-safe.svg",
  },
  {
    id: 3,
    title: "Motivation by design",
    description: "Small wins, clear goals, visible progress.",
    iconSrc: "/images/svg/brush.svg",
  },
  {
    id: 4,
    title: "Evidence-based",
    description:
      "We use proven learning science and iterate with real classrooms.",
    iconSrc: "/images/svg/briefcase.svg",
  },
];
export const teamMembers = [
  {
    id: 1,
    name: "Houssem G.",
    role: "Founder",
    src: "",
    description:
      "EdTech builder & project lead. Passionate about collaborative learning",
    bg: "bg-[#108EDA]",
    social: { facebook: "#", instagram: "#", twitter: "#", linkedin: "#" },
  },
  {
    id: 2,
    name: "Layla A.",
    role: "Advisor",
    src: "",
    description: "Teacher & curriculum mentor. Focus on motivation & mastery.",
    bg: "bg-[#247476]",
    social: { facebook: "#", instagram: "#", twitter: "#", linkedin: "#" },
  },
  {
    id: 3,
    name: "Omar D.",
    role: "Advisor",
    src: "",
    description: "Full-stack engineer; Data & analytics for learning impact",
    bg: "bg-[#FC7A1A]",
    social: { facebook: "#", instagram: "#", twitter: "#", linkedin: "#" },
  },
  {
    id: 4,
    name: "Esther Howard",
    role: "Front-end Developer",
    src: "",
    description:
      "EdTech builder & project lead. Passionate about collaborative learning",
    bg: "bg-[#76A136]",
    social: { facebook: "#", instagram: "#", twitter: "#", linkedin: "#" },
  },
];
export const milestones = [
  {
    id: 1,
    title: "Milestone 1",
    description: "Prototype validated with pilot classrooms",
  },
  {
    id: 2,
    title: "Milestone 2",
    description: "Gamified missions & progress dashboard",
  },
  {
    id: 3,
    title: "Milestone 3",
    description: "Teacher tools for classes, circles & analytics",
  },
  {
    id: 4,
    title: "Milestone 4",
    description: "Bilingual (EN/AR) with RTL support",
  },
];

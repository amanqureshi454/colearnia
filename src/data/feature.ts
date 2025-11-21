"use client";

import { useTranslations } from "next-intl";

// Create a custom hook to get the steps data
export const useStepsData = () => {
  const t = useTranslations("how-it-work");
  const t2 = useTranslations("about.AboutPage.InfoCards");
  const t3 = useTranslations("about.AboutPage.Values.items");
  const t4 = useTranslations("about.AboutPage.Milestones.items");
  const t5 = useTranslations("Contact");

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
  const infoData = [
    {
      id: 1,
      title: t2("0.title"),
      description: t2("0.description"),
      bgColor: "bg-[#F9F0FF]",
      iconSrc: "/images/svg/cap.svg",
    },
    {
      id: 2,
      title: t2("1.title"),
      description: t2("1.description"),
      bgColor: "bg-[#F0F5FF]",
      iconSrc: "/images/svg/eye.svg",
    },
    {
      id: 3,
      title: t2("2.title"),
      description: t2("2.description"),
      bgColor: "bg-[#E6FFDD]",
      iconSrc: "/images/svg/shield-tick.svg",
    },
  ];
  const weValue = [
    {
      id: 1,
      title: t3("0.title"),
      description: t3("0.description"),
      iconSrc: "/images/svg/frame.svg", // use your own image path
    },
    {
      id: 2,
      title: t3("1.title"),
      description: t3("1.description"),
      iconSrc: "/images/svg/security-safe.svg",
    },
    {
      id: 3,
      title: t3("2.title"),
      description: t3("2.description"),
      iconSrc: "/images/svg/brush.svg",
    },
    {
      id: 4,
      title: t3("3.title"),
      description: t3("3.description"),
      iconSrc: "/images/svg/briefcase.svg",
    },
  ];
  const milestones = [
    {
      id: 1,
      title: t4("0.title"),
      description: t4("0.description"),
    },
    {
      id: 2,
      title: t4("1.title"),
      description: t4("1.description"),
    },
    {
      id: 3,
      title: t4("2.title"),
      description: t4("2.description"),
    },
    {
      id: 4,
      title: t4("3.title"),
      description: t4("3.description"),
    },
  ];
  const contactInput = [
    {
      id: "name",
      label: t5("fields.0.label"),
      name: "from_name",
      type: "text",
      placeholder: t5("fields.0.placeholder"),
      required: true,
    },
    {
      id: "email",
      label: t5("fields.1.label"),
      name: "from_email",
      type: "email",
      placeholder: t5("fields.1.placeholder"),
      required: true,
    },
    {
      id: "phone",
      label: t5("fields.2.label"),
      name: "from_phone",
      type: "tel",
      placeholder: t5("fields.2.placeholder"),
      inputMode: "numeric",
      required: true,
    },
    {
      id: "school",
      label: t5("fields.3.label"),
      name: "from_school",
      type: "text",
      placeholder: t5("fields.3.placeholder"),
      required: false,
    },
  ];
  return {
    stepStudent,
    stepTeacher,
    infoData,
    weValue,
    milestones,
    contactInput,
  };
};

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

"use client";

import { usePathname } from "next/navigation";

interface LayoutVisibilityWrapperProps {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}

export default function LayoutVisibilityWrapper({
  children,
  navbar,
  footer,
}: LayoutVisibilityWrapperProps) {
  const pathname = usePathname();

  // Supports paths like /en/signin, /ar/signup, etc.
  const lastSegment = pathname.split("/").pop();
  const hideLayout = lastSegment === "signin" || lastSegment === "signup";

  return (
    <>
      {!hideLayout && navbar}
      {children}
      {!hideLayout && footer}
    </>
  );
}

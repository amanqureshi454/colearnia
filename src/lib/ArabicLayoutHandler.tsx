"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ArabicLayoutHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const isArabic = pathname?.startsWith("/ar");
    document.body.classList.toggle("arabic", isArabic);
    document.documentElement.lang = isArabic ? "ar" : "en";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [pathname]);

  return null; // it doesn’t render anything
}

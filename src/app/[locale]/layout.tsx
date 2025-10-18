import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { NextIntlClientProvider } from "next-intl";
import LayoutVisibilityWrapper from "@/components/shared/LayoutVisibilityWrapper";

import en from "../../../locale/en.json";
import ar from "../../../locale/ar.json";

type Locale = "en" | "ar";

type LayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

type Messages = typeof ar; // 👈 reuse one translation file's structure

const messagesMap: Record<"en" | "ar", Messages> = {
  en,
  ar,
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  console.log("🧾 Received locale:", locale); // Debug
  const messages = messagesMap[locale as Locale];

  if (!messages) {
    throw new Error(`❌ Invalid locale: "${locale}". Must be "en" or "ar".`);
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LayoutVisibilityWrapper navbar={<Navbar />} footer={<Footer />}>
        {children}
      </LayoutVisibilityWrapper>
    </NextIntlClientProvider>
  );
}

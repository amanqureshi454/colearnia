// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/lib/useLenisScroll";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Home | Study Circle",
  description:
    "We’re a team of educators, designers, and tech lovers building a better classroom—one circle at a time. Study Circle helps teachers manage classes, organize quizzes aligned to Qatar’s curriculum, and run engaging team-based learning sessions with real-time feedback and analytics.",
  keywords:
    "EdTech, online learning, study groups, classroom management, quizzes, Qatar curriculum, real-time feedback, student analytics, team-based learning",
  openGraph: {
    title: "Home | Study Circle",
    description:
      "Choose quizzes tailored to Qatar’s curriculum, join study groups, and engage in educational competitions together. Teachers manage classes and quizzes, students collaborate, track progress, and earn badges—all in one seamless platform.",
    type: "website",
    url: "https://colearnia.com/",
  },
  icons: {
    icon: "/fav.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-HRM622CRE6"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HRM622CRE6', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

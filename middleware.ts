import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "ar",
  localeDetection: true, // optional, helps redirect based on Accept-Language
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

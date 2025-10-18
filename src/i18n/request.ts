import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  // fallback to "en" if locale is undefined
  const safeLocale = locale ?? "en";

  const messages = {
    en: () => import("../../locale/en.json"),
    ar: () => import("../../locale/ar.json"),
  };

  return {
    locale: safeLocale,
    messages: (await messages[safeLocale as "en" | "ar"]()).default,
  };
});

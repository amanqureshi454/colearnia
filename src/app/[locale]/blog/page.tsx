"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import BlogCard from "@/components/shared/BlogCard";
import { useHeroReveal } from "@/lib/useHeroReveal";
import { useSectionReveal } from "@/lib/useBlogCard";
interface Article {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
}

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const headingRef = useRef(null);
  const headingRef2 = useRef(null);
  const paraRef = useRef(null);

  const t = useTranslations("");
  const t2 = useTranslations("Blog");
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;

  // ✅ Fetch articles from translations
  const allArticles = useMemo(() => {
    return t.raw("Articles") || [];
  }, [t]);

  // Animate hero only once
  useHeroReveal({
    headingRef,
    paraRef,
    buttonSelector: ".hero-button",
    bgSelector: ".hero-bg-wrapper",
  });

  // Animate blog section only once
  useSectionReveal({
    trigger: "#blog-section",
    headingRef: headingRef2,
    itemSelector: ".blog-card",
  });

  // Memoized categories
  // Unique categories
  const uniqueCategories = useMemo(() => {
    if (!allArticles || allArticles.length === 0) return ["All"];
    const categories = Array.from(
      new Set((allArticles as Article[]).map((a) => a.category))
    );
    return ["All", ...categories];
  }, [allArticles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    if (!allArticles || allArticles.length === 0) return [];
    return selectedCategory === "All"
      ? (allArticles as Article[])
      : (allArticles as Article[]).filter(
          (a) => a.category.toLowerCase() === selectedCategory.toLowerCase()
        );
  }, [selectedCategory, allArticles]);

  // Get featured article (first article)
  const featuredArticle =
    allArticles && allArticles.length > 0 ? allArticles[0] : null;

  return (
    <div
      className={`w-full ${
        isRTL ? "font-cairo" : "font-melodyB"
      } h-full pb-14 bg-background relative sm:pt-[150px] md:pt-[160px]`}
    >
      {/* Header */}
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="relative tab:w-8/12 z-20 gap-4 sm:px-4 mx-auto flex flex-col justify-center items-center"
      >
        <h1
          ref={headingRef}
          className="md:text-6xl sm:text-5xl font-bold leading-normal text-brand text-center"
        >
          {t2("Title")}
        </h1>
        <p
          ref={paraRef}
          className="md:text-xl sm:text-lg opacity-80 text-center"
        >
          {t2("Subtitle")}
        </p>
      </div>

      {/* Hero card - Featured Article */}
      {featuredArticle && (
        <div className="tab:h-[458px] hero-bg-wrapper sm:h-max max-w-8xl sm:w-full tab:w-11/12 mt-14 mx-auto sm:px-4 tab:px-8 mb-16">
          <div className="bg-white rounded-[30px] flex h-full flex-col tab:flex-row overflow-hidden shadow-md">
            <div className="flex items-center tab:w-1/2 sm:w-full justify-center h-full">
              <Image
                src={featuredArticle.imageUrl}
                alt={featuredArticle.title}
                width={450}
                height={458}
                quality={100}
                className="object-cover tab:h-full sm:h-[340px] w-full"
              />
            </div>
            <div className="bg-brand tab:w-1/2 sm:w-full text-white tab:px-6 sm:px-0 h-full py-8 flex flex-col justify-center gap-6">
              <div
                dir={isRTL ? "rtl" : "ltr"}
                className={`px-8 w-full ${isRTL ? "font-cairo" : "font-inter"}`}
              >
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
                  {featuredArticle.title}
                </h2>
                <p className="text-sm text-white font-normal line-clamp-3">
                  {featuredArticle.description}
                </p>
                <div className="flex border-t border-white pt-7 mt-5 justify-between items-center w-full">
                  <button className="bg-white text-brand text-sm font-semibold px-4 py-1.5 rounded border hover:bg-gray-200 transition">
                    {featuredArticle.category}
                  </button>
                  <div className="text-sm font-normal text-white">
                    {featuredArticle.date}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Listing */}
      <div
        dir={isRTL ? "rtl" : "ltr"}
        id="blog-section"
        className="max-w-8xl sm:w-full tab:w-11/12 mx-auto px-4 sm:px-4 lg:px-8"
      >
        <div className="flex justify-between items-center py-8 flex-wrap gap-4">
          <h1
            dir={isRTL ? "rtl" : "ltr"}
            ref={headingRef2}
            className="md:text-5xl sm:text-4xl font-bold text-brand"
          >
            {t2("blog-title")}
          </h1>
          <div
            className={`flex gap-3 flex-wrap ${
              isRTL ? "font-cairo" : "font-inter"
            }`}
          >
            {uniqueCategories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat as string)}
                className={`px-4 py-1.5 cursor-pointer text-sm rounded-lg ${
                  selectedCategory === cat
                    ? "bg-brand text-white"
                    : "bg-white text-brand"
                } transition`}
              >
                {String(cat)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article: Article) => (
              <BlogCard
                key={article.id}
                title={article.title}
                description={article.description}
                imageUrl={article.imageUrl}
                category={article.category}
                date={article.date}
                className="blog-card"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                {t("no-articles") || "No articles found"}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;

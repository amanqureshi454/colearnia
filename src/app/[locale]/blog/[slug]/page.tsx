import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server"; // ✅ server-safe

interface Article {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
  slug: string;
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // ✅ No namespace here, since Articles is at the root
  const t = await getTranslations({ locale });

  // ✅ Fetch all articles directly
  const allArticles: Article[] = t.raw("Articles") || [];

  // ✅ Find the matching article by slug
  const article = allArticles.find((a) => a.slug === slug);

  // ✅ Handle not found
  if (!article) notFound();

  return (
    <div className="w-full h-full relative">
      {/* Hero Image */}
      <div className="h-[80vh] w-full overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          width={1200}
          height={800}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto py-16 px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-brand mb-6">
          {article.title}
        </h1>
        <p className="text-gray-600 text-sm mb-8">{article.date}</p>
        <p className="text-lg leading-relaxed text-gray-800">
          {article.description}
        </p>
      </div>
    </div>
  );
}

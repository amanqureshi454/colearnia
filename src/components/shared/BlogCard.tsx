// components/shared/BlogCard.tsx
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";

interface BlogCardProps {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
  slug: string;
  className: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  description,
  imageUrl,
  slug,
  category,
  className,
  date,
}) => {
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar") ?? false;
  const locale = useLocale();
  return (
    <div className={`bg-[#F1F3F7] rounded-xl overflow-hidden ${className}`}>
      {/* Image */}
      <div className="flex justify-center items-center h-[280px] bg-white">
        <Image
          src={imageUrl}
          alt="Article image"
          width={300}
          height={280}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="px-6 py-5 flex flex-col justify-between gap-3 h-[260px]">
        <div className={`${isRTL ? "font-cairo" : "font-inter"}`}>
          <h2 className={`text-xl font-extrabold text-brand line-clamp-2 `}>
            {title}
          </h2>
          <p className="mt-2 text-xs font-normal text-brand/80 line-clamp-3">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div
          className={`flex items-center border-t border-gray-300 pt-5 justify-between mt-3   ${
            isRTL ? "font-cairo" : "font-inter"
          }`}
        >
          <Link
            href={`/${locale}/blog/${slug}`}
            className="text-xs font-semibold text-brand px-3 py-1.5 rounded bg-white"
          >
            {category}
          </Link>
          <p className="text-xs opacity-80">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;

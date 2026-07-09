// components/FeaturedArticle.tsx
import Image from "next/image";
import Link from "next/link";

interface FeaturedArticleProps {
  slug: string;
  title: string;
  excerpt?: string;
  imageSrc: string;
}

export default function FeaturedArticle({
  slug,
  title,
  excerpt,
  imageSrc,
}: FeaturedArticleProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group relative block w-full h-full rounded-t-3xl overflow-hidden
                md:rounded-b-3xl"
    >
      <Image
        src={imageSrc}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority
        className="object-cover transition-transform duration-500 group-hover:scale-105
                  mask-[linear-gradient(to_bottom,tgba(0,0,0,1)_0%, rgba(0,0,0,0)_100%)]"
      />

      {/* gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10">
        <span className="text-xs uppercase tracking-wider text-white/70 mb-2">
          Featured
        </span>
        <h3 className="text-white text-xl md:text-3xl font-bold font-serif leading-tight">
          {title}
        </h3>
        {excerpt && (
          <p className="text-white/80 text-md mt-2 line-clamp-2 font-libre">
            {excerpt}
          </p>
        )}
        <span className="inline-flex items-center gap-1 text-white/60 text-sm mt-4 font-libre font-medium">
          Click to read
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
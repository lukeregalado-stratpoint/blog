import Image from "next/image";
import Link from 'next/link';
import { Suspense } from "react";
import { excerpt } from "@/lib/utils";
import { getAllPosts, getCommentCount } from "@/lib/db/queries";

export default async function BlogPage() {
  const allPosts = await getAllPosts();

  return (
    <div className="pt-20 px-8 pb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 bg-cream">
      {allPosts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          className="group relative block h-72 overflow-hidden rounded-2xl transition hover:shadow-md hover:-translate-y-0.5"
        >
          <Image
            src={post.imageSrc ?? "/placeholder.jpg"}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-between p-6">
            <time className="text-xs uppercase tracking-wide text-white/80 
                            rounded-xl bg-clip-padding backdrop-filter 
                            backdrop-blur-sm bg-[#31572c]/10 bg-opacity-10 p-2 w-fit">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            <div>
              <h3 className="text-lg font-semibold font-serif text-white group-hover:underline">
                {post.title}
              </h3>
              <p className="mt-2 text-sm font-libre font-regular text-white/80 line-clamp-2">
                {excerpt(post.body)}
              </p>
              <Suspense fallback={<CommentCountFallback />}>
                <CommentCount postId={post.id} />
              </Suspense>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

async function CommentCount({ postId }: { postId: string }) {
  const count = await getCommentCount(postId);
  return (
    <p className="mt-1 text-xs text-white/70">
      {count} {count === 1 ? "comment" : "comments"}
    </p>
  );
}

function CommentCountFallback() {
  return <p className="mt-1 text-xs text-white/40">· · ·</p>;
}
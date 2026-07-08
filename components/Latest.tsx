import Image from "next/image";
import Link from "next/link";
import { getLatestPosts } from "@/lib/db/queries";

function excerpt(body: string, len = 120) {
  const clean = body.replace(/\s+/g, " ").trim();
  return clean.length > len ? clean.slice(0, len) + "…" : clean;
}

export default async function Latest() {
  const latestPosts = await getLatestPosts(6);

  if (latestPosts.length === 0) {
    return <p className="text-gray-500 mt-4">No posts yet — check back soon.</p>;
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {latestPosts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          className="group block overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="relative h-44 w-full overflow-hidden">
            <Image
              src={post.imageSrc}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="p-6">
            <time className="text-xs uppercase tracking-wide text-gray-400">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            <h3 className="mt-2 text-lg font-semibold text-black group-hover:underline">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{excerpt(post.body)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
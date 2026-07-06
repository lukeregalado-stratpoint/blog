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
          className="group block rounded-2xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
        >
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
        </Link>
      ))}
    </div>
  );
}
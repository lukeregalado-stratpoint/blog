import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import Link from 'next/link';

export default async function BlogPage() {
  const allPosts = await db.select().from(posts);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Blog</h1>
      <div className="flex flex-col gap-4">
        {allPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block p-4 rounded-lg border border-gray-200 active:bg-gray-50"
          >
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {post.createdAt.toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post] = await db.select().from(posts).where(eq(posts.slug, slug));

  if (!post) {
    notFound();
  }

  return (
    <article className="px-4 py-6 max-w-2xl mx-auto md:px-8">
      <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
      <div className="prose prose-sm md:prose-base mt-4">
        {post.body}
      </div>
    </article>
  );
}
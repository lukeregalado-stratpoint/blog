import { eq } from 'drizzle-orm';
import Image from "next/image";
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { getCommentsForPost } from '@/lib/db/queries';
import Comments from '@/components/Comments';

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

  const postComments = await getCommentsForPost(post.id);

  return (
    <article className="px-4 py-6 min-w-full max-w-5xl pt-20 md:px-8 md:grid md:grid-cols-3 md:gap-10">
      <div className="md:col-start-1 md:row-start-1">
        <div
          className="
            relative z-10
            w-full h-[50vh]
            md:h-[28vw] md:min-h-75
            md:rounded-b-3xl
            rounded-t-3xl
            shadow-2xl">
          <Image
            src={post.imageSrc ?? "/placeholder.jpg"}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority
            className="object-cover
                      mask-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_100%)]"
          />
        </div>
        <div className="mt-6">
          <h1 className="text-2xl md:text-3xl font-serif font-bold">{post.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <time>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>Luke Regalado</span>
          </div>
          <div className="hidden md:block mt-10 md:mt-0 min-w-0 wrap-break-word md:col-start-1 md:row-start-2">
            <Comments postId={post.id} comments={postComments} />
          </div>
        </div>
      </div>

      <div className="whitespace-pre-line prose prose-lg text-xl col-span-2 
                      min-w-auto md:prose-base font-libre mt-4 md:mt-0
                      md:mr-5 md:col-start-2 md:row-start-1">
        {post.body}
      </div>

      <div className="mt-10 md:hidden min-w-0 wrap-break-word">
        <Comments postId={post.id} comments={postComments} />
      </div>
    </article>
  );
}
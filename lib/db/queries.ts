import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { posts } from "@/lib/db/schema";


export async function getLatestPosts(limit = 6) {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      body: posts.body,
      createdAt: posts.createdAt,
      imageSrc: posts.imageSrc,
    })
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(limit);
}

export async function getFeaturedPost() {
  const [latest] = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      body: posts.body,
      createdAt: posts.createdAt,
      imageSrc: posts.imageSrc
    })
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(1);

  return latest ?? null;
}

export async function createPost({ title, slug, body, imageSrc }: {
  title: string; slug: string; body: string; imageSrc?: string;
}) {
  return db.insert(posts).values({ title, slug, body, imageSrc }).returning();
}

// COMMENTS

export async function getCommentsForPost(postId: string) {
  return db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt));
}

export async function createComment({
  postId,
  authorName,
  body,
}: {
  postId: string;
  authorName?: string;
  body: string;
}) {
  return db
    .insert(comments)
    .values({
      postId,
      authorName: authorName?.trim() || "Anonymous",
      body,
    })
    .returning();
}
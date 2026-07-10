import { eq, desc, count } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { posts } from "@/lib/db/schema";

export async function getAllPosts() {
  'use cache';
  cacheTag('posts');
  cacheLife('hours'); // tune to how often you publish

  return db.select().from(posts);
}

export async function getLatestPosts(limit = 6) {
  'use cache';
  cacheTag('posts');
  cacheLife('hours');

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
  'use cache';
  cacheTag('posts');
  cacheLife('hours');

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

export async function getCommentCount(postId: string) {
  const [result] = await db
    .select({ count: count() })
    .from(comments)
    .where(eq(comments.postId, postId));

  return result?.count ?? 0;
}
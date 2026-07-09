import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

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
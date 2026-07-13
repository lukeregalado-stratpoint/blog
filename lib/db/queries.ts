import { and, count, desc, eq, ilike, isNotNull, or, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { comments, posts } from "@/lib/db/schema";

export async function getAllPosts() {
	"use cache";
	cacheTag("posts");
	cacheLife("hours");

	return db.select().from(posts);
}

export async function getPostThumbnails(limit = 24) {
	"use cache";
	cacheTag("posts");
	cacheLife("hours");

	return db
		.select({
			id: posts.id,
			slug: posts.slug,
			imageSrc: posts.imageSrc,
		})
		.from(posts)
		.where(isNotNull(posts.imageSrc))
		.orderBy(desc(posts.createdAt))
		.limit(limit);
}

export async function getLatestPosts(limit = 6) {
	"use cache";
	cacheTag("posts");
	cacheLife("hours");

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
	"use cache";
	cacheTag("posts");
	cacheLife("hours");

	const [latest] = await db
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
		.limit(1);

	return latest ?? null;
}

export async function getPostBySlug(slug: string) {
	"use cache";
	cacheTag("posts");
	cacheLife("hours");

	const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
	return post ?? null;
}

export async function createPost({
	title,
	slug,
	body,
	imageSrc,
	tags,
}: {
	title: string;
	slug: string;
	body: string;
	imageSrc?: string;
	tags?: string[];
}) {
	return db.insert(posts).values({ title, slug, body, imageSrc, tags }).returning();
}

export async function updatePost({
	id,
	title,
	slug,
	body,
	imageSrc,
	tags,
}: {
	id: string;
	title: string;
	slug: string;
	body: string;
	imageSrc?: string;
	tags?: string[];
}) {
	return db
		.update(posts)
		.set({ title, slug, body, ...(imageSrc ? { imageSrc } : {}), ...(tags ? { tags } : {}) })
		.where(eq(posts.id, id))
		.returning();
}

// COMMENTS

export async function getCommentsForPost(postId: string, admin = false) {
	"use cache";
	cacheTag(`comments-${postId}`);
	cacheLife("seconds");

	const conditions = admin
		? eq(comments.postId, postId)
		: and(eq(comments.postId, postId), eq(comments.status, "approved"));

	return db
		.select()
		.from(comments)
		.where(conditions)
		.orderBy(desc(comments.createdAt));
}

export async function createComment({
	postId,
	authorName,
	body,
	style,
}: {
	postId: string;
	authorName?: string;
	body: string;
	style?: string | null;
}) {
	return db
		.insert(comments)
		.values({
			postId,
			authorName: authorName?.trim() || "Anonymous",
			body,
			style: style ?? null,
		})
		.returning();
}

export async function updateCommentStatus(
	commentId: string,
	status: "approved" | "rejected",
) {
	return db
		.update(comments)
		.set({ status })
		.where(eq(comments.id, commentId))
		.returning();
}

export async function getCommentCount(postId: string) {
	const [result] = await db
		.select({ count: count() })
		.from(comments)
		.where(and(eq(comments.postId, postId), eq(comments.status, "approved")));

	return result?.count ?? 0;
}

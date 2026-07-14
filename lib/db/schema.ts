// lib/db/schema.ts

import { relations, sql } from "drizzle-orm";
import { boolean, pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
	id: uuid("id").primaryKey().defaultRandom(),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	body: text("body").notNull(),
	imageSrc: text("image_src"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
	autoApproveComments: boolean("auto_approve_comments").notNull().default(true),
});

export const comments = pgTable("comments", {
	id: uuid("id").primaryKey().defaultRandom(),
	postId: uuid("post_id")
		.references(() => posts.id, { onDelete: "cascade" })
		.notNull(),
	authorName: text("author_name").notNull(),
	body: text("body").notNull(),
	style: text("style"),
	status: text("status", { enum: ["pending", "approved", "rejected"] })
		.default("pending")
		.notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stickers = pgTable("stickers", {
	id: uuid("id").primaryKey().defaultRandom(),
	postId: uuid("post_id")
		.references(() => posts.id, { onDelete: "cascade" })
		.notNull(),
	emoji: text("emoji").notNull(),
	x: real("x").notNull(), // percentage 0-100, left offset within the image
	y: real("y").notNull(), // percentage 0-100, top offset within the image
	rotation: real("rotation").default(0),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ many }) => ({
	comments: many(comments),
	stickers: many(stickers),
}));
export const commentsRelations = relations(comments, ({ one }) => ({
	post: one(posts, { fields: [comments.postId], references: [posts.id] }),
}));
export const stickersRelations = relations(stickers, ({ one }) => ({
	post: one(posts, { fields: [stickers.postId], references: [posts.id] }),
}));
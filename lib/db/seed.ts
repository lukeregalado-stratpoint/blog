import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

const seedPosts = [
	{
		title: "Getting Started with Next.js App Router",
		slug: "getting-started-nextjs-app-router",
		body: "The App Router changes how routing, layouts, and data fetching work in Next.js. In this post we walk through the core concepts, from nested layouts to server components, and how they fit together to build faster, more maintainable apps.",
		imageSrc:
			"https://res.cloudinary.com/nk1xszyh/image/upload/v1783562781/samples/waves.png",
	},
	{
		title: "Why We Chose Drizzle Over Prisma",
		slug: "drizzle-vs-prisma",
		body: "Prisma is a fantastic ORM, but for our use case Drizzle's SQL-first approach and lighter runtime footprint won out. We break down the tradeoffs we considered, including type safety, migration workflows, and cold start performance on serverless.",
		imageSrc:
			"https://res.cloudinary.com/nk1xszyh/image/upload/v1783562778/samples/coffee.jpg",
	},
	{
		title: "A Practical Guide to Postgres Indexing",
		slug: "postgres-indexing-guide",
		body: "Indexes can make or break your database's performance at scale. This guide covers B-tree basics, when to reach for a composite index, and how to read an EXPLAIN ANALYZE output without getting lost.",
		imageSrc:
			"https://res.cloudinary.com/nk1xszyh/image/upload/v1783562771/samples/ecommerce/accessories-bag.jpg",
	},
	{
		title: "Designing a Component Library from Scratch",
		slug: "designing-component-library",
		body: "Building a design system is as much about constraints as it is about flexibility. We share the process behind our token system, component API decisions, and how we kept things consistent across a growing app.",
		imageSrc:
			"https://res.cloudinary.com/nk1xszyh/image/upload/v1783562766/samples/ecommerce/analog-classic.jpg",
	},
	{
		title: "Serverless Postgres: What Actually Changes",
		slug: "serverless-postgres-explained",
		body: "Scale-to-zero, branching, and usage-based billing sound great on paper. We look at what serverless Postgres providers like Neon actually change about how you build and deploy apps day to day.",
		imageSrc:
			"https://res.cloudinary.com/nk1xszyh/image/upload/v1783562780/samples/paper.png",
	},
	{
		title: "Image Optimization Tips for Next.js Blogs",
		slug: "image-optimization-nextjs",
		body: "The next/image component does a lot for you automatically, but there are still choices that matter: fill vs fixed sizing, priority loading, and picking the right remote image host. Here's what we learned building this blog.",
		imageSrc:
			"https://res.cloudinary.com/nk1xszyh/image/upload/v1783562781/cld-sample-2.jpg",
	},
];

async function seed() {
	console.log("Seeding posts...");

	const inserted = await db.insert(posts).values(seedPosts).returning();

	console.log(`Inserted ${inserted.length} posts.`);

	//   if (inserted[0]) {
	//     await db.insert(comments).values([
	//       {
	//         postId: inserted[0].id,
	//         authorName: "Jordan",
	//         body: "Great writeup, this helped me understand layouts a lot better.",
	//       },
	//       {
	//         postId: inserted[0].id,
	//         authorName: "Sam",
	//         body: "Would love a follow-up on parallel routes next.",
	//       },
	//     ]);
	//     console.log("Inserted sample comments.");
	//   }

	console.log("Done.");
	process.exit(0);
}

seed().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});

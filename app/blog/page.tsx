import { Suspense } from "react";
import { getAllPosts } from "@/lib/db/queries";
import PostCard from "@/components/PostCard";
import BlogFilterClient from "@/components/BlogFilterClient";

export default function BlogPage() {
  return (
    <div className="pt-20 px-8 pb-8 bg-[#f1faee] bg-grain min-h-screen">
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogList />
      </Suspense>
    </div>
  );
}

async function BlogList() {
  const allPosts = await getAllPosts(); // now uncached, runs per-request

  const items = allPosts.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    tags: post.tags ?? [],
    element: <PostCard key={post.id} post={post} />,
  }));

  const tags = Array.from(new Set(allPosts.flatMap((p) => p.tags ?? []))).sort();

  return <BlogFilterClient items={items} tags={tags} />;
}

function BlogListSkeleton() {
  return <div>Loading posts...</div>; // match your existing skeleton style
}
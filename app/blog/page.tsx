import { getAllPosts } from "@/lib/db/queries";
import BlogFilterClient from "@/components/BlogFilterClient";
import PostCard from "@/components/PostCard";

export default async function BlogPage() {
  const allPosts = await getAllPosts();

  const items = allPosts.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    tags: post.tags ?? [],
    element: <PostCard key={post.id} post={post} />,
  }));

  const tags = Array.from(new Set(allPosts.flatMap((p) => p.tags ?? []))).sort();

  return (
    <div className="pt-20 px-8 pb-8 bg-[#f1faee] min-h-screen">
      <BlogFilterClient items={items} tags={tags} />
    </div>
  );
}
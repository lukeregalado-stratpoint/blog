import { notFound } from "next/navigation";
import EditPostForm from "@/components/EditPostForm";
import { getPostBySlug } from "@/lib/db/queries";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return <EditPostForm post={post} />;
}
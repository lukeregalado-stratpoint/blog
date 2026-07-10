import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/db/queries";
import { updatePostAction } from "@/lib/actions/posts";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-6">Edit post</h1>
      <form action={updatePostAction} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={post.id} />
        <input
          name="title"
          placeholder="Title"
          defaultValue={post.title}
          required
          className="border rounded px-3 py-2"
        />
        <textarea
          name="body"
          placeholder="Write your post..."
          defaultValue={post.body}
          required
          rows={10}
          className="border rounded px-3 py-2"
        />
        <input type="file" name="image" accept="image/*" className="border rounded px-3 py-2" />
        {post.imageSrc && (
          <p className="text-xs text-gray-400">Leave blank to keep the current image.</p>
        )}
        <button type="submit" className="bg-black text-white rounded px-4 py-2">
          Save changes
        </button>
      </form>
    </div>
  );
}
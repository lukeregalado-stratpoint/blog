import { createPostAction } from "@/lib/actions/posts";

export default function NewPostPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-6">New post</h1>
      <form action={createPostAction} className="flex flex-col gap-4">
        <input
          name="title"
          placeholder="Title"
          required
          className="border rounded px-3 py-2"
        />
        <textarea
          name="body"
          placeholder="Write your post..."
          required
          rows={10}
          className="border rounded px-3 py-2"
        />
        <input type="file" name="image" accept="image/*" className="border rounded px-3 py-2" />
        <button type="submit" className="bg-black text-white rounded px-4 py-2">
          Publish
        </button>
      </form>
    </div>
  );
}
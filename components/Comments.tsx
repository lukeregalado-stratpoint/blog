"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addCommentAction, type CommentFormState } from "@/lib/actions/comments";

type Comment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: Date;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start bg-black text-white text-sm rounded px-4 py-2 disabled:opacity-50"
    >
      {pending ? "Posting..." : "Post comment"}
    </button>
  );
}

const initialState: CommentFormState = { errors: {}, success: false };

export default function Comments({
  postId,
  comments,
}: {
  postId: string;
  comments: Comment[];
}) {
  const [state, formAction] = useActionState(addCommentAction, initialState);

  return (
    <div className="mt-10 wrap-break-word">
      <h2 className="text-lg font-libre font-semibold">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      <div className="mt-4 space-y-4 wrap-break-word">
        {comments.length === 0 && (
          <p className="text-sm text-[#f1faee]">No comments yet.</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-[#283618]/80 pb-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{comment.authorName}</span>
              <span className="text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <p className="text-sm text-[#f1faee]/70 mt-1">{comment.body}</p>
          </div>
        ))}
      </div>

      {/* LEAVE A COMMENT */}
      <form action={formAction} className="mt-6 flex flex-col gap-3">
        <input type="hidden" name="postId" value={postId} />

        <div>
          <input
            type="text"
            name="authorName"
            placeholder="Name (optional)"
            className="border rounded px-3 py-2 text-sm w-full"
          />
          {state.errors.authorName && (
            <p className="text-red-500 text-xs mt-1">{state.errors.authorName}</p>
          )}
        </div>

        <div>
          <textarea
            name="body"
            placeholder="Leave a comment..."
            rows={3}
            className="border rounded px-3 py-2 text-sm w-full"
          />
          {state.errors.body && (
            <p className="text-red-500 text-xs mt-1">{state.errors.body}</p>
          )}
        </div>

        {state.success && (
          <p className="text-green-600 text-xs">Comment posted!</p>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
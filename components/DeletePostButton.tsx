"use client";

import { useState, useTransition } from "react";
import { deletePostAction } from "@/lib/actions/posts";

export default function DeletePostButton({ postId }: { postId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)} 
        className="text-sm underline text-red-400 hover:text-red-300 cursor-pointer"
      >
        Delete
      </button>
    );
  }

  return (
    <span className="flex items-center gap-2 text-sm">
      <span className="text-gray-400">Delete this post?</span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => deletePostAction(postId))}
        className="underline text-red-400 hover:text-red-300 disabled:opacity-50 cursor-pointer"
      >
        {isPending ? "Deleting…" : "Confirm"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setConfirming(false)}
        className="underline text-gray-400 hover:text-gray-300"
      >
        Cancel
      </button>
    </span>
  );
}
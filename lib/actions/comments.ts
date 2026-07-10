"use server";

import { revalidatePath } from "next/cache";
import { createComment } from "@/lib/db/queries";

export type CommentFormState = {
  errors: {
    body?: string;
    authorName?: string;
  };
  success: boolean;
};

export async function addCommentAction(
  _prevState: CommentFormState,
  formData: FormData
): Promise<CommentFormState> {
  const postId = formData.get("postId") as string;
  const authorName = (formData.get("authorName") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();

  const errors: CommentFormState["errors"] = {};

  if (!body) {
    errors.body = "Comment can't be empty.";
  } else if (body.length > 1000) {
    errors.body = "Comment is too long (max 100 characters).";
  }

  if (authorName && authorName.length > 60) {
    errors.authorName = "Name is too long (max 25 characters).";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, success: false };
  }

  await createComment({ postId, authorName, body });
  revalidatePath(`/blog`, "layout");

  return { errors: {}, success: true };
}
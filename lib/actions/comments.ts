"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createComment } from "@/lib/db/queries";

const commentSchema = z.object({
  authorName: z
    .string()
    .trim()
    .max(25, "Name is too long (max 25 characters).")
    .optional()
    .or(z.literal("")),
  body: z
    .string()
    .trim()
    .max(100, "Comment is too long (max 100 characters)."),
});

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

  const result = commentSchema.safeParse({
    authorName: formData.get("authorName"),
    body: formData.get("body"),
  });

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      errors: {
        authorName: fieldErrors.authorName?.[0],
        body: fieldErrors.body?.[0],
      },
      success: false,
    };
  }

  const { authorName, body } = result.data;

  await createComment({ postId, authorName, body }); // createComment still applies the "Anonymous" fallback
  revalidatePath("/blog/[slug]", "page");

  return { errors: {}, success: true };
}
"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createComment } from "@/lib/db/queries";

const commentSchema = z.object({
  authorName: z
    .string()
    .trim()
    .max(80, "Name is too long (max 80 characters).")
    .optional()
    .or(z.literal("")),
  body: z
    .string()
    .trim()
    .max(2000, "Comment is too long (max 2000 characters)."),
  bold: z.boolean(),
  italic: z.boolean(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Invalid color.")
    .optional(),
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
    bold: formData.get("bold") === "on",
    italic: formData.get("italic") === "on",
    color: formData.get("color") || undefined,
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

  const { authorName, body, bold, italic, color } = result.data;
  const style = bold || italic || color ? JSON.stringify({ bold, italic, color }) : null;

  await createComment({ postId, authorName, body, style });

  revalidatePath("/blog/[slug]", "page");

  return { errors: {}, success: true };
}
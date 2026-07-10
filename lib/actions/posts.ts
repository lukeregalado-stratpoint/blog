"use server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { cloudinary } from "@/lib/cloudinary";
import { createPost, updatePost } from "@/lib/db/queries";
import { isAuthenticated } from "@/lib/auth";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function createPostAction(formData: FormData) {
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const file = formData.get("image") as File | null;

  let imageSrc: string | undefined;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "posts" }, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        })
        .end(buffer);
    });
    imageSrc = result.secure_url;
  }

  const slug = slugify(title);
  await createPost({ title, slug, body, imageSrc });
  revalidateTag('posts', 'hours');
  redirect(`/blog/${slug}`);
}

export async function updatePostAction(formData: FormData) {
  if (!(await isAuthenticated())) {
    redirect("/");
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const file = formData.get("image") as File | null;

  let imageSrc: string | undefined;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "posts" }, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        })
        .end(buffer);
    });
    imageSrc = result.secure_url;
  }

  const slug = slugify(title);
  await updatePost({ id, title, slug, body, imageSrc });
  revalidateTag('posts', 'hours');
  redirect(`/blog/${slug}`);
}
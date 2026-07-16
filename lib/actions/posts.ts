"use server";
import type { UploadApiResponse } from "cloudinary";
import { revalidateTag, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { createPost, deletePost, updatePost } from "@/lib/db/queries";

function slugify(title: string) {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-");
}

async function uploadImage(file: File): Promise<string> {
	const buffer = Buffer.from(await file.arrayBuffer());
	const result = await new Promise<UploadApiResponse>((resolve, reject) => {
		cloudinary.uploader
			.upload_stream({ folder: "posts" }, (err, res) => {
				if (err || !res) reject(err);
				else resolve(res);
			})
			.end(buffer);
	});
	return result.secure_url;
}

const postSchema = z.object({
	title: z.string().trim().min(1, "Title is required."),
	body: z.string().trim().min(1, "Body is required."),
	tags: z.string().optional(),
	autoApproveComments: z.string().optional(),
	image: z
		.instanceof(File)
		.optional()
		.nullable()
		.refine(
			(file) => !file || file.size === 0 || file.size <= 25 * 1024 * 1024,
			{
				message: "Image must be 5MB or smaller.",
			},
		),
});

const updatePostSchema = postSchema.extend({
	id: z.string().trim().min(1, "Missing post id."),
});

export type PostFormState = {
	errors: {
		title?: string;
		body?: string;
		image?: string;
	};
};

export async function createPostAction(
	_prevState: PostFormState,
	formData: FormData,
): Promise<PostFormState> {
	const result = postSchema.safeParse({
		title: formData.get("title"),
		body: formData.get("body"),
		tags: formData.get("tags") ?? undefined,
		autoApproveComments: formData.get("autoApproveComments") ?? undefined,
		image: formData.get("image"),
	});

	if (!result.success) {
		const fieldErrors = result.error.flatten().fieldErrors;
		return {
			errors: {
				title: fieldErrors.title?.[0],
				body: fieldErrors.body?.[0],
				image: fieldErrors.image?.[0],
			},
		};
	}

	const { title, body, image: file } = result.data;
	const tags = result.data.tags
		? result.data.tags
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean)
		: [];
	const autoApproveComments = result.data.autoApproveComments === "true";

	let imageSrc: string | undefined;
	if (file && file.size > 0) {
		imageSrc = await uploadImage(file);
	}

	const slug = slugify(title);
	await createPost({ title, slug, body, imageSrc, tags, autoApproveComments });
	revalidateTag("posts", "minutes");
	redirect(`/blog/${slug}`);
}

export async function updatePostAction(
	_prevState: PostFormState,
	formData: FormData,
): Promise<PostFormState> {
	if (!(await isAuthenticated())) {
		redirect("/");
	}

	const result = updatePostSchema.safeParse({
		id: formData.get("id"),
		title: formData.get("title"),
		body: formData.get("body"),
		tags: formData.get("tags") ?? undefined,
		autoApproveComments: formData.get("autoApproveComments") ?? undefined,
		image: formData.get("image"),
	});

	if (!result.success) {
		const fieldErrors = result.error.flatten().fieldErrors;
		return {
			errors: {
				title: fieldErrors.title?.[0],
				body: fieldErrors.body?.[0],
				image: fieldErrors.image?.[0],
			},
		};
	}

	const { id, title, body, image: file } = result.data;
	const tags = result.data.tags
		? result.data.tags
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean)
		: [];
	const autoApproveComments = result.data.autoApproveComments === "true";

	let imageSrc: string | undefined;
	if (file && file.size > 0) {
		imageSrc = await uploadImage(file);
	}

	const slug = slugify(title);
	await updatePost({
		id,
		title,
		slug,
		body,
		imageSrc,
		tags,
		autoApproveComments,
	});
	revalidateTag("posts", "minutes");
	redirect(`/blog/${slug}`);
}

export async function deletePostAction(id: string) {
	if (!(await isAuthenticated())) {
		redirect("/");
	}

	await deletePost(id);
	updateTag("posts");
	redirect("/blog");
}

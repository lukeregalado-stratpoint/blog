"use server";

import { cloudinary } from "@/lib/cloudinary";

export async function uploadImageAction(
	formData: FormData,
): Promise<{ url: string; width: number; height: number } | { error: string }> {
	const file = formData.get("file");
	if (!(file instanceof File)) {
		return { error: "No file provided." };
	}

	if (!file.type.startsWith("image/")) {
		return { error: "Please choose an image file." };
	}

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	try {
		const result = await new Promise<{
			secure_url: string;
			width: number;
			height: number;
		}>((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{ folder: "blog-body-images" },
				(error, result) => {
					if (error || !result) {
						reject(error ?? new Error("Upload failed"));
						return;
					}
					resolve(
						result as { secure_url: string; width: number; height: number },
					);
				},
			);
			uploadStream.end(buffer);
		});

		return {
			url: result.secure_url,
			width: result.width,
			height: result.height,
		};
	} catch {
		return { error: "Upload failed. Please try again." };
	}
}

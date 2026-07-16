"use server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import {
	createSticker,
	deleteSticker,
	getStickersForPost,
} from "@/lib/db/queries";
import { MAX_STICKERS_PER_POST, STICKER_OPTIONS } from "@/lib/stickers";

const VALID_IDS = STICKER_OPTIONS.map((s) => s.id);

const placeSchema = z.object({
	postId: z.string().uuid(),
	emoji: z.string().refine((val) => VALID_IDS.includes(val as never), {
		message: "Invalid sticker.",
	}),
	x: z.number().min(0).max(100),
	y: z.number().min(0).max(100),
	rotation: z.number().min(-20).max(20),
});

export async function addStickerAction(input: {
	postId: string;
	emoji: string;
	x: number;
	y: number;
	rotation: number;
}): Promise<{
	success: boolean;
	error?: string;
	sticker?: {
		id: string;
		emoji: string;
		x: number;
		y: number;
		rotation: number | null;
	};
}> {
	const result = placeSchema.safeParse(input);
	if (!result.success) {
		return { success: false, error: "Invalid sticker placement." };
	}

	const existing = await getStickersForPost(result.data.postId);
	if (existing.length >= MAX_STICKERS_PER_POST) {
		return { success: false, error: "This image is full of stickers!" };
	}

	const [created] = await createSticker(result.data);
	revalidateTag(`stickers-${result.data.postId}`, "seconds");
	return { success: true, sticker: created };
}

export async function deleteStickerAction(stickerId: string, postId: string) {
	if (!(await isAuthenticated())) return;
	await deleteSticker(stickerId);
	revalidateTag(`stickers-${postId}`, "seconds");
}

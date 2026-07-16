export const STICKER_OPTIONS = [
	{ id: "bwuh", src: "/stickers/nudaeng_bwuh.png" },
	{ id: "huh", src: "/stickers/nudaeng_huh.png" },
	{ id: "no", src: "/stickers/nudaeng_no.png" },
	{ id: "yes", src: "/stickers/nudaeng_yes.png" },
	{ id: "oh", src: "/stickers/nudaeng_oh.png" },
	{ id: "reading", src: "/stickers/nudaeng_reading.png" },
	{ id: "rain", src: "/stickers/nudaeng_rain.png" },
	{ id: "ipad", src: "/stickers/nudaeng_ipad.png" },
	{ id: "celebrate", src: "/stickers/nudaeng_celebrate.png" },
] as const;

export type StickerId = (typeof STICKER_OPTIONS)[number]["id"];

export function getStickerSrc(id: string): string | undefined {
	return STICKER_OPTIONS.find((s) => s.id === id)?.src;
}

export const MAX_STICKERS_PER_POST = 80;

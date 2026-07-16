import Image from "next/image";
import {
	getCommentsPreviewForPost,
	getStickersForPost,
} from "@/lib/db/queries";
import { getStickerSrc } from "@/lib/stickers";

function stripHtml(html: string) {
	return html.replace(/<[^>]*>/g, "").trim();
}

type MarqueeItem =
	| { type: "comment"; id: string; text: string }
	| { type: "sticker"; id: string; src: string };

const MARQUEE_DURATION_SECONDS = 18;

export default async function PostCardMarquee({ postId }: { postId: string }) {
	const [commentsPreview, stickerList] = await Promise.all([
		getCommentsPreviewForPost(postId, 6),
		getStickersForPost(postId),
	]);

	const commentItems: MarqueeItem[] = commentsPreview
		.map(
			(c): MarqueeItem => ({
				type: "comment",
				id: c.id,
				text: stripHtml(c.body),
			}),
		)
		.filter((c) => c.type === "comment" && c.text.length > 0);

	const uniqueStickerIds = Array.from(
		new Set(stickerList.map((s) => s.emoji)),
	).slice(0, 6);

	const stickerItems: MarqueeItem[] = uniqueStickerIds
		.map((id): MarqueeItem | null => {
			const src = getStickerSrc(id);
			return src ? { type: "sticker", id, src } : null;
		})
		.filter((item): item is MarqueeItem => item !== null);

	const items = [...commentItems, ...stickerItems];
	if (items.length === 0) return null;

	const track = [...items.map((item) => ({ item, copy: "a" as const }))];

	const randomDelay = -(Math.random() * MARQUEE_DURATION_SECONDS);

	return (
		<div
			className="@container pointer-events-none absolute inset-y-0 left-[35vw] right-56 z-10 hidden overflow-hidden 
					opacity-40 transition-opacity duration-500 group-hover:opacity-90 
					sm:block"
		>
			<div
				className="absolute inset-y-0 flex h-full w-max animate-marquee items-center gap-3 whitespace-nowrap"
				style={{ animationDelay: `${randomDelay}s` }}
			>
				{track.map(({ item, copy }) =>
					item.type === "comment" ? (
						<span
							key={`comment-${item.id}-${copy}`}
							className="rounded-full bg-[#283618]/10 px-2.5 py-1 text-[10px] text-[#283618]/70 font-libre"
						>
							{item.text.length > 40 ? `${item.text.slice(0, 40)}…` : item.text}
						</span>
					) : (
						<span
							key={`sticker-${item.id}-${copy}`}
							className="relative h-6 w-6 shrink-0"
						>
							<Image
								src={item.src}
								alt=""
								fill
								sizes="24px"
								className="object-contain"
							/>
						</span>
					),
				)}
			</div>
		</div>
	);
}

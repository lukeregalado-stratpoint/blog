"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { addStickerAction, deleteStickerAction } from "@/lib/actions/stickers";
import { getStickerSrc, STICKER_OPTIONS } from "@/lib/stickers";

type Sticker = {
	id: string;
	emoji: string;
	x: number;
	y: number;
	rotation: number | null;
};

const POPUP_WIDTH = 176;
const POPUP_HEIGHT = 148;
const VIEWPORT_MARGIN = 8;
const HIDE_STICKERS_KEY = "hideStickers";

export default function StickerLayer({
	postId,
	initialStickers,
	admin = false,
}: {
	postId: string;
	initialStickers: Sticker[];
	admin?: boolean;
}) {
	const router = useRouter();
	const containerRef = useRef<HTMLDivElement>(null);
	const pickerButtonRef = useRef<HTMLButtonElement>(null);
	const [pickerOpen, setPickerOpen] = useState(false);
	const [popupPos, setPopupPos] = useState<{
		top: number;
		left: number;
	} | null>(null);
	const [placingEmoji, setPlacingEmoji] = useState<string | null>(null);
	const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(
		null,
	);
	const [stickerList, setStickerList] = useState<Sticker[]>(initialStickers);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [hideStickers, setHideStickers] = useState(false);
	const [, startTransition] = useTransition();

	// load the viewer's saved preference once on mount
	useEffect(() => {
		const stored = window.localStorage.getItem(HIDE_STICKERS_KEY);
		if (stored === "true") setHideStickers(true);
	}, []);

	function handleHideStickersChange(checked: boolean) {
		setHideStickers(checked);
		window.localStorage.setItem(HIDE_STICKERS_KEY, String(checked));
	}

	const computePopupPosition = useCallback(() => {
		const btn = pickerButtonRef.current;
		if (!btn) return;
		const rect = btn.getBoundingClientRect();

		let top = rect.top - POPUP_HEIGHT - 8;
		let left = rect.right - POPUP_WIDTH;

		if (top < VIEWPORT_MARGIN) {
			top = rect.bottom + 8;
		}
		if (top + POPUP_HEIGHT > window.innerHeight - VIEWPORT_MARGIN) {
			top = window.innerHeight - POPUP_HEIGHT - VIEWPORT_MARGIN;
		}

		if (left < VIEWPORT_MARGIN) {
			left = VIEWPORT_MARGIN;
		}
		if (left + POPUP_WIDTH > window.innerWidth - VIEWPORT_MARGIN) {
			left = window.innerWidth - POPUP_WIDTH - VIEWPORT_MARGIN;
		}

		setPopupPos({ top, left });
	}, []);

	function togglePicker() {
		if (!pickerOpen) computePopupPosition();
		setPickerOpen((v) => !v);
	}

	useEffect(() => {
		if (!pickerOpen) return;
		function handleReposition() {
			computePopupPosition();
		}
		window.addEventListener("resize", handleReposition);
		window.addEventListener("scroll", handleReposition, true);
		return () => {
			window.removeEventListener("resize", handleReposition);
			window.removeEventListener("scroll", handleReposition, true);
		};
	}, [pickerOpen, computePopupPosition]);

	function handlePick(emoji: string) {
		setPlacingEmoji(emoji);
		setPickerOpen(false);
		setErrorMsg(null);
	}

	function cancelPlacing() {
		setPlacingEmoji(null);
		setCursorPos(null);
	}

	function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
		if (!placingEmoji) return;
		setCursorPos({ x: e.clientX, y: e.clientY });
	}

	function handlePlace(e: React.MouseEvent<HTMLDivElement>) {
		if (!placingEmoji || !containerRef.current) return;

		const rect = containerRef.current.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		const rotation = Math.round(Math.random() * 30 - 15);
		const emoji = placingEmoji;

		const tempId = `temp-${Date.now()}`;
		setStickerList((prev) => [...prev, { id: tempId, emoji, x, y, rotation }]);
		setPlacingEmoji(null);
		setCursorPos(null);

		startTransition(async () => {
			const result = await addStickerAction({ postId, emoji, x, y, rotation });
			if (!result.success || !result.sticker) {
				setStickerList((prev) => prev.filter((s) => s.id !== tempId));
				setErrorMsg(result.error ?? "Couldn't place sticker.");
				return;
			}
			const saved = result.sticker;
			setStickerList((prev) =>
				prev.map((s) => (s.id === tempId ? { ...saved } : s)),
			);
			router.refresh();
		});
	}

	function handleRemove(stickerId: string) {
		if (stickerId.startsWith("temp-")) {
			setStickerList((prev) => prev.filter((s) => s.id !== stickerId));
			return;
		}

		setStickerList((prev) => prev.filter((s) => s.id !== stickerId));
		startTransition(async () => {
			await deleteStickerAction(stickerId, postId);
			router.refresh();
		});
	}

	return (
		<>
			<div
				ref={containerRef}
				onClick={placingEmoji ? handlePlace : undefined}
				onMouseMove={placingEmoji ? handleMouseMove : undefined}
				onMouseLeave={() => setCursorPos(null)}
				aria-hidden={!placingEmoji}
				className={`absolute inset-0 z-20 ${
					placingEmoji ? "cursor-none" : "pointer-events-none"
				}`}
			>
				{!hideStickers &&
					stickerList.map((sticker) => (
						<div
							key={sticker.id}
							className="absolute w-8 h-8 md:w-20 md:h-20 pointer-events-auto select-none group/sticker"
							style={{
								left: `${sticker.x}%`,
								top: `${sticker.y}%`,
								transform: `translate(-50%, -50%) rotate(${sticker.rotation ?? 0}deg)`,
							}}
						>
							<Image
								src={
									getStickerSrc(sticker.emoji) ?? "/stickers/nudaeng_huh.png"
								}
								alt=""
								fill
								sizes="64px"
								className="object-contain pointer-events-none"
							/>
							{admin && (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										handleRemove(sticker.id);
									}}
									className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs 
                                        leading-5 opacity-0 group-hover/sticker:opacity-100 transition-opacity cursor-pointer z-10"
									aria-label="Remove sticker"
								>
									✖
								</button>
							)}
						</div>
					))}

				{placingEmoji && (
					<div
						className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 
							rounded-full pointer-events-none whitespace-nowrap"
					>
						Click anywhere on the image to place {placingEmoji}
					</div>
				)}

				{errorMsg && (
					<div
						className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-500/90 text-white text-xs px-3 py-1.5 
							rounded-full pointer-events-none whitespace-nowrap"
					>
						{errorMsg}
					</div>
				)}

				<div className="absolute bottom-3 right-3 pointer-events-auto">
					{placingEmoji ? (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								cancelPlacing();
							}}
							className="w-8 h-8 rounded-full bg-black/60 text-white text-sm flex items-center justify-center 
								cursor-pointer hover:bg-black/80 transition"
							aria-label="Cancel placing sticker"
						>
							✕
						</button>
					) : (
						<button
							ref={pickerButtonRef}
							type="button"
							onClick={togglePicker}
							className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-sm 
								flex items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition"
							aria-label="Add sticker"
						>
							✮
						</button>
					)}
				</div>
			</div>

			{pickerOpen &&
				popupPos &&
				createPortal(
					<div
						style={{ top: popupPos.top, left: popupPos.left }}
						className="fixed z-50 bg-[#1a1a1a]/90 backdrop-blur-sm rounded-xl p-2 
                            grid grid-cols-4 gap-1 shadow-xl"
					>
						{STICKER_OPTIONS.map((sticker) => (
							<button
								key={sticker.id}
								type="button"
								onClick={() => handlePick(sticker.id)}
								className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer p-1"
							>
								<Image
									src={sticker.src}
									alt={sticker.id}
									width={24}
									height={24}
									className="object-contain w-6 h-6"
								/>
							</button>
						))}

						<div className="col-span-4 border-t border-white/10 mt-1 pt-1.5 px-0.5">
							<label className="flex items-center gap-1.5 text-white/70 text-[11px] cursor-pointer select-none">
								<input
									type="checkbox"
									checked={hideStickers}
									onChange={(e) => handleHideStickersChange(e.target.checked)}
								/>
								Hide stickers
							</label>
						</div>
					</div>,
					document.body,
				)}

			{/* floating sticker on cursor */}
			{placingEmoji &&
				cursorPos &&
				createPortal(
					<div
						style={{ top: cursorPos.y, left: cursorPos.x }}
						className="fixed z-50 -translate-x-1/2 -translate-y-1/2 w-15 h-15 pointer-events-none select-none"
					>
						<Image
							src={getStickerSrc(placingEmoji) ?? "/stickers/star.png"}
							alt=""
							fill
							sizes="36px"
							className="object-contain"
						/>
					</div>,
					document.body,
				)}
		</>
	);
}

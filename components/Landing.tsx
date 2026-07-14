"use client";
import {
	motion,
	useAnimationFrame,
	useMotionTemplate,
	useMotionValue,
	useScroll,
	useSpring,
	useTransform,
	type MotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";

type Thumbnail = {
	id: string;
	slug: string;
	imageSrc: string | null;
};

// tile positions
const SLOTS = [
	{ id: "s1", top: 4, left: 6, rotate: -8, size: 90 },
	{ id: "s2", top: 6, left: 24, rotate: 5, size: 70 },
	{ id: "s3", top: 2, left: 46, rotate: -4, size: 60 },
	{ id: "s4", top: 3, left: 68, rotate: 8, size: 85 },
	{ id: "s5", top: 5, left: 88, rotate: -6, size: 75 },
	{ id: "s6", top: 16, left: 4, rotate: 10, size: 95 },
	{ id: "s7", top: 15, left: 92, rotate: -10, size: 80 },
	{ id: "s8", top: 22, left: 16, rotate: -12, size: 100 },
	{ id: "s9", top: 20, left: 80, rotate: 14, size: 90 },
	{ id: "s10", top: 30, left: 2, rotate: 6, size: 70 },
	{ id: "s11", top: 32, left: 95, rotate: -8, size: 65 },
	{ id: "s12", top: 40, left: 8, rotate: -14, size: 85 },
	{ id: "s13", top: 42, left: 90, rotate: 10, size: 95 },
	{ id: "s14", top: 52, left: 3, rotate: 8, size: 75 },
	{ id: "s15", top: 54, left: 94, rotate: -6, size: 80 },
	{ id: "s16", top: 62, left: 10, rotate: -10, size: 90 },
	{ id: "s17", top: 64, left: 88, rotate: 12, size: 70 },
	{ id: "s18", top: 72, left: 5, rotate: -8, size: 100 },
	{ id: "s19", top: 74, left: 92, rotate: 6, size: 85 },
	{ id: "s20", top: 82, left: 18, rotate: -12, size: 75 },
	{ id: "s21", top: 80, left: 78, rotate: 10, size: 90 },
	{ id: "s22", top: 90, left: 8, rotate: -6, size: 65 },
	{ id: "s23", top: 92, left: 46, rotate: 8, size: 70 },
	{ id: "s24", top: 88, left: 92, rotate: -10, size: 80 },
];

const FADE_START = 20; // tiles closer than this  from center are fully hidden
const FADE_END = 90; // tiles farther than this  are fully visible

function distanceFromCenter(top: number, left: number) {
	return Math.hypot(left - 50, top - 50);
}

function radiusOpacity(top: number, left: number) {
	const d = distanceFromCenter(top, left);
	if (d <= FADE_START) return 0;
	if (d >= FADE_END) return 1;
	return (d - FADE_START) / (FADE_END - FADE_START);
}

// cursor config
const REPEL_RADIUS = 100; // px - how close cursor needs to be
const REPEL_STRENGTH = 60; // px - max dist. a tile gets repelled

function Tile({
	slot,
	image,
	i,
	proximityOpacity,
	mouseX,
	mouseY,
}: {
	slot: (typeof SLOTS)[number];
	image: Thumbnail & { imageSrc: string };
	i: number;
	proximityOpacity: number;
	mouseX: MotionValue<number>;
	mouseY: MotionValue<number>;
}) {
	const positionRef = useRef<HTMLDivElement>(null);
	const repelX = useMotionValue(0);
	const repelY = useMotionValue(0);
	const springX = useSpring(repelX, { stiffness: 150, damping: 15, mass: 0.4 });
	const springY = useSpring(repelY, { stiffness: 150, damping: 15, mass: 0.4 });

	// measures tile's real curr. screen pos. and pushes away from cursor
	useAnimationFrame(() => {
		const el = positionRef.current;
		if (!el) return;

		const rect = el.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;

		const dx = cx - mouseX.get();
		const dy = cy - mouseY.get();
		const dist = Math.hypot(dx, dy);

		if (dist < REPEL_RADIUS && dist > 0.01) {
			const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
			repelX.set((dx / dist) * force);
			repelY.set((dy / dist) * force);
		} else {
			repelX.set(0);
			repelY.set(0);
		}
	});

	return (
		<div
			ref={positionRef}
			className="absolute"
			style={{
				top: `${slot.top}%`,
				left: `${slot.left}%`,
				width: slot.size,
				height: slot.size,
			}}
		>
			{/* cancels the outer rotation so tiles stay upright */}
			<div className="w-full h-full animate-[spin_90s_linear_infinite] [animation-direction:reverse]">
				<motion.div style={{ x: springX, y: springY }}>
					<motion.div
						className="w-full h-full overflow-hidden
							mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,black_55%,transparent_100%)]
							[-webkit-mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_55%,transparent_100%)]"
						initial={{ rotate: slot.rotate, y: 0, opacity: 0 }}
						animate={{
							rotate: [slot.rotate - 2, slot.rotate + 2, slot.rotate - 2],
							y: [0, -12, 0],
							opacity: proximityOpacity,
						}}
						transition={{
							opacity: { duration: 0.8, delay: (i % 8) * 0.05 },
							rotate: {
								duration: 7 + (i % 5),
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
								delay: i * 0.12,
							},
							y: {
								duration: 6 + (i % 4),
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
								delay: i * 0.12,
							},
						}}
					>

						<img
							src={image.imageSrc}
							alt=""
							loading="lazy"
							decoding="async"
							className={`w-full h-full object-cover ${
								i % 3 === 0 ? "blur-[3px]" : i % 3 === 1 ? "blur-[1px]" : "blur-none"
							}`}
						/>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}

function TileCarousel({ thumbnails }: { thumbnails: Thumbnail[] }) {
	const images = thumbnails.filter(
		(t): t is Thumbnail & { imageSrc: string } => !!t.imageSrc,
	);

	// raw cursor position (init)
	const mouseX = useMotionValue(-9999);
	const mouseY = useMotionValue(-9999);

	useEffect(() => {
		function handleMouseMove(e: MouseEvent) {
			mouseX.set(e.clientX);
			mouseY.set(e.clientY);
		}
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [mouseX, mouseY]);

	if (images.length === 0) return null;

	return (
		<div
			className="absolute inset-0 z-0 pointer-events-none
				mask-[radial-gradient(ellipse_62%_58%_at_50%_50%,transparent_30%,black_62%)]
				[-webkit-mask-image:radial-gradient(ellipse_62%_58%_at_50%_50%,transparent_30%,black_62%)]
				hidden md:block"
		>
			{/* outer ring (spins) */}
			<div className="absolute inset-0 animate-[spin_90s_linear_infinite]">
				{SLOTS.map((slot, i) => {
					const image = images[i % images.length];
					const proximityOpacity = radiusOpacity(slot.top, slot.left);

					return (
						<Tile
							key={slot.id}
							slot={slot}
							image={image}
							i={i}
							proximityOpacity={proximityOpacity}
							mouseX={mouseX}
							mouseY={mouseY}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default function Landing({
	thumbnails = [],
}: {
	thumbnails?: Thumbnail[];
}) {
	const { scrollYProgress } = useScroll();

	// As the user scrolls 0 -> 1, cycle both gradient hues through the color wheel
	const hueA = useTransform(scrollYProgress, [0, 1], [91, 300]);
	const hueB = useTransform(scrollYProgress, [0, 1], [271, 480]);

	const gradient = useMotionTemplate`
		linear-gradient(to top left in oklch increasing hue, 
		oklch(0.06 0.5 ${hueA}) 0%, 
		oklch(0.06 0.5 ${hueA}) 20%, 
		oklch(0.89 0.5 ${hueB}) 90%, 
		oklch(0.89 0.5 ${hueB}) 100%)`;

	return (
		<main className="fixed bg-grain inset-0 -z-10 w-full h-screen pt-14 px-14 overflow-hidden bg-[#e9ecef] rounded-lg shadow-xl flex items-center justify-center">
			<TileCarousel thumbnails={thumbnails} />

			<div className="relative z-10 w-[90%] -translate-y-40 md:-translate-y-25">
				<svg
					className="w-full text-[16vw] h-[26vw] md:text-[12vw] md:h-[20vw] leading-[0.73em] tracking-[-0.02em] overflow-visible
								font-serif"
					aria-label="Luke Regalado"
				>
					<defs>
						<clipPath id="name-clip">
							<text x="1%" y="68%">
								Luke
							</text>
							<text x="1%" y="113%">
								Regalado
							</text>
						</clipPath>
					</defs>
				</svg>

				<motion.div
					className="absolute inset-x-[-0.5%] inset-y-[-20%] [clip-path:url(#name-clip)]"
					style={{ background: gradient }}
				/>
			</div>
		</main>
	);
}
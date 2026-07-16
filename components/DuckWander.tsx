"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type DuckPhase = "idle" | "walking";

const DUCK_SIZE = 48; // px, adjust to match your gif dimensions
const WALK_SPEED = 60; // px per second
const MIN_IDLE_MS = 1500;
const MAX_IDLE_MS = 4000;

function Duck({ areaWidth, startDelay }: { areaWidth: number; startDelay: number }) {
	const controls = useAnimation();
	const [phase, setPhase] = useState<DuckPhase>("idle");
	const [facingLeft, setFacingLeft] = useState(false);
	const xRef = useRef(Math.random() * Math.max(areaWidth - DUCK_SIZE, 0));

	const runLoop = useCallback(
		async (cancelledRef: { current: boolean }) => {
			await new Promise((resolve) => setTimeout(resolve, startDelay));

			while (!cancelledRef.current) {
				// idle for a random pause
				setPhase("idle");
				const idleTime = MIN_IDLE_MS + Math.random() * (MAX_IDLE_MS - MIN_IDLE_MS);
				await new Promise((resolve) => setTimeout(resolve, idleTime));
				if (cancelledRef.current) return;

				// walk to a new random x position, y stays fixed
				const maxX = Math.max(areaWidth - DUCK_SIZE, 0);
				const targetX = Math.random() * maxX;
				const distance = Math.abs(targetX - xRef.current);
				const duration = Math.max(0.5, distance / WALK_SPEED);

				setFacingLeft(targetX < xRef.current);
				setPhase("walking");

				await controls.start({
					x: targetX,
					transition: { duration, ease: "linear" },
				});

				xRef.current = targetX;
			}
		},
		[areaWidth, controls, startDelay],
	);

	useEffect(() => {
		const cancelledRef = { current: false };
		runLoop(cancelledRef);
		return () => {
			cancelledRef.current = true;
		};
	}, [runLoop]);

	return (
		<motion.div
			className="absolute top-0 left-0 -translate-y-full"
			initial={{ x: xRef.current }}
			animate={controls}
		>
			<Image
				src={phase === "walking" ? "/duck-walking.gif" : "/duck-idle.gif"}
				alt=""
				width={DUCK_SIZE}
				height={DUCK_SIZE}
				unoptimized
				draggable={false}
				className="select-none pointer-events-none"
				style={{ transform: facingLeft ? "scaleX(1)" : "scaleX(-1)" }}
			/>
		</motion.div>
	);
}

export default function DuckWander({ count = 3 }: { count?: number }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		function measure() {
			if (el) setWidth(el.offsetWidth);
		}
		measure();

		const observer = new ResizeObserver(measure);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={containerRef}
			className="absolute inset-0 z-40 pointer-events-none "
		>
			{width > 0 &&
				Array.from({ length: count }).map((_, i) => (
					<Duck
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed duck count generated once on mount, never reorders
						key={i}
						areaWidth={width}
						startDelay={i * 500}
					/>
				))}
		</div>
	);
}
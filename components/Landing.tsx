"use client";
import { useScroll, useTransform, useMotionTemplate, motion } from "framer-motion";

export default function Landing() {
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
		<main className="fixed inset-0 -z-10 w-full h-screen pt-14 px-14 overflow-hidden bg-[#e9ecef] rounded-lg shadow-xl flex items-center justify-center">
			<div className="relative w-[90%] -translate-y-40	">
				<svg className="w-full text-[12vw] h-[20vw] leading-[0.73em] tracking-[-0.02em] overflow-visible
								font-serif"
								aria-label="Luke Regalado">
					
					<defs>
						<clipPath id="name-clip">
						<text x="1%" y="68%">Luke</text>
						<text x="1%" y="113%">Regalado</text>
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
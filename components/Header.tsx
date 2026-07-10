// components/Header.tsx
"use client";
import { Suspense } from "react";
import Link from "next/link";
import {
	motion,
	useMotionTemplate,
	useScroll,
	useTransform,
} from "framer-motion";
import NavBar from "./NavBar";

function NavBarFallback() {
	return (
		<nav>
			<ul className="md:flex md:flex-row md:space-x-8 md:mt-0 md:p-0">
				<li>
					<a href="/" className="block py-2 px-3 md:p-0 md:px-5 font-lexend font-extrabold text-[#003049]">
						Home
					</a>
				</li>
				<li>
					<a href="/blog" className="block py-2 px-3 md:p-0 md:px-5 font-lexend font-extrabold text-[#003049]">
						Blog
					</a>
				</li>
			</ul>
		</nav>
	);
}

export default function Header() {
	const { scrollYProgress } = useScroll();
	const hueA = useTransform(scrollYProgress, [0, 1], [91, 300]);
	const hueB = useTransform(scrollYProgress, [0, 1], [271, 480]);

	const gradient = useMotionTemplate`
      linear-gradient(to top left in oklch increasing hue, 
      oklch(0.06 0.5 ${hueA}) 0%, 
      oklch(0.06 0.5 ${hueA}) 20%, 
      oklch(0.89 0.5 ${hueB}) 90%, 
      oklch(0.89 0.5 ${hueB}) 100%)`;

	return (
		<header
			className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between min-w-full px-4 md:px-8
                    backdrop-blur-lg rounded-b-lg shadow-xl"
		>
			<div className="relative w-40 h-10 p-2">
				<Link href="/">
					<svg className="w-full h-full text-2xl font-black tracking-[-0.02em] overflow-visible">
						<title>logo</title>
						<defs>
							<clipPath id="header-name-clip">
								<text x="0" y="200%">
									push --force
								</text>
							</clipPath>
						</defs>
					</svg>
					<motion.div
						className="absolute inset-x-[-5%] inset-y-[-50%] [clip-path:url(#header-name-clip)]"
						style={{ background: gradient }}
					/>
				</Link>
			</div>
			<Suspense fallback={<NavBarFallback />}>
				<NavBar />
			</Suspense>
		</header>
	);
}
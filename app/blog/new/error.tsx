"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function NewPostError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-4">
			<h1 className="text-2xl font-serif font-bold text-[#f1faee]">
				Couldn't publish this post
			</h1>
			<p className="text-sm text-[#f1faee]/70 max-w-md">
				Something went wrong while saving your post. Your title, body, and tags
				haven't been lost — try again, or head back and start fresh.
			</p>
			<div className="flex items-center gap-3 mt-2">
				<button
					type="button"
					onClick={reset}
					className="bg-[#283618] text-[#f1faee] font-bold text-sm rounded px-5 py-2 cursor-pointer hover:opacity-90 transition"
				>
					Try again
				</button>
				<Link
					href="/blog"
					className="text-sm text-[#f1faee]/70 hover:text-[#f1faee] hover:underline"
				>
					Back to blog
				</Link>
			</div>
		</div>
	);
}

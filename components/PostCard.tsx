// components/PostCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import PostCardMarquee from "@/components/PostCardMarquee";
import { getCommentCount } from "@/lib/db/queries";
import type { Post } from "@/lib/db/schema";
import { excerpt } from "@/lib/utils";

export default function PostCard({ post }: { post: Post }) {
	return (
		<Link
			href={`/blog/${post.slug}`}
			className="group relative flex flex-col overflow-hidden rounded-sm transition duration-300 
                hover:shadow-md sm:h-36 sm:flex-row sm:items-center md:h-40
                border border-[#1f2421] md:border-none"
		>
			<div className="relative h-40 w-full sm:absolute sm:inset-y-0 sm:right-0 sm:h-auto sm:w-56 md:w-72 lg:w-80">
				<Image
					src={post.imageSrc ?? "/placeholder.jpg"}
					alt={post.title}
					fill
					sizes="(max-width: 639px) 100vw, (max-width: 767px) 224px, (max-width: 1023px) 288px, 320px"
					className="object-cover transition-transform duration-500 group-hover:scale-105
                    mask-none sm:mask-[linear-gradient(to_left,rgba(0,0,0,1)_45%,rgba(0,0,0,0)_100%)]"
					loading="eager"
				/>
			</div>

			<Suspense fallback={null}>
				<PostCardMarquee postId={post.id} />
			</Suspense>

			<div
				className="relative z-10 flex min-w-0 flex-col justify-center px-4 py-3 
                sm:flex-1 sm:max-w-[35vw] pr-6"
			>
				<div className="flex items-center gap-2">
					<time className="text-xs uppercase tracking-wide text-[#283618]/60">
						{new Date(post.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</time>
					<Suspense fallback={<CommentCountFallback />}>
						<CommentCount postId={post.id} />
					</Suspense>
				</div>

				<h3 className="mt-1 text-lg font-semibold font-serif text-[#283618] group-hover:underline whitespace-nowrap">
					{post.title}
				</h3>

				<p className="mt-1 text-sm font-libre font-regular text-[#283618]/70 line-clamp-2 wrap-break-word">
					{excerpt(post.body)}
				</p>

				{post.tags?.length > 0 && (
					<div className="mt-2 flex flex-wrap gap-1">
						{post.tags.map((tag: string) => (
							<span
								key={tag}
								className="rounded-full bg-[#283618]/10 px-2 py-0.5 text-[10px] text-[#283618]/80"
							>
								{tag}
							</span>
						))}
					</div>
				)}
			</div>
		</Link>
	);
}

async function CommentCount({ postId }: { postId: string }) {
	const count = await getCommentCount(postId);
	return (
		<p className="text-xs text-[#283618]/50">
			· {count} {count === 1 ? "comment" : "comments"}
		</p>
	);
}
function CommentCountFallback() {
	return <p className="text-xs text-[#283618]/30">· · ·</p>;
}

import Image from "next/image";
import Link from "next/link";
import { getLatestPosts } from "@/lib/db/queries";
import { excerpt } from "@/lib/utils";

export default async function Latest() {
	const latestPosts = await getLatestPosts(6);

	if (latestPosts.length === 0) {
		return (
			<p className="text-gray-500 mt-4">No posts yet - check back soon.</p>
		);
	}

	return (
		<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{latestPosts.map((post) => (
				<Link
					key={post.id}
					href={`/blog/${post.slug}`}
					className="group relative block h-72 overflow-hidden rounded-2xl transition hover:shadow-md hover:-translate-y-0.5"
				>
					<Image
						src={post.imageSrc ?? "/placeholder.jpg"}
						alt={post.title}
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
						loading="eager"
					/>

					<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

					<div className="relative z-10 flex h-full flex-col justify-between p-6">
						<time
							className="text-xs uppercase tracking-wide text-white/70 
                            rounded-xl bg-clip-padding backdrop-filter 
                            backdrop-blur-sm bg-[#31572c]/10 bg-opacity-10 p-2 w-fit"
						>
							{new Date(post.createdAt).toLocaleDateString("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric",
							})}
						</time>

						<div>
							<h3 className="text-lg font-libre font-semibold text-white group-hover:underline">
								{post.title}
							</h3>
							<p className="mt-2 text-sm text-white/80 line-clamp-2 font-libre">
								{excerpt(post.body)}
							</p>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}

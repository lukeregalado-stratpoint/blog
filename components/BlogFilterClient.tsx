"use client";
import { Search, X } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

interface BlogItem {
	id: string;
	title: string;
	body: string;
	tags: string[];
	element: ReactNode;
}

export default function BlogFilterClient({
	items,
	tags,
}: {
	items: BlogItem[];
	tags: string[];
}) {
	const [query, setQuery] = useState("");
	const [activeTag, setActiveTag] = useState("");

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return items.filter((item) => {
			const matchesQuery =
				!q ||
				item.title.toLowerCase().includes(q) ||
				item.body.toLowerCase().includes(q);
			const matchesTag = !activeTag || item.tags.includes(activeTag);
			return matchesQuery && matchesTag;
		});
	}, [items, query, activeTag]);

	return (
		<div>
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative w-full sm:max-w-xs">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#003049]/50" />
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search posts..."
						className="w-full border border-[#003049]/20 bg-white/60 py-2 pl-9 pr-8 text-sm text-[#003049] placeholder:text-[#003049]/40 focus:outline-none focus:ring-2 focus:ring-[#003049]/30"
					/>
					{query && (
						<button
							type="button"
							onClick={() => setQuery("")}
							className="absolute right-3 top-1/2 -translate-y-1/2"
							aria-label="Clear search"
						>
							<X className="h-4 w-4 text-[#003049]/50" />
						</button>
					)}
				</div>

				{tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						<button
							type="button"
							onClick={() => setActiveTag("")}
							className={`rounded-sm px-3 py-1 text-xs font-medium transition ${
								activeTag === ""
									? "bg-[#003049] text-white"
									: "bg-[#003049]/10 text-[#003049] hover:bg-[#003049]/20"
							}`}
						>
							All
						</button>
						{tags.map((tag) => (
							<button
								key={tag}
								type="button"
								onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
								className={`rounded-sm px-3 py-1 text-xs font-medium transition ${
									activeTag === tag
										? "bg-[#003049] text-white"
										: "bg-[#003049]/10 text-[#003049] hover:bg-[#003049]/20"
								}`}
							>
								{tag}
							</button>
						))}
					</div>
				)}
			</div>

			{filtered.length === 0 ? (
				<p className="py-12 text-center text-sm text-[#003049]/60">
					No posts match your search.
				</p>
			) : (
				<div className="blog-grid flex flex-col gap-3">
					{filtered.map((item) => item.element)}
				</div>
			)}
		</div>
	);
}

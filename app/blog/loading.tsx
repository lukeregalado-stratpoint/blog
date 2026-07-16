export default function BlogLoading() {
	return (
		<div className="pt-20 px-8 pb-8 bg-[#f1faee] bg-grain min-h-screen animate-pulse">
			<div className="flex flex-wrap gap-2 mb-8">
				<div className="h-8 w-16 rounded-full bg-[#003049]/10" />
				<div className="h-8 w-20 rounded-full bg-[#003049]/10" />
				<div className="h-8 w-14 rounded-full bg-[#003049]/10" />
				<div className="h-8 w-24 rounded-full bg-[#003049]/10" />
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: 9 }).map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list, never reorders or mutates
						key={i}
						className="rounded-2xl overflow-hidden border border-[#003049]/10 bg-white/60"
					>
						<div className="w-full aspect-[4/3] bg-[#003049]/10" />
						<div className="p-4 space-y-3">
							<div className="h-5 w-4/5 rounded-sm bg-[#003049]/10" />
							<div className="h-3.5 w-full rounded-sm bg-[#003049]/8" />
							<div className="h-3.5 w-2/3 rounded-sm bg-[#003049]/8" />
							<div className="flex gap-2 pt-1">
								<div className="h-5 w-12 rounded-full bg-[#003049]/8" />
								<div className="h-5 w-16 rounded-full bg-[#003049]/8" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
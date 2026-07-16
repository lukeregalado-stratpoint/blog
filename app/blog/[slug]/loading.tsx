export default function PostLoading() {
	return (
		<article
			className="min-h-screen bg-grain bg-[#1f2421] px-4 py-6 min-w-full max-w-5xl pt-20 md:px-8
				md:grid md:grid-cols-3 md:gap-10 animate-pulse"
		>
			<div className="md:col-start-1 md:row-start-1">
				<div
					className="relative z-10 w-full h-[50vh] md:h-[28vw] md:min-h-75 md:rounded-b-3xl
						rounded-t-3xl shadow-2xl bg-[#f1faee]/10"
				/>

				<div className="mt-6">
					<div className="flex items-center gap-3">
						<div className="h-8 md:h-9 w-3/4 rounded-md bg-[#f1faee]/15" />
					</div>

					<div className="flex items-center gap-2 mt-3">
						<div className="h-3.5 w-24 rounded-sm bg-[#f1faee]/10" />
						<span className="text-[#f1faee]/20">·</span>
						<div className="h-3.5 w-28 rounded-sm bg-[#f1faee]/10" />
					</div>

					<div className="flex flex-wrap gap-2 mt-4">
						<div className="h-6 w-16 rounded-full bg-[#283618]/20" />
						<div className="h-6 w-20 rounded-full bg-[#283618]/20" />
						<div className="h-6 w-14 rounded-full bg-[#283618]/20" />
					</div>

					<div className="hidden md:block mt-10 min-w-0 md:col-start-1 md:row-start-2">
						<CommentsSkeleton />
					</div>
				</div>
			</div>

			<div
				className="col-span-2 min-w-auto mt-8 md:mt-0 md:mr-5 md:col-start-2 md:row-start-1
					space-y-4"
			>
				<div className="h-5 w-full rounded-sm bg-[#f1faee]/10" />
				<div className="h-5 w-11/12 rounded-sm bg-[#f1faee]/10" />
				<div className="h-5 w-full rounded-sm bg-[#f1faee]/10" />
				<div className="h-5 w-4/5 rounded-sm bg-[#f1faee]/10" />
				<div className="h-40 w-full rounded-xl bg-[#f1faee]/10 mt-6" />
				<div className="h-5 w-full rounded-sm bg-[#f1faee]/10 mt-6" />
				<div className="h-5 w-10/12 rounded-sm bg-[#f1faee]/10" />
				<div className="h-5 w-full rounded-sm bg-[#f1faee]/10" />
				<div className="h-5 w-3/4 rounded-sm bg-[#f1faee]/10" />
			</div>

			<div className="mt-10 md:hidden min-w-0">
				<CommentsSkeleton />
			</div>
		</article>
	);
}

function CommentsSkeleton() {
	return (
		<div className="space-y-3">
			<div className="h-4 w-32 rounded-sm bg-[#f1faee]/15" />
			<div className="h-16 w-full rounded-lg bg-[#f1faee]/8" />
			<div className="h-16 w-full rounded-lg bg-[#f1faee]/8" />
		</div>
	);
}
const skeletonKeys = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

export default function Loading() {
	return (
		<>
			<div className="h-screen w-full bg-[#283618] animate-pulse" />

			<div className="h-screen flex flex-col justify-end md:justify-center">
				<section
					className="
            relative z-10
            w-full h-[50vh]
            sm:w-full sm:mx-auto
            md:w-[40vw] md:h-[28vw] md:max-w-2xl md:min-h-75
            md:mr-12 lg:mr-20 xl:mr-20
            md:rounded-b-3xl
            rounded-t-3xl
            shadow-2xl
            bg-[#3a4a2a] animate-pulse
          "
				/>
			</div>

			<section className="relative z-10 min-h-screen bg-[#f1faee] md:rounded-t-3xl shadow-2xl px-8 py-25">
				<div className="h-9 w-48 bg-black/10 rounded animate-pulse" />

				<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{skeletonKeys.map((key) => (
						<div
							key={key}
							className="h-72 rounded-2xl bg-black/10 animate-pulse"
						/>
					))}
				</div>
			</section>
		</>
	);
}

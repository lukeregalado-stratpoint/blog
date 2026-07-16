import DuckWander from "@/components/DuckWander";
import FeaturedArticle from "@/components/FeaturedArticle";
import Landing from "@/components/Landing";
import Latest from "@/components/Latest";
import TypingSprint from "@/components/TypingSprint";
import { getFeaturedPost, getPostThumbnails } from "@/lib/db/queries";
import { excerpt } from "@/lib/utils";

export default async function Page() {
	const [featured, thumbnails] = await Promise.all([
		getFeaturedPost(),
		getPostThumbnails(24),
	]);

	if (!featured) return null;

	const title = featured.title ?? "Untitled";
	const slug = featured.slug ?? "";
	const body = featured.body ?? "";
	const imageSrc = featured.imageSrc ?? "/placeholder.jpg";

	return (
		<>
			<Landing thumbnails={thumbnails} />
			<div className="h-screen flex flex-col justify-end md:justify-center">
				<section
					className="
            featured-section
            relative z-10
            h-[50vh]
            sm:mx-auto
            md:mr-12 lg:mr-20 xl:mr-20
            md:rounded-b-3xl
            rounded-t-3xl
            shadow-2xl
			bg-grain
          "
				>
					{featured && (
						<FeaturedArticle
							slug={slug}
							title={title}
							excerpt={excerpt(body, 120)}
							imageSrc={imageSrc}
						/>
					)}
				</section>
			</div>

			
			<section className="relative z-10 min-h-screen bg-[#f1faee]/95 bg-grain shadow-2xl px-8 pt-25 pb-8">
				<DuckWander count={3} />
				<h2 className="text-3xl font-bold font-serif text-black">
					Latest posts
				</h2>
				<Latest />
				<section className="relative z-10 px-8">
					<TypingSprint />
				</section>
			</section>
		</>
	);
}

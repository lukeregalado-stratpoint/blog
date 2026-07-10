import FeaturedArticle from "@/components/FeaturedArticle";
import Landing from "@/components/Landing";
import Latest from "@/components/Latest";
import { getFeaturedPost } from "@/lib/db/queries";

export default async function Page() {
	const featured = await getFeaturedPost();

	if (!featured) return null;

	const title = featured.title ?? "Untitled";
	const slug = featured.slug ?? "";
	const body = featured.body ?? "";
	const imageSrc = featured.imageSrc ?? "/placeholder.jpg";

	return (
		<>
			<Landing />
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
          "
				>
					{featured && (
						<FeaturedArticle
							slug={slug}
							title={title}
							excerpt={`${body.slice(0, 120)}...`}
							imageSrc={imageSrc}
						/>
					)}
				</section>
			</div>

			<section className="relative z-10 min-h-screen bg-[#f1faee] md:rounded-t-3xl shadow-2xl px-8 pt-25 pb-8">
				<h2 className="text-3xl font-bold font-serif text-black">
					Latest posts
				</h2>
				<Latest />
			</section>
		</>
	);
}

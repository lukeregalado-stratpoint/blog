import Landing from "@/components/Landing";
import Latest from "@/components/Latest";
import FeaturedArticle from "@/components/FeaturedArticle";
import { getFeaturedPost } from "@/lib/db/queries";

export default async function Page() {
  const featured = await getFeaturedPost();

  return (
    <>
      <Landing />
      <div className="h-screen flex flex-col">
        <section
          className="
            relative z-10
            w-[100%] h-[50vh]
            sm:w-[100%] sm:mx-auto
            md:w-[40vw] md:h-[18vw] md:max-w-2xl md:min-h-75
            md:ml-12 lg:ml-24 xl:ml-32
            rounded-t-3xl mt-auto
            shadow-2xl
          "
        >
          {featured && (
            <FeaturedArticle
              slug={featured.slug}
              title={featured.title}
              excerpt={featured.body.slice(0, 120) + "..."}
              imageSrc="/images/default-cover.jpg"
            />
          )}
        </section>
        <section className="relative z-10"></section>
      </div>

      <section className="relative z-10 min-h-screen bg-white md:rounded-t-3xl shadow-2xl px-8 py-25">
        <h2 className="text-3xl font-bold text-black">Latest posts</h2>
        <p className="text-gray-600 mt-4">This content scrolls up!</p>
        <Latest />
      </section>
    </>
  );
}
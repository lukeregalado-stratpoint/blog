import Landing from "@/components/Landing";
import Latest from "@/components/Latest";

export default function Page() {
  return (
    <>
      <Landing />
      {/* spacer */}
      <div className="h-screen flex flex-col">
        <section
          className="
            relative z-10
            w-[85%] h-[50vh]
            sm:w-[85%] sm:mx-auto
            md:w-[40vw] md:h-[18vw] md:max-w-2xl md:min-h-75
            md:ml-12 lg:ml-24 xl:ml-32
            bg-white rounded-t-3xl mt-auto
            shadow-2xl
          "
        >
          <p className="text-white p-6 md:p-10">hallo!</p>
        </section>
        <section className="relative z-10"></section>
      </div>

      {/* This panel scrolls up from below and covers the pinned hero */}
      <section className="relative z-10 min-h-screen bg-white md:rounded-t-3xl shadow-2xl px-8 py-25">
        <h2 className="text-3xl font-bold text-black">Latest posts</h2>
        <p className="text-gray-600 mt-4">This content scrolls up!</p>
        <Latest />
      </section>
    </>
  );
}
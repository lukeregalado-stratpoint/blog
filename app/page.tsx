import Landing from "@/components/Landing";

export default function Page() {
  return (
    <>
      <Landing />

      {/* spacer*/}
      <div className="h-screen" />

      {/* This panel scrolls up from below and covers the pinned hero */}
      <section className="relative z-10 min-h-screen bg-white rounded-t-3xl shadow-2xl px-8 py-16">
        <h2 className="text-3xl font-bold text-black">Next section</h2>
        <p className="text-gray-600 mt-4">
          This content scrolls up!.
        </p>
      </section>
    </>
  );
}
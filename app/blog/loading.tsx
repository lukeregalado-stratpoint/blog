const skeletonKeys = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

export default function Loading() {
  return (
    <div className="pt-20 px-8 pb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 bg-cream">
      {skeletonKeys.map((key) => (
        <div
          key={key}
          className="relative block h-72 overflow-hidden rounded-2xl bg-black/10 animate-pulse"
        >
          <div className="relative z-10 flex h-full flex-col justify-between p-6">
            <div className="h-6 w-24 rounded-xl bg-white/20" />
            <div>
              <div className="h-5 w-3/4 rounded bg-white/20" />
              <div className="mt-2 h-4 w-full rounded bg-white/10" />
              <div className="mt-1 h-4 w-2/3 rounded bg-white/10" />
              <div className="mt-2 h-3 w-16 rounded bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
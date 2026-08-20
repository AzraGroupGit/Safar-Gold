export default function AdminSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Memuat dashboard">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-44 animate-pulse rounded-lg bg-border/40" />
          <div className="h-4 w-72 animate-pulse rounded bg-border/30" />
        </div>
        <div className="h-7 w-32 animate-pulse rounded-full bg-border/30" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/60 bg-white p-5">
            <div className="h-3 w-24 animate-pulse rounded bg-border/30" />
            <div className="mt-3 h-7 w-28 animate-pulse rounded bg-border/40" />
            <div className="mt-2 h-3 w-16 animate-pulse rounded bg-border/20" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 h-5 w-40 animate-pulse rounded bg-border/30" />
            <div className="h-4 w-56 animate-pulse rounded bg-border/20" />
          </div>
          <div className="h-10 w-36 animate-pulse rounded-lg bg-border/30" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border/40 bg-surface p-4">
              <div className="h-3 w-20 animate-pulse rounded bg-border/20" />
              <div className="mt-2 h-7 w-28 animate-pulse rounded bg-border/30" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gold/20 bg-white p-6">
        <div className="h-5 w-44 animate-pulse rounded bg-border/30" />
        <div className="mt-1 h-4 w-64 animate-pulse rounded bg-border/20" />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border/40 bg-surface p-4">
              <div className="mb-3 h-4 w-36 animate-pulse rounded bg-border/20" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-white" />
              <div className="mt-2 h-4 w-48 animate-pulse rounded bg-border/20" />
              <div className="mt-2 h-4 w-40 animate-pulse rounded bg-border/20" />
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-4">
          <div className="h-12 w-36 animate-pulse rounded-lg bg-border/30" />
          <div className="h-12 w-40 animate-pulse rounded-lg bg-border/30" />
        </div>
      </div>
    </div>
  );
}
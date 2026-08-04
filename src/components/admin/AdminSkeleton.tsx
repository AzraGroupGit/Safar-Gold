export default function AdminSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-8 w-48 rounded-lg bg-surface" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/40 bg-surface p-6">
            <div className="mb-3 h-10 w-10 rounded-xl bg-border/30" />
            <div className="h-6 w-24 rounded bg-border/30" />
            <div className="mt-2 h-4 w-16 rounded bg-border/20" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 h-5 w-40 rounded bg-surface" />
            <div className="h-4 w-56 rounded bg-surface" />
          </div>
          <div className="h-10 w-36 rounded-xl bg-surface" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/40 bg-surface p-4">
              <div className="h-3 w-20 rounded bg-border/20" />
              <div className="mt-2 h-7 w-28 rounded bg-border/30" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gold/20 bg-white p-6">
        <div className="h-5 w-44 rounded bg-surface" />
        <div className="mt-1 h-4 w-64 rounded bg-surface" />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/40 bg-surface p-4">
              <div className="mb-3 h-4 w-36 rounded bg-border/20" />
              <div className="h-10 w-full rounded-lg bg-white" />
              <div className="mt-2 h-4 w-48 rounded bg-border/20" />
              <div className="mt-2 h-4 w-40 rounded bg-border/20" />
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-4">
          <div className="h-12 w-36 rounded-xl bg-surface" />
          <div className="h-12 w-40 rounded-xl bg-surface" />
        </div>
      </div>
    </div>
  );
}

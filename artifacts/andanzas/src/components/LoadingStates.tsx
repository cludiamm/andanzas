export function TripListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2" data-testid="loading-trips">
      {[0, 1, 2, 3].map((item) => (
        <div className="skeleton overflow-hidden rounded-[1.35rem] border border-border bg-card" key={item}>
          <div className="h-56 bg-muted" />
          <div className="space-y-3 p-6">
            <div className="h-3 w-24 rounded-full bg-muted" />
            <div className="h-7 w-3/4 rounded-full bg-muted" />
            <div className="h-4 w-full rounded-full bg-muted" />
            <div className="h-4 w-2/3 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TripDetailSkeleton() {
  return (
    <div className="space-y-8" data-testid="loading-trip">
      <div className="skeleton h-[320px] rounded-[1.5rem] bg-muted md:h-[420px]" />
      <div className="grid gap-5 md:grid-cols-3">
        {[0, 1, 2].map((item) => <div className="skeleton h-24 rounded-2xl bg-muted" key={item} />)}
      </div>
    </div>
  );
}

export function InlineError({ onRetry, label = 'We could not open this page.' }: { onRetry: () => void; label?: string }) {
  return (
    <div className="paper-card flex flex-col items-center justify-center rounded-[1.5rem] px-6 py-16 text-center" data-testid="status-error">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
        <span className="serif text-2xl">!</span>
      </div>
      <h2 className="serif text-2xl font-semibold">A small detour</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{label}</p>
      <button className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="button-retry" onClick={onRetry} type="button">Try again</button>
    </div>
  );
}
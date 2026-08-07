import { ArrowUpRight, CalendarDays, ChevronRight, MapPin, Plus, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { useListTrips } from '@workspace/api-client-react';
import type { TripSummary } from '@workspace/api-client-react';
import { BrandMark } from '@/components/BrandMark';
import { InlineError, TripListSkeleton } from '@/components/LoadingStates';

function TripCard({ trip, index }: { trip: TripSummary; index: number }) {
  return (
    <Link className={`paper-card group overflow-hidden rounded-[1.35rem] transition-all duration-300 hover:-translate-y-1 page-in delay-${Math.min(index + 1, 3)}`} data-testid={`link-trip-${trip.id}`} href={`/trips/${trip.id}`}>
      <div className="relative h-56 overflow-hidden bg-secondary">
        <img alt={`${trip.destination} landscape`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={trip.coverImageUrl} />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-transparent" />
        <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-foreground/20 px-3 py-1 text-[10px] font-medium uppercase tracking-[.18em] text-white backdrop-blur-sm">{trip.dates}</div>
        <div className="absolute bottom-5 left-5 flex items-center gap-1.5 text-sm text-white"><MapPin size={14} /> {trip.destination}</div>
        <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 transition-opacity group-hover:opacity-100"><ArrowUpRight size={17} /></div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="serif text-[1.65rem] font-semibold leading-none tracking-[-.03em]">{trip.title}</h2>
          <span className="mono shrink-0 pt-1 text-[10px] uppercase tracking-[.12em] text-muted-foreground">{trip.placeCount} places</span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{trip.description}</p>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <span>{trip.totalVotes ? `${trip.totalVotes} shared votes` : 'Ready to explore'}</span>
          <span className="flex items-center gap-1 font-semibold text-primary">Open trip <ChevronRight size={14} /></span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const tripsQuery = useListTrips();
  const trips = tripsQuery.data ?? [];

  return (
    <main className="grain min-h-[100dvh]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-8 md:py-8">
        <BrandMark />
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span className="h-2 w-2 rounded-full bg-accent" /> Travel notes, made together</div>
        <button className="flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary" data-testid="button-new-trip" onClick={() => window.alert('Trip creation is coming soon. Your saved trips are ready below.')} type="button"><Plus size={15} /> New trip</button>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-14 pt-12 md:px-8 md:pb-20 md:pt-20">
        <div className="max-w-3xl page-in">
          <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.2em] text-primary"><Sparkles size={15} /> Your field notes</div>
          <h1 className="serif max-w-2xl text-[3.5rem] font-semibold leading-[.96] tracking-[-.055em] md:text-[5.4rem]">Places worth<br /><em className="font-normal text-accent">wandering toward.</em></h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground md:text-lg">Curated corners for the days you are planning, and the places you will talk about long after.</p>
        </div>
        <div className="mt-14 flex items-end justify-between border-b border-border pb-4 page-in delay-1">
          <div><p className="mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">Your trips</p><h2 className="serif mt-2 text-2xl font-semibold">Keep exploring</h2></div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><CalendarDays size={14} /> No account needed</div>
        </div>
        <div className="mt-7">
          {tripsQuery.isLoading && <TripListSkeleton />}
          {tripsQuery.isError && <InlineError label="Your trip notes are taking the scenic route." onRetry={() => tripsQuery.refetch()} />}
          {!tripsQuery.isLoading && !tripsQuery.isError && trips.length === 0 && (
            <div className="paper-card rounded-[1.5rem] px-6 py-20 text-center" data-testid="status-empty-trips">
              <div className="mx-auto mb-6 flex h-16 w-16 rotate-3 items-center justify-center rounded-2xl bg-secondary text-primary"><MapPin size={27} /></div>
              <h2 className="serif text-3xl font-semibold">Your map is still blank</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">When a trip is ready, it will land here. In the meantime, keep a little room in your itinerary for the unexpected.</p>
              <button className="mt-7 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground" data-testid="button-empty-new-trip" onClick={() => window.alert('Trip creation is coming soon.')} type="button">Start a new trip</button>
            </div>
          )}
          {!tripsQuery.isLoading && !tripsQuery.isError && trips.length > 0 && <div className="grid gap-6 md:grid-cols-2">{trips.map((trip, index) => <TripCard index={index} key={trip.id} trip={trip} />)}</div>}
        </div>
      </section>
      <footer className="mx-auto flex max-w-6xl items-center justify-between border-t border-border px-5 py-7 text-xs text-muted-foreground md:px-8"><span className="serif text-base text-foreground">Andanzas</span><span>Take the long way.</span></footer>
    </main>
  );
}
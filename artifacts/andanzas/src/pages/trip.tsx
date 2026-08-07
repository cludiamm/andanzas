import { ArrowLeft, Check, ChevronDown, Clock3, Heart, MapPin, Share2, Star, ThumbsUp, UserRound, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { getGetTripQueryKey, getGetTripSummaryQueryKey, useCastVote, useGetTrip, useGetTripSummary, VoteInputMode } from '@workspace/api-client-react';
import type { Place } from '@workspace/api-client-react';
import { BrandMark } from '@/components/BrandMark';
import { InlineError, TripDetailSkeleton } from '@/components/LoadingStates';

type Mode = 'solo' | 'group';

function getDisplayName(tripId: number) {
  return window.localStorage.getItem(`andanzas-display-name-${tripId}`) ?? '';
}

function PlaceCard({ place, mode, onVote, pending }: { place: Place; mode: Mode; onVote: (placeId: number) => void; pending: boolean }) {
  const countLabel = place.voteCount === 0 ? 'Be the first to choose' : `${place.voteCount} ${place.voteCount === 1 ? 'vote' : 'votes'}`;
  return (
    <article className={`paper-card group overflow-hidden rounded-[1.35rem] transition-all duration-300 ${place.isVoted ? 'border-primary/50 ring-1 ring-primary/20' : ''}`} data-testid={`card-place-${place.id}`}>
      <div className="relative h-52 overflow-hidden bg-secondary">
        {place.imageUrl ? <img alt={place.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={place.imageUrl} /> : <div className="flex h-full items-center justify-center text-primary/40"><MapPin size={42} strokeWidth={1} /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.16em] text-foreground backdrop-blur">{place.category}</span>
        {place.isVoted && <span className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><Check size={13} /> {mode === 'solo' ? 'Saved' : 'Voted'}</span>}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div><h3 className="serif text-[1.55rem] font-semibold leading-none tracking-[-.03em]">{place.name}</h3><p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin size={12} /> {place.city}</p></div>
          <span className="mono pt-1 text-[10px] uppercase tracking-[.12em] text-muted-foreground">{countLabel}</span>
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{place.description}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          {place.ratingAverage !== null && <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-semibold text-secondary-foreground"><Star className="fill-current text-accent" size={12} /> {place.ratingAverage.toFixed(1)} / 5</span>}
          {place.price && <span className="rounded-full bg-secondary px-2.5 py-1">{place.price}</span>}
          {place.hours && <span className="rounded-full bg-secondary px-2.5 py-1">{place.hours}</span>}
        </div>
        {place.notes && <p className="mt-3 text-xs italic leading-5 text-muted-foreground">{place.notes}</p>}
        {mode === 'group' && (place.voters?.length ?? 0) > 0 && (
          <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground" data-testid={`voters-${place.id}`}>
            <UserRound className="mt-0.5 shrink-0 text-primary" size={14} />
            <span>Voted by {place.voters.join(', ')}</span>
          </div>
        )}
        <button className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${place.isVoted ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-foreground hover:border-primary hover:text-primary'} disabled:cursor-wait disabled:opacity-60`} data-testid={`button-vote-${place.id}`} disabled={pending} onClick={() => onVote(place.id)} type="button">
          {place.isVoted ? <><Check size={16} /> {mode === 'solo' ? 'Saved to my trip' : 'Your vote is in'}</> : <><ThumbsUp size={16} /> {mode === 'solo' ? 'Save this place' : 'Vote for this place'}</>}
        </button>
      </div>
    </article>
  );
}

export default function TripPage() {
  const params = useParams<{ tripId: string }>();
  const tripId = Number(params.tripId);
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<Mode>('solo');
  const [displayName, setDisplayName] = useState(() => Number.isFinite(tripId) ? getDisplayName(tripId) : '');
  const [nameDraft, setNameDraft] = useState(displayName);
  const [nameError, setNameError] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(!displayName);
  const identityParam = displayName.trim() ? { displayName: displayName.trim() } : undefined;
  const tripQueryKey = getGetTripQueryKey(tripId, identityParam);
  const summaryQueryKey = getGetTripSummaryQueryKey(tripId, identityParam);
  const tripQuery = useGetTrip(tripId, identityParam, { query: { queryKey: tripQueryKey, enabled: Number.isFinite(tripId) } });
  const summaryQuery = useGetTripSummary(tripId, identityParam, { query: { queryKey: summaryQueryKey, enabled: Number.isFinite(tripId) } });
  const voteMutation = useCastVote();
  const places = useMemo(() => tripQuery.data?.places ?? [], [tripQuery.data?.places]);
  const summary = summaryQuery.data;

  const saveDisplayName = () => {
    const nextName = nameDraft.trim().replace(/\s+/g, ' ');
    if (!nextName) {
      setNameError('Add a name so the group knows who voted.');
      return;
    }
    if (nextName.length > 128) {
      setNameError('Keep your display name under 128 characters.');
      return;
    }
    window.localStorage.setItem(`andanzas-display-name-${tripId}`, nextName);
    setDisplayName(nextName);
    setNameDraft(nextName);
    setNameError('');
    setShowNamePrompt(false);
  };

  const voteFor = (placeId: number) => {
    if (!displayName) {
      setShowNamePrompt(true);
      return;
    }
    voteMutation.mutate({ tripId, placeId, data: { displayName, mode: mode === 'solo' ? VoteInputMode.solo : VoteInputMode.group } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: tripQueryKey });
        queryClient.invalidateQueries({ queryKey: summaryQueryKey });
      },
    });
  };

  if (!Number.isFinite(tripId) || tripQuery.isError) {
    return <main className="min-h-[100dvh] px-5 py-8 md:px-8"><header className="mx-auto max-w-6xl"><Link className="inline-flex" data-testid="link-home-logo" href="/"><BrandMark /></Link></header><div className="mx-auto mt-20 max-w-xl"><InlineError label="We could not find that trip in your notebook." onRetry={() => tripQuery.refetch()} /></div></main>;
  }

  return (
    <main className="grain min-h-[100dvh]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-8 md:py-8">
        <Link className="inline-flex" data-testid="link-home-logo" href="/"><BrandMark /></Link>
        <Link className="flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary" data-testid="link-back-trips" href="/"><ArrowLeft size={15} /> All trips</Link>
      </header>
      <div className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
        {tripQuery.isLoading && <TripDetailSkeleton />}
        {!tripQuery.isLoading && tripQuery.data && (
          <>
            <section className="relative overflow-hidden rounded-[1.5rem] page-in">
              <img alt={`${tripQuery.data.destination} cover`} className="h-[360px] w-full object-cover md:h-[460px]" src={tripQuery.data.coverImageUrl} />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/15 to-transparent" />
              <div className="absolute bottom-7 left-6 right-6 text-white md:bottom-10 md:left-10">
                <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[.18em] text-white/80"><span className="flex items-center gap-1.5"><MapPin size={14} /> {tripQuery.data.destination}</span><span className="h-1 w-1 rounded-full bg-accent" /><span>{tripQuery.data.dates}</span></div>
                <h1 className="serif max-w-3xl text-[3.25rem] font-semibold leading-[.95] tracking-[-.05em] md:text-[5.5rem]">{tripQuery.data.title}</h1>
                <p className="mt-5 max-w-xl text-sm leading-6 text-white/80 md:text-base">{tripQuery.data.description}</p>
              </div>
            </section>
            <section className="mt-7 grid gap-4 md:grid-cols-[1fr_1fr_1fr_1.4fr] page-in delay-1">
              <div className="paper-card rounded-2xl p-5"><p className="mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">On the list</p><p className="serif mt-2 text-3xl font-semibold">{tripQuery.data.placeCount}</p><p className="mt-1 text-xs text-muted-foreground">curated places</p></div>
              <div className="paper-card rounded-2xl p-5"><p className="mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">In the mix</p><p className="serif mt-2 text-3xl font-semibold">{summary?.totalVotes ?? tripQuery.data.totalVotes}</p><p className="mt-1 text-xs text-muted-foreground">shared votes</p></div>
              <div className="paper-card rounded-2xl p-5"><p className="mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Leading</p><p className="serif mt-2 line-clamp-1 text-2xl font-semibold">{summary?.leadingPlace ?? 'Not chosen yet'}</p><p className="mt-1 text-xs text-muted-foreground">current favorite</p></div>
              <div className="flex items-center justify-between rounded-2xl bg-primary p-5 text-primary-foreground"><div><p className="mono text-[10px] uppercase tracking-[.16em] text-primary-foreground/65">Share the shortlist</p><p className="mt-2 max-w-[15rem] text-sm leading-5">No account, no fuss. Send this trip to your people.</p></div><button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 transition-colors hover:bg-primary-foreground/25" data-testid="button-share-trip" onClick={() => navigator.clipboard?.writeText(window.location.href)} type="button"><Share2 size={18} /></button></div>
            </section>
            <section className="mt-16 page-in delay-2">
              <div className="flex flex-col gap-6 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
                <div><p className="mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">Choose your rhythm</p><h2 className="serif mt-2 text-3xl font-semibold tracking-[-.03em]">How are we deciding?</h2></div>
                <div className="flex rounded-full border border-border bg-card p-1" data-testid="mode-switcher">
                  <button className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${mode === 'solo' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`} data-testid="button-mode-solo" onClick={() => setMode('solo')} type="button"><Heart size={14} /> Solo</button>
                  <button className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${mode === 'group' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`} data-testid="button-mode-group" onClick={() => setMode('group')} type="button"><Users size={14} /> Group</button>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-secondary/60 px-4 py-3 text-sm text-secondary-foreground"><Clock3 className="mt-0.5 shrink-0 text-primary" size={16} /><p>{mode === 'solo' ? 'Save the places that feel like you. Your choices stay yours.' : 'Every vote is visible to the group, so the best plan can emerge together.'}</p><ChevronDown className="ml-auto mt-0.5 shrink-0 opacity-40" size={16} /></div>
              <div className="mt-5 rounded-2xl border border-primary/20 bg-card p-5 shadow-[0_10px_30px_rgba(38,61,57,.06)]" data-testid="display-name-panel">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="mono text-[10px] uppercase tracking-[.16em] text-primary">{displayName ? 'Your trip name' : 'Before you vote'}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {displayName ? <>You are voting as <strong className="font-semibold text-foreground">{displayName}</strong>. This name is saved only on this device for this trip.</> : 'Choose a display name so the group can see who voted. No account or login needed.'}
                    </p>
                  </div>
                  {!showNamePrompt && <button className="shrink-0 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary" data-testid="button-change-name" onClick={() => { setNameDraft(displayName); setShowNamePrompt(true); }} type="button">Change name</button>}
                </div>
                {showNamePrompt && (
                  <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); saveDisplayName(); }}>
                    <label className="sr-only" htmlFor="display-name">Display name</label>
                    <input autoComplete="nickname" autoFocus={!displayName} className="min-h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" id="display-name" maxLength={128} onChange={(event) => { setNameDraft(event.target.value); setNameError(''); }} placeholder="Your name, e.g. Maya" value={nameDraft} />
                    <button className="min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90" data-testid="button-save-name" type="submit">Use this name</button>
                  </form>
                )}
                {nameError && <p className="mt-2 text-xs text-accent" data-testid="status-name-error">{nameError}</p>}
              </div>
              {summaryQuery.isError && <p className="mt-5 text-sm text-accent" data-testid="status-summary-error">Live vote totals are taking a moment. You can still vote below.</p>}
              {tripQuery.data.destinations.length > 0 ? (
                <div className="mt-7 space-y-12">
                  {tripQuery.data.destinations.map((destination) => (
                    <section key={destination.id} data-testid={`destination-${destination.id}`}>
                      <div className="mb-5 flex items-end justify-between border-b border-border pb-3">
                        <div>
                          <p className="mono text-[10px] uppercase tracking-[.18em] text-primary">{destination.country}</p>
                          <h3 className="serif mt-1 text-3xl font-semibold">{destination.city}</h3>
                        </div>
                        <span className="text-xs text-muted-foreground">{destination.estimatedDays} {destination.estimatedDays === 1 ? 'day' : 'days'} · {destination.places.length} places</span>
                      </div>
                      <div className="grid gap-6 md:grid-cols-2">{destination.places.map((place) => <PlaceCard key={place.id} mode={mode} onVote={voteFor} pending={voteMutation.isPending} place={place} />)}</div>
                    </section>
                  ))}
                </div>
              ) : <div className="mt-7 grid gap-6 md:grid-cols-2">{places.map((place) => <PlaceCard key={place.id} mode={mode} onVote={voteFor} pending={voteMutation.isPending} place={place} />)}</div>}
              {places.length === 0 && <div className="paper-card mt-7 rounded-2xl p-12 text-center" data-testid="status-empty-places"><p className="serif text-2xl font-semibold">No places pinned yet</p><p className="mt-2 text-sm text-muted-foreground">This trip is waiting for its first good idea.</p></div>}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
import { ArrowLeft, Map } from 'lucide-react';
import { Link } from 'wouter';
import { BrandMark } from '@/components/BrandMark';

export default function NotFound() {
  return (
    <main className="grain min-h-[100dvh] px-5 py-8 md:px-8">
      <Link className="mx-auto flex max-w-6xl" data-testid="link-not-found-logo" href="/"><BrandMark /></Link>
      <div className="mx-auto flex max-w-xl flex-col items-center px-5 pb-20 pt-28 text-center">
        <div className="float-mark flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-secondary text-primary"><Map size={34} /></div>
        <p className="mono mt-8 text-xs uppercase tracking-[.2em] text-accent">Off the map</p>
        <h1 className="serif mt-4 text-5xl font-semibold tracking-[-.05em]">This page wandered off.</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">The trail ends here, but there are plenty of good directions to take from home.</p>
        <Link className="mt-8 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground" data-testid="link-not-found-home" href="/"><ArrowLeft size={15} /> Back to trips</Link>
      </div>
    </main>
  );
}

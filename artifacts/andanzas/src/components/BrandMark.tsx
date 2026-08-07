import { Compass } from 'lucide-react';

type BrandMarkProps = {
  light?: boolean;
};

export function BrandMark({ light = false }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-3" data-testid="brand-mark">
      <div className={`float-mark flex h-10 w-10 items-center justify-center rounded-full border ${light ? 'border-white/30 bg-white/10 text-white' : 'border-primary/20 bg-primary text-primary-foreground'}`}>
        <Compass size={19} strokeWidth={1.7} />
      </div>
      <span className={`serif text-[1.55rem] font-semibold tracking-[-0.04em] ${light ? 'text-white' : 'text-foreground'}`}>Andanzas</span>
    </div>
  );
}
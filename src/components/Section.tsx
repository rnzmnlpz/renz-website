type Props = {
  id: string;
  slug: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({ id, slug, title, intro, children, className = "" }: Props) {
  return (
    <section id={id} className={`scroll-mt-20 border-b border-line ${className}`}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="flex items-center gap-3 font-mono text-xs text-dim">
          <span className="text-aqua">{slug}</span>
          <span className="h-px flex-1 bg-line" aria-hidden />
        </div>

        <h2 className="mt-5 max-w-[22ch] text-[clamp(1.75rem,4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-balance">
          {title}
        </h2>

        {intro && <p className="mt-4 max-w-[62ch] leading-relaxed text-dim">{intro}</p>}

        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

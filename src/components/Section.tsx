import Reveal, { SplitWords } from "./Reveal";

type Props = {
  id: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
};

export default function Section({ id, title, intro, children }: Props) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:px-8 lg:py-32">
        <Reveal>
          <h2 className="max-w-[20ch] text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
            <SplitWords text={title} />
          </h2>
        </Reveal>

        {intro && (
          <Reveal delay={140}>
            <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-dim">{intro}</p>
          </Reveal>
        )}

        <div className="mt-16">{children}</div>
      </div>
    </section>
  );
}

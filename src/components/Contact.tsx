import Reveal, { SplitWords } from "./Reveal";
import { sections } from "@/lib/copy";
import { profile } from "@/lib/profile";

const LINKS = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "LinkedIn", value: "in/rjohn-manlapaz", href: profile.linkedin },
  { label: "GitHub", value: "rnzmnlpz", href: profile.github },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
];

export default function Contact() {
  return (
    <>
      <section id="contact" className="scroll-mt-24">
        <div className="mx-auto max-w-5xl px-6 py-24 sm:px-8 lg:py-32">
          <Reveal>
            <h2 className="max-w-[16ch] text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
              <SplitWords text={sections.contact.title} />
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-dim">{sections.contact.intro}</p>
          </Reveal>

          <Reveal delay={220}>
            <a
              href={`mailto:${profile.email}`}
              className="press link-underline mt-10 inline-block text-[clamp(1.25rem,3vw,1.75rem)] font-medium tracking-[-0.02em] text-aqua"
            >
              {profile.email}
            </a>
          </Reveal>

          <dl className="mt-16 grid gap-x-16 gap-y-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {LINKS.map((link, i) => (
              <Reveal key={link.label} delay={i * 70}>
                <dt className="font-mono text-xs text-faint">{link.label}</dt>
                <dd className="mt-1.5">
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="press link-underline text-signal hover:text-aqua"
                  >
                    {link.value}
                  </a>
                </dd>
              </Reveal>
            ))}
            <Reveal delay={280}>
              <dt className="font-mono text-xs text-faint">Based in</dt>
              <dd className="mt-1.5 text-signal">{profile.location}</dd>
            </Reveal>
          </dl>
        </div>
      </section>

      <footer className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 pb-10 font-mono text-xs text-faint sm:px-8">
        <span>{profile.name}</span>
        <a href="#top" className="press link-underline hover:text-aqua">
          Back to top
        </a>
      </footer>
    </>
  );
}

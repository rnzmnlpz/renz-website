import Reveal from "./Reveal";
import Section from "./Section";
import { sections } from "@/lib/copy";
import { roles } from "@/lib/profile";

export default function Experience() {
  return (
    <Section id="experience" title={sections.experience.title} intro={sections.experience.intro}>
      <ol className="space-y-16">
        {roles.map((role) => (
          <Reveal as="li" key={`${role.company}-${role.start}`}>
            <div className="border-t border-line pt-8">
              <div className="grid gap-6 lg:grid-cols-[13rem_1fr] lg:gap-10">
                <div className="font-mono text-xs text-faint">
                  <p className={role.current ? "inline-flex items-center gap-2 text-aqua" : undefined}>
                    {role.current && (
                      <span className="relative flex h-1.5 w-1.5" aria-hidden>
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-aqua" />
                      </span>
                    )}
                    {role.start} — {role.end}
                  </p>
                  <p className="mt-1.5">{role.location}</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium leading-snug tracking-[-0.01em] text-signal sm:text-2xl">
                    {role.title}
                  </h3>
                  <p className="mt-1 text-dim">{role.company}</p>

                  <ul className="mt-6 space-y-3.5">
                    {role.points.map((point) => (
                      <li
                        key={point}
                        className="max-w-[70ch] text-[0.95rem] leading-relaxed text-dim"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

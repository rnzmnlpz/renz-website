import Section from "./Section";
import { sections } from "@/lib/copy";
import { roles } from "@/lib/profile";

export default function Experience() {
  return (
    <Section
      id="experience"
      title={sections.experience.title}
      intro={sections.experience.intro}
    >
      <ol className="space-y-16">
        {roles.map((role) => (
          <li key={`${role.company}-${role.start}`} className="border-t border-line pt-8">
            <div className="grid gap-6 lg:grid-cols-[13rem_1fr] lg:gap-10">
              <div className="font-mono text-xs text-faint">
                <p className={role.current ? "text-aqua" : undefined}>
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
                    <li key={point} className="max-w-[68ch] text-[0.95rem] leading-relaxed text-dim">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

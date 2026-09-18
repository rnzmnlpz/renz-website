import Reveal from "./Reveal";
import Section from "./Section";
import { sections } from "@/lib/copy";
import { certifications, education, languages, skills } from "@/lib/profile";

const lastWord = (text: string) => text.slice(text.lastIndexOf(" ") + 1);
const leading = (text: string) => text.slice(0, text.lastIndexOf(" ") + 1);

export default function Credentials() {
  return (
    <Section id="credentials" title={sections.credentials.title} intro={sections.credentials.intro}>
      <div className="grid gap-x-16 gap-y-14 lg:grid-cols-2">
        <Reveal>
          <div className="border-t border-line pt-6">
            <h3 className="font-mono text-sm text-aqua">Certifications</h3>
            <ul className="mt-7 space-y-4">
              {certifications.map((cert) => (
                <li key={cert.code} className="flex items-baseline justify-between gap-6">
                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noreferrer noopener"
                    /* inline, not inline-flex: a flexed label is one item, so on
                       a name that wraps the arrow strands at the end of the
                       first line instead of following the last word. */
                    className="press link-underline group/cert text-[0.95rem] leading-snug text-signal hover:text-aqua"
                  >
                    {/* The icon is tied to the final word so a name that wraps
                        can never leave the arrow stranded on a line of its own. */}
                    {leading(cert.name)}
                    <span className="whitespace-nowrap">
                      {lastWord(cert.name)}
                      <svg
                        viewBox="0 0 12 12"
                        className="ml-1.5 inline h-2.5 w-2.5 opacity-50 transition-opacity group-hover/cert:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.6}
                        aria-hidden
                      >
                        <path d="M4.5 1.5h6v6M10.5 1.5L4 8M8 10.5H1.5V4" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="sr-only">— view certificate, opens a PDF in a new tab</span>
                  </a>

                  <span className="flex shrink-0 items-baseline gap-3">
                    {/* Shown only where the issuer publishes a verification page,
                        so it always leads somewhere real. */}
                    {cert.verify && (
                      <a
                        href={cert.verify}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="press link-underline font-mono text-xs text-aqua/80 hover:text-aqua"
                      >
                        verify
                        <span className="sr-only">
                          {" "}
                          {cert.name} with the issuer, opens in a new tab
                        </span>
                      </a>
                    )}
                    <span translate="no" className="font-mono text-xs text-faint">
                      {cert.family}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={110}>
          <div className="border-t border-line pt-6">
            <h3 className="font-mono text-sm text-aqua">Education</h3>
            <ul className="mt-7 space-y-7">
              {education.map((e) => (
                <li key={e.degree}>
                  <p className="font-mono text-xs text-faint">
                    {e.start} — {e.end}
                  </p>
                  <p className="mt-2 text-signal">{e.degree}</p>
                  <p className="mt-1 text-sm text-dim">{e.school}</p>
                  <p className="mt-2 text-sm leading-relaxed text-dim">{e.note}</p>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 font-mono text-sm text-aqua">Languages</h3>
            <p className="mt-3 text-sm text-dim">{languages.join(", ")}</p>
          </div>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-x-16 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((group, i) => (
          <Reveal key={group.group} delay={i * 80}>
            <div className="border-t border-line pt-6">
              <h3 className="font-mono text-sm text-aqua">{group.group}</h3>
              <ul className="mt-6 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-dim">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

import Section from "./Section";
import { certifications, education, languages, skills } from "@/lib/profile";

export default function Credentials() {
  return (
    <Section
      id="credentials"
      slug="~/credentials"
      title="Certified across defence, offence and the cloud in between."
      intro="Red team operations on one side, Fortinet and Cisco defence on the other. Knowing how a network is broken into is what makes the hardening specific rather than generic."
    >
      <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-2">
        <div className="bg-panel p-6 sm:p-7">
          <h3 className="font-mono text-sm text-aqua">Certifications</h3>
          <ul className="mt-6 space-y-4">
            {certifications.map((cert) => (
              <li key={cert.code} className="flex items-baseline justify-between gap-4 border-b border-line/60 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm leading-snug text-signal">{cert.name}</p>
                  <p className="mt-0.5 font-mono text-[0.68rem] text-dim">{cert.family}</p>
                </div>
                <span className="shrink-0 rounded-sm bg-rack px-2 py-1 font-mono text-[0.65rem] text-dim">
                  {cert.code}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-panel p-6 sm:p-7">
          <h3 className="font-mono text-sm text-aqua">Education</h3>
          <ul className="mt-6 space-y-6">
            {education.map((e) => (
              <li key={e.degree} className="border-b border-line/60 pb-6 last:border-0 last:pb-0">
                <p className="font-mono text-xs text-dim">
                  {e.start} — {e.end}
                </p>
                <p className="mt-2 font-medium text-signal">{e.degree}</p>
                <p className="mt-0.5 text-sm text-dim">{e.detail}</p>
                <p className="mt-2 text-sm text-dim">{e.school}</p>
                <p className="mt-2 text-sm italic leading-relaxed text-dim/80">{e.note}</p>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 font-mono text-sm text-aqua">Languages</h3>
          <p className="mt-3 text-sm text-dim">{languages.join(" · ")}</p>
        </div>
      </div>

      <div className="mt-px grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((group) => (
          <div key={group.group} className="bg-panel p-6">
            <h3 className="font-mono text-sm text-aqua">{group.group}</h3>
            <ul className="mt-5 space-y-2">
              {group.items.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-dim">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

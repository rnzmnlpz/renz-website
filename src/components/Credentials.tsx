import Section from "./Section";
import { certifications, education, languages, skills } from "@/lib/profile";

export default function Credentials() {
  return (
    <Section
      id="credentials"
      title="Certified on both sides of the firewall."
      intro="Red team operations alongside Fortinet and Cisco defence. Knowing how a network gets broken into is what makes the hardening specific."
    >
      <div className="grid gap-x-16 gap-y-14 lg:grid-cols-2">
        <div className="border-t border-line pt-6">
          <h3 className="font-mono text-sm text-aqua">Certifications</h3>
          <ul className="mt-7 space-y-4">
            {certifications.map((cert) => (
              <li key={cert.code} className="flex items-baseline justify-between gap-6">
                <span className="text-[0.95rem] leading-snug text-signal">{cert.name}</span>
                <span className="shrink-0 font-mono text-xs text-faint">{cert.family}</span>
              </li>
            ))}
          </ul>
        </div>

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
      </div>

      <div className="mt-16 grid gap-x-16 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((group) => (
          <div key={group.group} className="border-t border-line pt-6">
            <h3 className="font-mono text-sm text-aqua">{group.group}</h3>
            <ul className="mt-6 space-y-2.5">
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

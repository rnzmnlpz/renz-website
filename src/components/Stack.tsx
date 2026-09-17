import Section from "./Section";
import { stack } from "@/lib/profile";

export default function Stack() {
  return (
    <Section
      id="stack"
      title="The kit, grouped by layer."
      intro="The platforms I work in daily, arranged by the layer they sit on rather than by vendor. A firewall and an access point fail in different ways and belong in different groups."
    >
      <div className="grid gap-x-16 gap-y-14 sm:grid-cols-2">
        {stack.map((group) => (
          <div key={group.layer} className="border-t border-line pt-6">
            <h3 className="font-mono text-sm text-aqua">{group.layer}</h3>
            <p className="mt-1.5 text-sm text-faint">{group.caption}</p>

            <ul className="mt-7 space-y-5">
              {group.tools.map((tool) => (
                <li key={tool.name}>
                  <p className="leading-snug text-signal">{tool.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-dim">{tool.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

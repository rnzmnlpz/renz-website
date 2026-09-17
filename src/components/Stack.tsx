import Reveal from "./Reveal";
import Section from "./Section";
import { sections } from "@/lib/copy";
import { stack } from "@/lib/profile";

export default function Stack() {
  return (
    <Section id="stack" title={sections.stack.title} intro={sections.stack.intro}>
      <div className="grid gap-x-16 gap-y-14 sm:grid-cols-2">
        {stack.map((group, i) => (
          <Reveal key={group.layer} delay={i * 90}>
            <div className="border-t border-line pt-6">
              <h3 className="font-mono text-sm text-aqua">{group.layer}</h3>
              <p className="mt-1.5 text-sm text-faint">{group.caption}</p>

              <ul className="mt-7 space-y-1">
                {group.tools.map((tool) => (
                  <li
                    key={tool.name}
                    className="row-hover -mx-3 rounded-sm px-3 py-2.5"
                  >
                    <p translate="no" className="leading-snug text-signal">
                      {tool.name}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-dim">{tool.note}</p>
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

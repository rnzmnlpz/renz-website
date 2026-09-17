import Section from "./Section";
import { stack } from "@/lib/profile";

export default function Stack() {
  return (
    <Section
      id="stack"
      slug="~/stack"
      title="The kit, grouped by what it actually defends."
      intro="Vendor logos say very little on their own. These are the platforms I work in daily, arranged by the layer they operate on — because that is how a network is designed, and how it fails."
    >
      <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
        {stack.map((group) => (
          <div key={group.layer} className="bg-panel p-6 sm:p-7">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-mono text-sm text-aqua">{group.layer}</h3>
              <span className="font-mono text-[0.68rem] text-dim">
                {String(group.tools.length).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-dim">{group.caption}</p>

            <ul className="mt-6 space-y-4">
              {group.tools.map((tool) => (
                <li key={tool.name} className="border-l border-line pl-4">
                  <p className="font-medium leading-snug text-signal">{tool.name}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-dim">{tool.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

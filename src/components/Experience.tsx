import Section from "./Section";
import { roles } from "@/lib/profile";

export default function Experience() {
  return (
    <Section
      id="experience"
      slug="~/experience"
      title="Four years of being the person the network calls."
      intro="From a first help desk queue to owning the perimeter. Each move added a layer — endpoints, then identity and cloud, then the firewall itself."
    >
      <ol className="relative">
        {roles.map((role, i) => (
          <li key={`${role.company}-${role.start}`} className="relative pb-12 pl-8 last:pb-0 sm:pl-12">
            {i < roles.length - 1 && (
              <span className="absolute left-[5px] top-4 h-full w-px bg-line sm:left-[7px]" aria-hidden />
            )}
            <span
              className={`absolute left-0 top-[6px] h-3 w-3 rounded-full border-2 ${
                role.current ? "border-aqua bg-aqua" : "border-line bg-rack"
              }`}
              aria-hidden
            />

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs">
              <span className={role.current ? "text-aqua" : "text-dim"}>
                {role.start} — {role.end}
              </span>
              {role.current && (
                <span className="rounded-sm bg-aqua/10 px-2 py-0.5 text-aqua">current</span>
              )}
              <span className="text-dim">{role.location}</span>
            </div>

            <h3 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.01em] text-signal sm:text-2xl">
              {role.title}
            </h3>
            <p className="mt-1 text-dim">{role.company}</p>

            <ul className="mt-5 space-y-3">
              {role.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed text-dim sm:text-[0.95rem]">
                  <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-aqua/70" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}

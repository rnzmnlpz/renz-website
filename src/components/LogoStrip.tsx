import { logos } from "@/lib/logos";

function aspectOf(viewBox: string) {
  const [, , w, h] = viewBox.split(" ").map(Number);
  return w / h;
}

/* Monochrome at rest so six vendor palettes do not fight the page; each
   resolves to its own brand colour on hover. */
export default function LogoStrip() {
  return (
    <ul className="flex flex-wrap items-center gap-x-9 gap-y-6 sm:gap-x-11">
      {logos.map((logo, i) => (
        <li
          key={logo.id}
          className="rise group flex items-center text-faint"
          style={{ "--d": `${i * 60}ms`, "--brand": logo.brand } as React.CSSProperties}
        >
          <span className="sr-only">
            {logo.title} — {logo.note}
          </span>

          {logo.path ? (
            <svg
              viewBox={logo.viewBox}
              /* Width follows the tightened viewBox so each mark keeps its own
                 proportions and reserves exactly the space it occupies. */
              height={logo.height}
              width={Math.round(logo.height * aspectOf(logo.viewBox))}
              className="fill-current transition-colors duration-[var(--t-hover)] group-hover:text-[var(--brand)]"
              aria-hidden
            >
              <path d={logo.path} />
            </svg>
          ) : (
            <span
              translate="no"
              aria-hidden
              style={{ fontSize: logo.height * 0.66, lineHeight: 1 }}
              className="font-semibold tracking-[-0.02em] transition-colors duration-[var(--t-hover)] group-hover:text-[var(--brand)]"
            >
              {logo.title}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

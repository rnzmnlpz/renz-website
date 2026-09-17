import { logos, type Logo } from "@/lib/logos";

function aspectOf(viewBox: string) {
  const [, , w, h] = viewBox.split(" ").map(Number);
  return w / h;
}

function Mark({ logo }: { logo: Logo }) {
  const shared =
    "transition-colors duration-[var(--t-hover)] group-hover/logo:text-[var(--brand)]";

  return (
    <span
      className="group/logo flex shrink-0 items-center text-faint"
      style={{ "--brand": logo.brand } as React.CSSProperties}
    >
      {logo.path ? (
        <svg
          viewBox={logo.viewBox}
          /* Width follows the tightened viewBox so each mark keeps its own
             proportions and reserves exactly the space it occupies. */
          height={logo.height}
          width={Math.round(logo.height * aspectOf(logo.viewBox))}
          className={`fill-current ${shared}`}
          aria-hidden
        >
          <path d={logo.path} />
        </svg>
      ) : (
        <span
          translate="no"
          aria-hidden
          style={{ fontSize: logo.height * 0.66, lineHeight: 1 }}
          className={`font-semibold tracking-[-0.02em] ${shared}`}
        >
          {logo.title}
        </span>
      )}
    </span>
  );
}

/* Monochrome at rest so fourteen vendor palettes do not fight the page; each
   resolves to its own brand colour on hover, which also pauses the scroll. */
export default function LogoStrip() {
  return (
    <div className="marquee rise -mx-6 overflow-hidden sm:-mx-8">
      <div className="marquee-track">
        {/* The list is rendered twice so the loop has something to scroll into.
            Only the first copy is exposed to assistive tech. */}
        <ul className="flex shrink-0 items-center gap-x-10 px-5 sm:gap-x-12">
          {logos.map((logo) => (
            <li key={logo.id}>
              <span className="sr-only">
                {logo.title} — {logo.note}
              </span>
              <Mark logo={logo} />
            </li>
          ))}
        </ul>

        <ul className="flex shrink-0 items-center gap-x-10 px-5 sm:gap-x-12" aria-hidden>
          {logos.map((logo) => (
            <li key={`${logo.id}-loop`}>
              <Mark logo={logo} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

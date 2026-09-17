import { profile } from "@/lib/profile";

const LINKS = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "LinkedIn", value: "in/rjohn-manlapaz", href: profile.linkedin },
  { label: "GitHub", value: "rnzmnlpz", href: profile.github },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
];

export default function Contact() {
  return (
    <>
      <section id="contact" className="scroll-mt-20 border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="flex items-center gap-3 font-mono text-xs text-dim">
            <span className="text-aqua">~/contact</span>
            <span className="h-px flex-1 bg-line" aria-hidden />
          </div>

          <div className="mt-5 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16">
            <div>
              <h2 className="max-w-[18ch] text-[clamp(1.75rem,4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-balance">
                Got a network that needs owning?
              </h2>
              <p className="mt-5 max-w-[54ch] leading-relaxed text-dim">
                I am open to network engineering and infrastructure security roles, on site in Metro
                Manila or remote. Tell me what your network looks like now and where it keeps hurting.
              </p>

              <a
                href={`mailto:${profile.email}`}
                className="mt-8 inline-block rounded-sm bg-aqua px-6 py-3.5 font-mono text-sm font-medium text-rack transition-colors hover:bg-aqua/85"
              >
                {profile.email}
              </a>
            </div>

            <dl className="divide-y divide-line rounded-md border border-line bg-panel">
              {LINKS.map((link) => (
                <div key={link.label} className="flex items-center justify-between gap-4 px-5 py-4">
                  <dt className="font-mono text-xs text-dim">{link.label}</dt>
                  <dd>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer noopener" : undefined}
                      className="font-mono text-sm text-signal transition-colors hover:text-aqua"
                    >
                      {link.value}
                    </a>
                  </dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <dt className="font-mono text-xs text-dim">Based in</dt>
                <dd className="font-mono text-sm text-signal">{profile.location}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 font-mono text-xs text-dim sm:px-8">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <a href="#top" className="transition-colors hover:text-aqua">
          Back to top
        </a>
      </footer>
    </>
  );
}

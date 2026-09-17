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
      <section id="contact" className="scroll-mt-24">
        <div className="mx-auto max-w-5xl px-6 py-24 sm:px-8 lg:py-32">
          <h2 className="max-w-[16ch] text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
            Hiring for a network role?
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-dim">
            I am open to network engineering and infrastructure security roles, on site in Metro
            Manila or remote. Tell me what your network looks like now and where it keeps hurting.
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="mt-10 inline-block text-[clamp(1.25rem,3vw,1.75rem)] font-medium tracking-[-0.02em] text-aqua underline-offset-[6px] hover:underline"
          >
            {profile.email}
          </a>

          <dl className="mt-16 grid gap-x-16 gap-y-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {LINKS.map((link) => (
              <div key={link.label}>
                <dt className="font-mono text-xs text-faint">{link.label}</dt>
                <dd className="mt-1.5">
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="text-signal transition-colors hover:text-aqua"
                  >
                    {link.value}
                  </a>
                </dd>
              </div>
            ))}
            <div>
              <dt className="font-mono text-xs text-faint">Based in</dt>
              <dd className="mt-1.5 text-signal">{profile.location}</dd>
            </div>
          </dl>
        </div>
      </section>

      <footer className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 pb-10 font-mono text-xs text-faint sm:px-8">
        <span>{profile.name}</span>
        <a href="#top" className="transition-colors hover:text-aqua">
          Back to top
        </a>
      </footer>
    </>
  );
}

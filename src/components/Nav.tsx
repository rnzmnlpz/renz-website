"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/profile";

const SECTIONS = [
  { id: "stack", label: "Stack" },
  { id: "lab", label: "Lab" },
  { id: "experience", label: "Experience" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-rack/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8" aria-label="Primary">
        <a href="#top" className="group flex items-center gap-2.5 font-mono text-sm">
          <span className="grid h-7 w-7 place-items-center rounded-sm border border-aqua/40 text-[0.65rem] font-semibold text-aqua">
            {profile.initials}
          </span>
          <span className="hidden text-signal transition-colors group-hover:text-aqua sm:inline">
            {profile.shortName}
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`rounded-sm px-3 py-2 font-mono text-[0.8rem] transition-colors ${
                active === s.id ? "text-aqua" : "text-dim hover:text-signal"
              }`}
            >
              {s.label}
            </a>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="ml-2 rounded-sm border border-line px-3.5 py-2 font-mono text-[0.8rem] text-signal transition-colors hover:border-aqua/60 hover:text-aqua"
          >
            Hire me
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-9 w-9 place-items-center rounded-sm border border-line text-signal transition-colors hover:border-aqua/60 md:hidden"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 13h14" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-rack/95 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-5 py-2 sm:px-8">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className={`border-b border-line/50 py-3.5 font-mono text-sm last:border-0 ${
                  active === s.id ? "text-aqua" : "text-dim"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

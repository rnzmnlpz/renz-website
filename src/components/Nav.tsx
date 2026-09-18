"use client";

import { useEffect, useRef, useState } from "react";
import ProfileAvatar from "./ProfileAvatar";

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
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  // The panel is a disclosure, not a dialog — Escape closes it, focus is not trapped.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-rack/80 backdrop-blur-md" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 sm:px-8" aria-label="Primary">
        <ProfileAvatar />

        <div className="hidden items-center gap-8 md:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`press relative py-1 text-sm ${
                active === s.id ? "text-aqua" : "text-dim hover:text-signal"
              }`}
            >
              {s.label}
              <span
                aria-hidden
                className={`absolute inset-x-0 -bottom-px h-px origin-left bg-aqua transition-transform duration-[var(--t-state)] ease-[var(--ease-out-expo)] ${
                  active === s.id ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </a>
          ))}
        </div>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="press -mr-2 grid h-11 w-11 place-items-center text-signal md:hidden"
        >
          <svg
            viewBox="0 0 20 20"
            className={`h-4 w-4 transition-transform duration-[var(--t-state)] ease-[var(--ease-spring)] ${
              open ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
          >
            {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 13h14" />}
          </svg>
        </button>
      </nav>

      {/* Scroll position, driven entirely by CSS scroll-timeline. */}
      <div
        className="scroll-progress absolute inset-x-0 bottom-0 h-px bg-aqua"
        aria-hidden
      />

      {open && (
        <div
          id="mobile-nav"
          className="slide-in max-h-[calc(100dvh-5rem)] overflow-y-auto bg-rack/95 backdrop-blur-md md:hidden"
        >
          <div className="mx-auto flex max-w-5xl flex-col px-6 pb-4 sm:px-8">
            {SECTIONS.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${i * 35}ms` }}
                className={`slide-in press flex min-h-11 items-center border-b border-line/40 text-sm last:border-0 ${
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

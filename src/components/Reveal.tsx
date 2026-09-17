"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/* One observer serves every reveal on the page. Each element flips a data
   attribute and CSS does the rest, so nothing here triggers a React render. */
let observer: IntersectionObserver | null = null;

function sharedObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-reveal", "shown");
        observer?.unobserve(entry.target);
      }
    },
    /* No negative bottom margin: it excludes a band at the viewport bottom
       that elements near the end of the document can never clear, leaving
       them hidden permanently once the page stops scrolling. */
    { threshold: 0.1 },
  );
  return observer;
}

type Props = {
  children: ReactNode;
  /** Stagger against siblings, in milliseconds. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "p";
};

export default function Reveal({ children, delay = 0, className, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = sharedObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal="pending"
      style={delay ? ({ "--d": `${delay}ms` } as CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}

/** Splits a heading into words that lift out from behind a mask, one after the
    next. Only for headings below the fold — the h1 must paint immediately. */
export function SplitWords({ text, stagger = 40 }: { text: string; stagger?: number }) {
  const words = text.split(" ");

  return (
    <>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="word">
            <span style={{ "--d": `${i * stagger}ms` } as CSSProperties}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

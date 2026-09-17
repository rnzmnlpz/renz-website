"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { profile } from "@/lib/profile";

type Node = { id: string; x: number; y: number; label: string; sub: string };

const NODES: Node[] = [
  { id: "edge", x: 52, y: 152, label: "endpoint", sub: "user vlan" },
  { id: "core", x: 182, y: 152, label: "core-sw", sub: "l3 switch" },
  { id: "fw", x: 332, y: 84, label: "fortigate", sub: "ngfw" },
  { id: "srv", x: 332, y: 226, label: "srv-01", sub: "on-prem" },
  { id: "wan", x: 496, y: 84, label: "azure", sub: "cloud" },
];

const node = (id: string) => NODES.find((n) => n.id === id)!;

/** Links in negotiation order — each one lights the node it terminates at. */
const LINKS = [
  { from: "edge", to: "core", speed: "1G" },
  { from: "core", to: "fw", speed: "10G" },
  { from: "core", to: "srv", speed: "10G" },
  { from: "fw", to: "wan", speed: "1G" },
] as const;

function curve(a: Node, b: Node) {
  if (a.y === b.y) return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  const midX = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`;
}

const HOPS = ["edge", "core", "fw", "wan"].map(node);

const LINK_START = 0.5;
const LINK_STEP = 0.45;

function ManilaClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Manila",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums">{time ?? "--:--:--"} PHT</span>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();

  // With reduced motion the diagram renders already-converged.
  const drawn = reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 };

  return (
    <section id="top" className="relative overflow-hidden border-b border-line">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.55]" aria-hidden />
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-[0.10] blur-3xl"
        style={{ background: "radial-gradient(circle, #3fd0c9 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10 lg:pb-28 lg:pt-36">
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-dim"
          >
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-aqua" />
              </span>
              link up
            </span>
            <span>{profile.location}</span>
            <ManilaClock />
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-7 text-[clamp(2.6rem,7vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-balance"
          >
            Renz John
            <br />
            Manlapaz
          </motion.h1>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 flex items-center gap-3 font-mono text-sm text-aqua"
          >
            <span className="h-px w-8 bg-aqua/50" aria-hidden />
            Network Engineer
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-6 max-w-[54ch] text-lg leading-relaxed text-dim"
          >
            {profile.summary}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <a
              href="#lab"
              className="rounded-sm bg-aqua px-5 py-3 font-mono text-sm font-medium text-rack transition-colors hover:bg-aqua/85"
            >
              Open the lab
            </a>
            <a
              href="#contact"
              className="rounded-sm border border-line px-5 py-3 font-mono text-sm text-signal transition-colors hover:border-aqua/60 hover:text-aqua"
            >
              Get in touch
            </a>
          </motion.div>
        </div>

        <div className="relative">
          <figure className="rounded-md border border-line bg-panel/70 p-4 backdrop-blur-sm sm:p-6">
            <figcaption className="mb-4 flex items-center justify-between font-mono text-xs text-dim">
              <span>path to production</span>
              <span className="text-aqua">4 hops</span>
            </figcaption>

            {/* Compact vertical trace — the wide diagram is unreadable at phone width. */}
            <ol className="sm:hidden">
              {HOPS.map((hop, i) => (
                <li key={hop.id} className="relative pb-5 pl-6 last:pb-0">
                  {i < HOPS.length - 1 && (
                    <motion.span
                      className="absolute left-[3px] top-3 w-px bg-aqua/40"
                      initial={reduce ? false : { height: 0 }}
                      animate={{ height: "100%" }}
                      transition={reduce ? { duration: 0 } : { duration: 0.35, delay: LINK_START + i * LINK_STEP }}
                      aria-hidden
                    />
                  )}
                  <motion.span
                    className="absolute left-0 top-1.5 h-[7px] w-[7px] rounded-full bg-aqua"
                    initial={reduce ? false : { opacity: 0.25 }}
                    animate={{ opacity: 1 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.3, delay: LINK_START + i * LINK_STEP }}
                    aria-hidden
                  />
                  <span className="font-mono text-sm text-signal">{hop.label}</span>
                  <span className="ml-2 font-mono text-xs text-dim">{hop.sub}</span>
                </li>
              ))}
            </ol>

            <svg
              viewBox="0 45 560 225"
              className="hidden w-full sm:block"
              role="img"
              aria-label="Network path from an endpoint through a core switch and FortiGate firewall out to Azure, with an on-premises server branch."
            >
              {LINKS.map((link, i) => {
                const a = node(link.from);
                const b = node(link.to);
                const d = curve(a, b);
                const delay = LINK_START + i * LINK_STEP;
                return (
                  <g key={`${link.from}-${link.to}`}>
                    <path d={d} fill="none" stroke="#1b2e40" strokeWidth={1.5} />
                    <motion.path
                      d={d}
                      fill="none"
                      stroke="#3fd0c9"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      initial={reduce ? false : { pathLength: 0, opacity: 0.2 }}
                      animate={drawn}
                      transition={reduce ? { duration: 0 } : { duration: 0.55, delay, ease: "easeInOut" }}
                    />
                    <motion.text
                      x={(a.x + b.x) / 2}
                      y={(a.y + b.y) / 2 - 9}
                      textAnchor="middle"
                      className="fill-dim font-mono"
                      style={{ fontSize: 10 }}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={reduce ? { duration: 0 } : { duration: 0.3, delay: delay + 0.4 }}
                    >
                      {link.speed}
                    </motion.text>
                  </g>
                );
              })}

              {NODES.map((n) => {
                const linkIndex = LINKS.findIndex((l) => l.to === n.id);
                const delay = linkIndex === -1 ? LINK_START : LINK_START + linkIndex * LINK_STEP + 0.5;
                return (
                  <motion.g
                    key={n.id}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.35, delay }}
                  >
                    <rect
                      x={n.x - 36}
                      y={n.y - 19}
                      width={72}
                      height={38}
                      rx={3}
                      fill="#0c1620"
                      stroke="#1b2e40"
                      strokeWidth={1}
                    />
                    <motion.circle
                      cx={n.x - 26}
                      cy={n.y}
                      r={2.8}
                      fill="#3fd0c9"
                      initial={reduce ? false : { opacity: 0.25 }}
                      animate={reduce ? { opacity: 1 } : { opacity: [0.25, 1, 0.55, 1] }}
                      transition={reduce ? { duration: 0 } : { duration: 1.2, delay, times: [0, 0.3, 0.6, 1] }}
                    />
                    <text
                      x={n.x - 17}
                      y={n.y - 2}
                      className="fill-signal font-mono"
                      style={{ fontSize: 12 }}
                    >
                      {n.label}
                    </text>
                    <text
                      x={n.x - 17}
                      y={n.y + 11}
                      className="fill-dim font-mono"
                      style={{ fontSize: 9 }}
                    >
                      {n.sub}
                    </text>
                  </motion.g>
                );
              })}

              {/* Packet hopping the completed path — starts once negotiation finishes. */}
              {!reduce && (
                <motion.circle
                  r={3.5}
                  fill="#f0a33c"
                  initial={{ opacity: 0, cx: HOPS[0].x, cy: HOPS[0].y }}
                  animate={{
                    opacity: [0, 1, 1, 1, 1, 0],
                    cx: HOPS.map((h) => h.x).concat(HOPS[HOPS.length - 1].x, HOPS[0].x),
                    cy: HOPS.map((h) => h.y).concat(HOPS[HOPS.length - 1].y, HOPS[0].y),
                  }}
                  transition={{
                    duration: 3.4,
                    delay: LINK_START + LINKS.length * LINK_STEP + 0.4,
                    repeat: Infinity,
                    repeatDelay: 1.1,
                    ease: "easeInOut",
                    times: [0, 0.12, 0.4, 0.68, 0.92, 1],
                  }}
                />
              )}
            </svg>
          </figure>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/profile";

type Node = { id: string; x: number; y: number; label: string; sub: string };

const NODES: Node[] = [
  { id: "edge", x: 54, y: 150, label: "endpoint", sub: "user vlan" },
  { id: "core", x: 186, y: 150, label: "core-sw", sub: "l3 switch" },
  { id: "fw", x: 336, y: 82, label: "fortigate", sub: "ngfw" },
  { id: "srv", x: 336, y: 224, label: "srv-01", sub: "on-prem" },
  { id: "wan", x: 498, y: 82, label: "azure", sub: "cloud" },
];

const node = (id: string) => NODES.find((n) => n.id === id)!;

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

/* The route the packet travels, as one path for CSS offset-path. */
const ROUTE = `M ${HOPS[0].x} ${HOPS[0].y} L ${HOPS[1].x} ${HOPS[1].y} C ${
  (HOPS[1].x + HOPS[2].x) / 2
} ${HOPS[1].y}, ${(HOPS[1].x + HOPS[2].x) / 2} ${HOPS[2].y}, ${HOPS[2].x} ${HOPS[2].y} L ${
  HOPS[3].x
} ${HOPS[3].y}`;

function ManilaClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Manila",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time ?? "--:--"} in Manila</span>;
}

export default function Hero() {
  return (
    <section id="top" className="relative">
      <div className="mx-auto grid max-w-5xl gap-16 px-6 pb-24 pt-36 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:pb-36 lg:pt-44">
        <div>
          <p className="rise flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-faint">
            <span className="inline-flex items-center gap-2 text-aqua">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-aqua" />
              </span>
              available for work
            </span>
            <span>{profile.location}</span>
            <ManilaClock />
          </p>

          <h1
            className="rise mt-8 text-[clamp(2.75rem,8vw,5rem)] font-medium leading-[0.95] tracking-[-0.045em]"
            style={{ "--d": "60ms" } as React.CSSProperties}
          >
            Renz John
            <br />
            Manlapaz
          </h1>

          <p
            className="rise mt-7 max-w-[52ch] text-lg leading-relaxed text-dim sm:text-xl"
            style={{ "--d": "120ms" } as React.CSSProperties}
          >
            {profile.summary}
          </p>

          <div
            className="rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
            style={{ "--d": "180ms" } as React.CSSProperties}
          >
            <a
              href="#lab"
              className="lift press rounded-sm bg-signal px-5 py-3 text-sm font-medium text-rack hover:bg-aqua"
            >
              Run the tools
            </a>
            <a
              href="#contact"
              className="press link-underline text-sm text-signal hover:text-aqua"
            >
              Get in touch
            </a>
          </div>
        </div>

        <figure
          className="rise lg:w-[34rem]"
          style={{ "--d": "240ms" } as React.CSSProperties}
        >
          {/* The list is the accessible description; the diagram is decoration. */}
          <ol className="space-y-4 sm:sr-only">
            {HOPS.map((hop) => (
              <li key={hop.id} className="flex items-baseline gap-3 font-mono text-sm">
                <span className="h-1 w-1 shrink-0 translate-y-[-3px] rounded-full bg-aqua" aria-hidden />
                <span className="text-signal">{hop.label}</span>
                <span className="text-faint">{hop.sub}</span>
              </li>
            ))}
          </ol>

          <svg viewBox="0 40 560 230" className="hidden w-full sm:block" aria-hidden="true">
            {LINKS.map((link, i) => {
              const a = node(link.from);
              const b = node(link.to);
              return (
                <g key={`${link.from}-${link.to}`}>
                  <path
                    d={curve(a, b)}
                    pathLength={1}
                    fill="none"
                    stroke="#3fd0c9"
                    strokeWidth={1.25}
                    strokeLinecap="round"
                    className="link-draw"
                    style={{ "--d": `${400 + i * 160}ms` } as React.CSSProperties}
                  />
                  <text
                    x={(a.x + b.x) / 2}
                    y={(a.y + b.y) / 2 - 8}
                    textAnchor="middle"
                    className="fill-faint font-mono"
                    style={{ fontSize: 9.5 }}
                  >
                    {link.speed}
                  </text>
                </g>
              );
            })}

            {NODES.map((n) => (
              <g key={n.id}>
                <rect
                  x={n.x - 36}
                  y={n.y - 19}
                  width={72}
                  height={38}
                  rx={2}
                  fill="#0c1620"
                  stroke="#1b2e40"
                />
                <circle cx={n.x - 26} cy={n.y} r={2.5} fill="#3fd0c9" />
                <text x={n.x - 17} y={n.y - 2} className="fill-signal font-mono" style={{ fontSize: 11.5 }}>
                  {n.label}
                </text>
                <text x={n.x - 17} y={n.y + 11} className="fill-faint font-mono" style={{ fontSize: 8.5 }}>
                  {n.sub}
                </text>
              </g>
            ))}

            <circle r={3} fill="#f0a33c" className="packet" style={{ offsetPath: `path("${ROUTE}")` }} />
          </svg>
        </figure>
      </div>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { DEVICES, KIND_COLOR, LINKS, byId, linkPath } from "@/lib/topology";

export default function NetworkTopology() {
  const [selected, setSelected] = useState("fw");
  const reduce = useReducedMotion();
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const device = byId(selected);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = DEVICES.findIndex((d) => d.id === selected);
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % DEVICES.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + DEVICES.length) % DEVICES.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = DEVICES.length - 1;
    else return;

    e.preventDefault();
    const id = DEVICES[next].id;
    setSelected(id);
    chipRefs.current[id]?.focus();
  };

  return (
    <div>
      {/* Decoration: the radiogroup below is the real control. */}
      <svg viewBox="0 0 840 520" className="hidden w-full md:block" aria-hidden="true">
        {LINKS.map((link) => {
          const lit = link.from === selected || link.to === selected;
          return (
            <path
              key={`${link.from}-${link.to}`}
              d={linkPath(byId(link.from), byId(link.to))}
              fill="none"
              stroke={lit ? "#3fd0c9" : "#1b2e40"}
              strokeWidth={lit ? 1.6 : 1}
              strokeDasharray={link.tunnel ? "5 4" : undefined}
              className="transition-[stroke] duration-300"
            />
          );
        })}

        {DEVICES.map((d) => {
          const isSelected = d.id === selected;
          return (
            <g key={d.id} onClick={() => setSelected(d.id)} className="cursor-pointer">
              <rect
                x={d.x - 66}
                y={d.y - 22}
                width={132}
                height={44}
                rx={2}
                fill={isSelected ? "#122232" : "#0c1620"}
                stroke={isSelected ? "#3fd0c9" : "#1b2e40"}
                className="transition-[fill,stroke] duration-200"
              />
              <circle cx={d.x - 54} cy={d.y} r={2.5} fill={KIND_COLOR[d.kind]} opacity={isSelected ? 1 : 0.6} />
              <text x={d.x - 44} y={d.y - 3} className="fill-signal font-mono" style={{ fontSize: 11.5 }}>
                {d.label}
              </text>
              <text x={d.x - 44} y={d.y + 11} className="fill-faint font-mono" style={{ fontSize: 8.5 }}>
                {d.model}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        role="radiogroup"
        aria-label="Network devices"
        onKeyDown={onKeyDown}
        className="mt-0 grid grid-cols-2 gap-2 md:mt-10 md:flex md:flex-wrap"
      >
        {DEVICES.map((d) => {
          const isSelected = d.id === selected;
          return (
            <button
              key={d.id}
              ref={(el) => {
                chipRefs.current[d.id] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelected(d.id)}
              className={`press flex min-h-11 items-center gap-2 border px-3 font-mono text-xs ${
                isSelected ? "border-aqua text-aqua" : "border-control text-dim hover:border-aqua hover:text-signal"
              }`}
            >
              <span className="h-1.5 w-1.5 shrink-0" style={{ background: KIND_COLOR[d.kind] }} aria-hidden />
              <span translate="no">{d.label}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={device.id}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.25 }}
        className="mt-10 border-t border-line pt-6"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <h3 className="font-mono text-sm text-signal">{device.label}</h3>
          <span className="font-mono text-xs text-faint">{device.zone}</span>
        </div>

        <p className="mt-4 max-w-[68ch] leading-relaxed text-dim">{device.detail}</p>

        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {device.facts.map((fact) => (
            <li key={fact} className="font-mono text-xs leading-relaxed text-dim">
              {fact}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

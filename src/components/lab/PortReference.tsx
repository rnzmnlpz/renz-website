"use client";

import { useMemo, useState } from "react";
import { ports, riskLabel, type Risk } from "@/lib/ports";

const CATEGORIES = ["All", ...Array.from(new Set(ports.map((p) => p.category)))];

const RISK_STYLE: Record<Risk, string> = {
  low: "text-aqua",
  watch: "text-amber",
  high: "text-alert",
};

const RISK_GLYPH: Record<Risk, string> = {
  low: "●",
  watch: "◆",
  high: "▲",
};

export default function PortReference() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ports.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery =
        !q ||
        p.port.includes(q) ||
        p.service.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="sm:w-72">
          <label htmlFor="port-search" className="font-mono text-xs text-dim">
            search
          </label>
          <input
            id="port-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="rdp, 445, ldap…"
            spellCheck={false}
            className="mt-2 w-full rounded-sm border border-line bg-rack px-3.5 py-2.5 font-mono text-sm text-signal outline-none transition-colors placeholder:text-dim/50 focus:border-aqua"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-sm border px-3 py-2 font-mono text-xs transition-colors ${
                category === c
                  ? "border-aqua/60 text-aqua"
                  : "border-line text-dim hover:border-aqua/40 hover:text-signal"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 font-mono text-xs text-dim" aria-live="polite">
        {filtered.length} of {ports.length} entries
      </p>

      {/* Table — md and up */}
      <div className="mt-4 hidden overflow-hidden rounded-md border border-line md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-panel">
              <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-dim">Port</th>
              <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-dim">Proto</th>
              <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-dim">Service</th>
              <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-dim">Posture</th>
              <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-dim">Why it matters</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={`${p.port}-${p.service}`} className="border-t border-line align-top">
                <td className="whitespace-nowrap px-4 py-3.5 font-mono text-sm tabular-nums text-signal">{p.port}</td>
                <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-dim">{p.proto}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-signal">{p.service}</td>
                <td className={`whitespace-nowrap px-4 py-3.5 font-mono text-xs ${RISK_STYLE[p.risk]}`}>
                  <span aria-hidden>{RISK_GLYPH[p.risk]}</span> {riskLabel[p.risk]}
                </td>
                <td className="px-4 py-3.5 text-sm leading-relaxed text-dim">{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards — small screens */}
      <ul className="mt-4 space-y-3 md:hidden">
        {filtered.map((p) => (
          <li key={`${p.port}-${p.service}`} className="rounded-md border border-line bg-panel p-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-sm tabular-nums text-signal">{p.port}</span>
              <span className="font-mono text-xs text-dim">{p.proto}</span>
              <span className="text-sm text-signal">{p.service}</span>
              <span className={`ml-auto font-mono text-xs ${RISK_STYLE[p.risk]}`}>
                <span aria-hidden>{RISK_GLYPH[p.risk]}</span> {riskLabel[p.risk]}
              </span>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-dim">{p.note}</p>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-8 rounded-md border border-line bg-panel px-4 py-8 text-center text-sm text-dim">
          Nothing matches that. Try a port number, a service name, or clear the filter.
        </p>
      )}
    </div>
  );
}

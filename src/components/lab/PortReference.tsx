"use client";

import { useMemo, useState } from "react";
import { ports, riskLabel, type PortEntry, type Risk } from "@/lib/ports";

const CATEGORIES = ["All", ...Array.from(new Set(ports.map((p) => p.category)))];

const RISK_STYLE: Record<Risk, string> = {
  low: "text-aqua",
  watch: "text-amber",
  high: "text-alert",
};

const RISK_GLYPH: Record<Risk, string> = { low: "●", watch: "◆", high: "▲" };

/** "137-139" should match a search for 138. */
function matchesPort(entry: PortEntry, query: string) {
  if (entry.port.includes(query)) return true;
  const n = Number(query);
  if (!Number.isInteger(n)) return false;
  const [start, end] = entry.port.split("-").map(Number);
  return end === undefined ? start === n : n >= start && n <= end;
}

export default function PortReference() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ports.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery =
        !q ||
        matchesPort(p, q) ||
        p.service.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="sm:w-64">
          <label htmlFor="port-search" className="font-mono text-xs text-faint">
            search
          </label>
          <input
            id="port-search"
            name="port-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="rdp, 445, ldap…"
            spellCheck={false}
            autoComplete="off"
            translate="no"
            className="mt-2 w-full border-b border-control bg-transparent pb-2.5 font-mono text-base text-signal outline-none transition-colors placeholder:text-faint focus:border-aqua"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`press min-h-11 border px-3 font-mono text-xs ${
                category === c
                  ? "border-aqua text-aqua"
                  : "border-control text-dim hover:border-aqua hover:text-signal"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 font-mono text-xs text-faint" aria-live="polite">
        <span key={filtered.length} className="flash inline-block">
          {filtered.length} of {ports.length} entries
        </span>
      </p>

      {/* Table — md and up */}
      <div
        className="mt-4 hidden overflow-x-auto md:block"
        tabIndex={0}
        role="region"
        aria-label="Port reference table"
      >
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-3 pr-6 font-mono text-xs font-normal text-faint">Port</th>
              <th scope="col" className="py-3 pr-6 font-mono text-xs font-normal text-faint">Proto</th>
              <th scope="col" className="py-3 pr-6 font-mono text-xs font-normal text-faint">Service</th>
              <th scope="col" className="py-3 pr-6 font-mono text-xs font-normal text-faint">Posture</th>
              <th scope="col" className="py-3 font-mono text-xs font-normal text-faint">Why it matters</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={`${p.port}-${p.service}`} className="border-b border-line align-top last:border-0">
                <td translate="no" className="whitespace-nowrap py-4 pr-6 font-mono text-sm tabular-nums text-signal">
                  {p.port}
                </td>
                <td translate="no" className="whitespace-nowrap py-4 pr-6 font-mono text-xs text-faint">
                  {p.proto}
                </td>
                <td translate="no" className="whitespace-nowrap py-4 pr-6 text-sm text-signal">
                  {p.service}
                </td>
                <td className={`whitespace-nowrap py-4 pr-6 font-mono text-xs ${RISK_STYLE[p.risk]}`}>
                  <span aria-hidden>{RISK_GLYPH[p.risk]}</span> {riskLabel[p.risk]}
                </td>
                <td className="py-4 text-sm leading-relaxed text-dim">{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards — small screens */}
      <ul className="mt-4 md:hidden">
        {filtered.map((p) => (
          <li key={`${p.port}-${p.service}`} className="border-b border-line py-5 last:border-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-sm tabular-nums text-signal">{p.port}</span>
              <span className="font-mono text-xs text-faint">{p.proto}</span>
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
        <p className="mt-10 text-sm text-dim">
          Nothing matches that. Try a port number, a service name, or clear the filter.
        </p>
      )}
    </div>
  );
}

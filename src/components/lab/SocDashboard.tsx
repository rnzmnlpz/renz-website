"use client";

import { useEffect, useRef, useState } from "react";

type Severity = "critical" | "warning" | "healthy";

const SEVERITY: Record<Severity, { label: string; color: string; glyph: string }> = {
  critical: { label: "Critical", color: "#ff5c6c", glyph: "▲" },
  warning: { label: "Warning", color: "#f0a33c", glyph: "◆" },
  healthy: { label: "Resolved", color: "#3fd0c9", glyph: "●" },
};

type Event = { t: string; severity: Severity; source: string; message: string };

/* Pre-baked so the server and client render identical markup on first paint. */
const INITIAL: Event[] = [
  { t: "09:42:18", severity: "critical", source: "FortiGate", message: "Brute force on SSL VPN — 214 attempts from one ASN, source blocked" },
  { t: "09:41:02", severity: "warning", source: "Carbon Black", message: "Unsigned binary executed on FIN-WS-14, quarantined for review" },
  { t: "09:38:55", severity: "healthy", source: "Intune", message: "FIN-WS-09 returned to compliant after disk encryption completed" },
  { t: "09:36:11", severity: "warning", source: "Entra ID", message: "Impossible travel flagged for a finance account, MFA re-challenged" },
  { t: "09:33:47", severity: "healthy", source: "Core switch", message: "Uplink Gi1/0/49 recovered, LACP bundle back to 20G" },
];

const POOL: Omit<Event, "t">[] = [
  { severity: "warning", source: "FortiGate", message: "Outbound connection to a newly registered domain blocked by web filter" },
  { severity: "healthy", source: "Intune", message: "Device compliance sweep finished — 3 endpoints remediated automatically" },
  { severity: "critical", source: "Carbon Black", message: "Credential dumping behaviour detected on a workstation, host isolated" },
  { severity: "warning", source: "Meraki", message: "Rogue SSID broadcasting the corporate name near the ground floor" },
  { severity: "healthy", source: "Azure", message: "Site-to-site tunnel renegotiated cleanly after scheduled key rotation" },
  { severity: "warning", source: "srv-01", message: "DHCP scope on VLAN 10 crossed 85% utilisation" },
  { severity: "critical", source: "FortiGate", message: "Port scan across the server VLAN from an internal host, port shut" },
  { severity: "healthy", source: "MDM", message: "Lost handset wiped remotely and removed from the fleet" },
];

const KPIS = [
  { label: "Endpoints managed", value: "312", note: "Intune + MDM" },
  { label: "Blocked today", value: "1,847", note: "perimeter drops" },
  { label: "Open alerts", value: "4", note: "1 critical" },
  { label: "Mean time to fix", value: "18m", note: "last 30 days" },
];

const COMPLIANCE = [
  { label: "Compliant", value: 287, color: "#3fd0c9" },
  { label: "In grace period", value: 19, color: "#f0a33c" },
  { label: "Non-compliant", value: 6, color: "#ff5c6c" },
];

const RULES = [
  { rule: "deny-inbound-any", hits: 1204 },
  { rule: "block-tor-exit", hits: 486 },
  { rule: "web-filter-newly-seen", hits: 341 },
  { rule: "geo-block-high-risk", hits: 208 },
  { rule: "deny-smb-egress", hits: 97 },
];

const TOTAL_ENDPOINTS = COMPLIANCE.reduce((sum, s) => sum + s.value, 0);
const MAX_HITS = Math.max(...RULES.map((r) => r.hits));

export default function SocDashboard() {
  const [events, setEvents] = useState<Event[]>(INITIAL);
  const cursor = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const next = POOL[cursor.current % POOL.length];
      cursor.current += 1;
      const t = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Manila",
      }).format(new Date());
      setEvents((prev) => [{ ...next, t }, ...prev].slice(0, 7));
    }, 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <p className="mb-6 inline-flex items-center gap-2 rounded-sm border border-amber/30 bg-amber/5 px-3 py-1.5 font-mono text-xs text-amber">
        Simulated data — a working model of the consoles I run, not a live feed
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="rounded-md border border-line bg-panel p-5">
            <p className="font-mono text-xs text-dim">{kpi.label}</p>
            <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-signal">{kpi.value}</p>
            <p className="mt-1 font-mono text-[0.68rem] text-dim">{kpi.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-line bg-panel p-5 sm:p-6">
          <h4 className="font-mono text-sm text-signal">Endpoint compliance</h4>
          <p className="mt-1 font-mono text-xs text-dim">{TOTAL_ENDPOINTS} enrolled devices</p>

          <div className="mt-5 flex h-3 w-full gap-0.5 overflow-hidden rounded-sm" role="img" aria-label={COMPLIANCE.map((s) => `${s.label} ${s.value}`).join(", ")}>
            {COMPLIANCE.map((seg) => (
              <div
                key={seg.label}
                style={{ width: `${(seg.value / TOTAL_ENDPOINTS) * 100}%`, background: seg.color }}
                className="first:rounded-l-sm last:rounded-r-sm"
              />
            ))}
          </div>

          <ul className="mt-5 space-y-2.5">
            {COMPLIANCE.map((seg) => (
              <li key={seg.label} className="flex items-center gap-2.5 text-sm">
                <span className="h-2 w-2 shrink-0 rounded-[2px]" style={{ background: seg.color }} aria-hidden />
                <span className="text-dim">{seg.label}</span>
                <span className="ml-auto font-mono tabular-nums text-signal">{seg.value}</span>
                <span className="w-12 text-right font-mono text-xs tabular-nums text-dim">
                  {((seg.value / TOTAL_ENDPOINTS) * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-line bg-panel p-5 sm:p-6">
          <h4 className="font-mono text-sm text-signal">Firewall rules by hit count</h4>
          <p className="mt-1 font-mono text-xs text-dim">last 24 hours</p>

          <ul className="mt-5 space-y-4">
            {RULES.map((r) => (
              <li key={r.rule}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-xs text-signal">{r.rule}</span>
                  <span className="font-mono text-xs tabular-nums text-dim">{r.hits.toLocaleString("en-US")}</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-sm bg-rack">
                  <div
                    className="h-1.5 rounded-sm bg-aqua"
                    style={{ width: `${(r.hits / MAX_HITS) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-line bg-panel p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-sm text-signal">Event feed</h4>
          <span className="inline-flex items-center gap-2 font-mono text-xs text-dim">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aqua" aria-hidden />
            streaming
          </span>
        </div>

        <ul className="mt-5 divide-y divide-line/60" aria-live="polite">
          {events.map((e, i) => {
            const s = SEVERITY[e.severity];
            return (
              <li key={`${e.t}-${i}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3 sm:flex-nowrap">
                <span className="font-mono text-xs tabular-nums text-dim">{e.t}</span>
                <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs" style={{ color: s.color }}>
                  <span aria-hidden>{s.glyph}</span>
                  {s.label}
                </span>
                <span className="shrink-0 font-mono text-xs text-dim">{e.source}</span>
                <span className="w-full text-sm leading-relaxed text-signal sm:w-auto sm:flex-1">{e.message}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

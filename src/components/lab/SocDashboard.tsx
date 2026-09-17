"use client";

import { useEffect, useRef, useState } from "react";

type Severity = "critical" | "warning" | "healthy";

const SEVERITY: Record<Severity, { label: string; color: string; glyph: string }> = {
  critical: { label: "Critical", color: "#ff5c6c", glyph: "▲" },
  warning: { label: "Warning", color: "#f0a33c", glyph: "◆" },
  healthy: { label: "Resolved", color: "#3fd0c9", glyph: "●" },
};

type Event = { id: number; at: number; severity: Severity; source: string; message: string };

/* The feed runs on its own simulated clock so timestamps stay monotonic and
   the server and client render identical markup. */
const START = 9 * 3600 + 42 * 60 + 18;
const GAP = 37;

const TIME = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

/** Seconds since midnight, formatted through Intl and pinned to UTC so the
    simulated clock renders identically on the server and the client. */
function clock(seconds: number) {
  return TIME.format(new Date((seconds % 86400) * 1000));
}

const SEED: Pick<Event, "severity" | "source" | "message">[] = [
  { severity: "critical", source: "FortiGate", message: "Brute force on SSL VPN, 214 attempts from one ASN, source blocked" },
  { severity: "warning", source: "Carbon Black", message: "Unsigned binary executed on FIN-WS-14, quarantined for review" },
  { severity: "healthy", source: "Intune", message: "FIN-WS-09 returned to compliant after disk encryption completed" },
  { severity: "warning", source: "Entra ID", message: "Impossible travel flagged for a finance account, MFA re-challenged" },
  { severity: "healthy", source: "Core switch", message: "Uplink Gi1/0/49 recovered, LACP bundle back to 20G" },
];

const INITIAL: Event[] = SEED.map((e, i) => ({ ...e, id: -i, at: START - i * GAP }));

const POOL: Pick<Event, "severity" | "source" | "message">[] = [
  { severity: "warning", source: "FortiGate", message: "Outbound connection to a newly registered domain blocked by web filter" },
  { severity: "healthy", source: "Intune", message: "Device compliance sweep finished, 3 endpoints remediated automatically" },
  { severity: "critical", source: "Carbon Black", message: "Credential dumping behaviour detected on a workstation, host isolated" },
  { severity: "warning", source: "Meraki", message: "Rogue SSID broadcasting the corporate name near the ground floor" },
  { severity: "healthy", source: "Azure", message: "Site-to-site tunnel renegotiated cleanly after scheduled key rotation" },
  { severity: "warning", source: "srv-01", message: "DHCP scope on VLAN 10 crossed 85% utilisation" },
  { severity: "critical", source: "FortiGate", message: "Port scan across the server VLAN from an internal host, port shut" },
  { severity: "healthy", source: "MDM", message: "Lost handset wiped remotely and removed from the fleet" },
];

const KPIS = [
  { label: "Endpoints managed", value: 312, suffix: "", note: "Intune + MDM" },
  { label: "Blocked today", value: 1847, suffix: "", note: "perimeter drops" },
  { label: "Open alerts", value: 4, suffix: "", note: "1 critical" },
  { label: "Mean time to fix", value: 18, suffix: "m", note: "last 30 days" },
];

/* Counts up once, when the tile first scrolls into view. Writes straight to
   the node — putting the tween in state would re-render the dashboard on
   every frame. Renders the final value on the server so the figure is right
   with JavaScript disabled. */
function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const started = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - started) / 900, 1);
          const eased = 1 - (1 - progress) ** 3;
          el.textContent = Math.round(to * eased).toLocaleString("en-US") + suffix;
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, suffix]);

  return (
    <span ref={ref}>
      {to.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

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

const TOTAL = COMPLIANCE.reduce((sum, s) => sum + s.value, 0);
const MAX_HITS = Math.max(...RULES.map((r) => r.hits));

export default function SocDashboard() {
  const [events, setEvents] = useState<Event[]>(INITIAL);
  const [running, setRunning] = useState(true);
  const cursor = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setEvents((prev) => {
        const next = POOL[cursor.current % POOL.length];
        cursor.current += 1;
        const event: Event = { ...next, id: cursor.current, at: prev[0].at + GAP };
        return [event, ...prev].slice(0, 7);
      });
    }, 4200);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div>
      <p className="font-mono text-xs text-amber">Simulated data, not a live feed</p>

      <div className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="border-t border-line pt-5">
            <p className="font-mono text-xs text-faint">{kpi.label}</p>
            <p className="mt-3 text-4xl font-medium tabular-nums tracking-tight text-signal">
              <CountUp to={kpi.value} suffix={kpi.suffix} />
            </p>
            <p className="mt-1 font-mono text-xs text-faint">{kpi.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-x-16 gap-y-12 lg:grid-cols-2">
        <div className="border-t border-line pt-6">
          <h3 className="font-mono text-sm text-aqua">Endpoint compliance</h3>
          <p className="mt-1.5 font-mono text-xs text-faint">{TOTAL} enrolled devices</p>

          <div
            className="mt-6 flex h-2 w-full gap-0.5"
            role="img"
            aria-label={COMPLIANCE.map((s) => `${s.label} ${s.value}`).join(", ")}
          >
            {COMPLIANCE.map((seg, i) => (
              <div
                key={seg.label}
                className="bar-grow"
                style={{
                  width: `${(seg.value / TOTAL) * 100}%`,
                  background: seg.color,
                  animationDelay: `${i * 120}ms`,
                }}
              />
            ))}
          </div>

          <ul className="mt-6 space-y-3">
            {COMPLIANCE.map((seg) => (
              <li key={seg.label} className="flex items-center gap-3 text-sm">
                <span className="h-1.5 w-1.5 shrink-0" style={{ background: seg.color }} aria-hidden />
                <span className="text-dim">{seg.label}</span>
                <span className="ml-auto font-mono tabular-nums text-signal">{seg.value}</span>
                <span className="w-12 text-right font-mono text-xs tabular-nums text-faint">
                  {((seg.value / TOTAL) * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-line pt-6">
          <h3 className="font-mono text-sm text-aqua">Firewall rules by hit count</h3>
          <p className="mt-1.5 font-mono text-xs text-faint">last 24 hours</p>

          <ul className="mt-6 space-y-5">
            {RULES.map((r, i) => (
              <li key={r.rule}>
                <div className="flex items-baseline justify-between gap-3">
                  <span translate="no" className="font-mono text-xs text-signal">
                    {r.rule}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-faint">
                    {r.hits.toLocaleString("en-US")}
                  </span>
                </div>
                <div className="mt-2 h-1 w-full bg-panel">
                  <div
                    className="bar-grow h-1 bg-aqua"
                    style={{ width: `${(r.hits / MAX_HITS) * 100}%`, animationDelay: `${i * 90}ms` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16 border-t border-line pt-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-mono text-sm text-aqua">Event feed</h3>
          <button
            type="button"
            onClick={() => setRunning((v) => !v)}
            className="press min-h-11 border border-control px-4 font-mono text-xs text-dim hover:border-aqua hover:text-aqua"
          >
            <span key={String(running)} className="slide-in inline-block">
              {running ? "Pause feed" : "Resume feed"}
            </span>
          </button>
        </div>

        <ul className="mt-4">
          {events.map((e) => {
            const s = SEVERITY[e.severity];
            // Only a freshly mounted row animates; stable keys keep the rest
            // still as the list shifts down.
            return (
              <li
                key={e.id}
                className="slide-in flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line py-3.5 last:border-0 sm:flex-nowrap"
              >
                <span className="font-mono text-xs tabular-nums text-faint">{clock(e.at)}</span>
                <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs" style={{ color: s.color }}>
                  <span aria-hidden>{s.glyph}</span>
                  {s.label}
                </span>
                <span className="shrink-0 font-mono text-xs text-faint">{e.source}</span>
                <span className="w-full min-w-0 text-sm leading-relaxed text-dim sm:w-auto sm:flex-1">
                  {e.message}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

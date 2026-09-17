"use client";

import { useMemo, useState } from "react";
import { formatCount, parseSubnet } from "@/lib/subnet";

const PRESETS = ["192.168.10.42/24", "10.20.0.0/16", "172.16.5.1/20", "203.0.113.9/30", "10.0.0.1/31"];

function Row({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line/60 py-2.5 last:border-0">
      <dt className="font-mono text-xs text-dim">{label}</dt>
      <dd className={`text-right text-sm text-signal ${mono ? "font-mono tabular-nums" : ""}`}>{value}</dd>
    </div>
  );
}

export default function SubnetCalculator() {
  const [input, setInput] = useState("192.168.10.42/24");
  const result = useMemo(() => parseSubnet(input), [input]);
  const invalid = input.trim().length > 0 && !result;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div>
        <label htmlFor="cidr" className="font-mono text-xs text-dim">
          address / prefix
        </label>
        <input
          id="cidr"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={invalid}
          aria-describedby={invalid ? "cidr-error" : undefined}
          placeholder="192.168.1.0/24"
          className={`mt-2 w-full rounded-sm border bg-rack px-4 py-3 font-mono text-base text-signal outline-none transition-colors placeholder:text-dim/50 ${
            invalid ? "border-alert focus:border-alert" : "border-line focus:border-aqua"
          }`}
        />

        {invalid && (
          <p id="cidr-error" role="alert" className="mt-2 font-mono text-xs text-alert">
            Enter an IPv4 address with a prefix or mask, like 10.0.0.1/24.
          </p>
        )}

        <p className="mt-6 font-mono text-xs text-dim">try</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setInput(preset)}
              className={`rounded-sm border px-2.5 py-1.5 font-mono text-xs transition-colors ${
                input === preset
                  ? "border-aqua/60 text-aqua"
                  : "border-line text-dim hover:border-aqua/40 hover:text-signal"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        {result && (
          <div className="mt-8 rounded-sm border border-line bg-rack p-4">
            <p className="font-mono text-xs text-dim">mask in binary</p>
            <p className="mt-2 break-all font-mono text-sm leading-relaxed">
              {result.binaryMask.split(".").map((octet, i) => (
                <span key={i}>
                  {octet.split("").map((bit, j) => (
                    <span key={j} className={bit === "1" ? "text-aqua" : "text-dim/60"}>
                      {bit}
                    </span>
                  ))}
                  {i < 3 && <span className="text-dim/40">.</span>}
                </span>
              ))}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-dim">
              {result.prefix} network bits, {32 - result.prefix} host bits.
            </p>
          </div>
        )}
      </div>

      {result && (
        <div className="rounded-md border border-line bg-rack/60 p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-sm bg-aqua/10 px-2.5 py-1 font-mono text-xs text-aqua">
              /{result.prefix}
            </span>
            <span
              className={`rounded-sm px-2.5 py-1 font-mono text-xs ${
                result.scope === "Private"
                  ? "bg-aqua/10 text-aqua"
                  : result.scope === "Public"
                    ? "bg-amber/10 text-amber"
                    : "bg-dim/10 text-dim"
              }`}
            >
              {result.scope}
            </span>
            <span className="font-mono text-xs text-dim">
              {formatCount(result.usableHosts)} usable
            </span>
          </div>

          <dl>
            <Row label="network" value={result.network} />
            <Row label="broadcast" value={result.broadcast} />
            <Row label="first host" value={result.firstHost} />
            <Row label="last host" value={result.lastHost} />
            <Row label="netmask" value={result.netmask} />
            <Row label="wildcard" value={result.wildcard} />
            <Row label="total addresses" value={formatCount(result.totalAddresses)} />
            <Row label="usable hosts" value={formatCount(result.usableHosts)} />
          </dl>

          {result.prefix >= 31 && (
            <p className="mt-5 border-l-2 border-amber pl-3 text-xs leading-relaxed text-dim">
              {result.prefix === 31
                ? "A /31 carries no network or broadcast address — RFC 3021 gives both addresses to the link, which is why point-to-point WAN interfaces use it."
                : "A /32 is a single host route. Common for loopbacks and for pinning a policy to one address."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

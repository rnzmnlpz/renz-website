"use client";

import { useMemo, useState } from "react";
import { formatCount, parseSubnet } from "@/lib/subnet";

const PRESETS = ["192.168.10.42/24", "10.20.0.0/16", "172.16.5.1/20", "203.0.113.9/30", "10.0.0.1/31"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-0">
      <dt className="font-mono text-xs text-faint">{label}</dt>
      <dd className="font-mono text-sm tabular-nums text-signal">{value}</dd>
    </div>
  );
}

export default function SubnetCalculator() {
  const [input, setInput] = useState("192.168.10.42/24");
  const result = useMemo(() => parseSubnet(input), [input]);
  const invalid = input.trim().length > 0 && !result;

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <label htmlFor="cidr" className="font-mono text-xs text-faint">
          address / prefix
        </label>
        <input
          id="cidr"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={invalid}
          aria-describedby="cidr-status"
          placeholder="192.168.1.0/24"
          className={`mt-2 w-full border-b bg-transparent pb-3 font-mono text-xl text-signal outline-none transition-colors placeholder:text-faint ${
            invalid ? "border-alert" : "border-control focus:border-aqua"
          }`}
        />

        <p id="cidr-status" role="status" className="mt-3 min-h-5 font-mono text-xs text-alert">
          {invalid ? "Enter an IPv4 address with a prefix or mask, like 10.0.0.1/24." : ""}
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setInput(preset)}
              className={`min-h-11 border px-3 font-mono text-xs transition-colors ${
                input === preset
                  ? "border-aqua text-aqua"
                  : "border-control text-dim hover:border-aqua hover:text-signal"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        {result && (
          <div className="mt-10">
            <p className="font-mono text-xs text-faint">mask in binary</p>
            <p className="mt-3 break-all font-mono text-sm leading-relaxed">
              {result.binaryMask.split(".").map((octet, i) => (
                <span key={i}>
                  {octet.split("").map((bit, j) => (
                    <span key={j} className={bit === "1" ? "font-semibold text-aqua" : "text-faint"}>
                      {bit}
                    </span>
                  ))}
                  {i < 3 && <span className="text-faint">.</span>}
                </span>
              ))}
            </p>
            <p className="mt-3 text-sm text-dim">
              {result.prefix} network bits, {32 - result.prefix} host bits.
            </p>
          </div>
        )}
      </div>

      {result && (
        <div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line pb-4 font-mono text-xs">
            <span className="text-aqua">/{result.prefix}</span>
            <span className={result.scope === "Public" ? "text-amber" : "text-dim"}>{result.scope}</span>
            <span className="text-dim">{formatCount(result.usableHosts)} usable</span>
          </div>

          <dl className="mt-2">
            <Row label="network" value={result.network} />
            <Row label="broadcast" value={result.broadcast} />
            <Row label="first host" value={result.firstHost} />
            <Row label="last host" value={result.lastHost} />
            <Row label="netmask" value={result.netmask} />
            <Row label="wildcard" value={result.wildcard} />
            <Row label="total addresses" value={formatCount(result.totalAddresses)} />
          </dl>

          {result.prefix >= 31 && (
            <p className="mt-6 border-l border-amber pl-4 text-sm leading-relaxed text-dim">
              {result.prefix === 31
                ? "A /31 carries no network or broadcast address. RFC 3021 gives both addresses to the link, which is why point-to-point WAN interfaces use it."
                : "A /32 is a single host route. Common for loopbacks and for pinning a policy to one address."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

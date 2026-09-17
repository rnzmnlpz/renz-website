"use client";

import { motion } from "motion/react";
import { useState } from "react";

type Device = {
  id: string;
  label: string;
  model: string;
  x: number;
  y: number;
  kind: "edge" | "core" | "access" | "endpoint" | "cloud";
  zone: string;
  detail: string;
  facts: string[];
};

const DEVICES: Device[] = [
  {
    id: "wan",
    label: "Internet",
    model: "Dual ISP, BGP failover",
    x: 420,
    y: 44,
    kind: "cloud",
    zone: "Untrusted",
    detail: "Two carriers terminating on the firewall, with the secondary held as a warm standby.",
    facts: ["Primary fibre + LTE backup", "Health-checked failover", "Public /29 on the primary"],
  },
  {
    id: "fw",
    label: "FortiGate",
    model: "NGFW — perimeter",
    x: 420,
    y: 140,
    kind: "edge",
    zone: "Perimeter",
    detail:
      "Every policy decision happens here. Inter-VLAN routing is deliberately kept on the firewall so traffic between zones is inspected rather than merely switched.",
    facts: ["Deny-by-default policy base", "IPS and web filtering on egress", "SSL VPN for remote staff", "Site-to-site IPsec to Azure"],
  },
  {
    id: "core",
    label: "Core switch",
    model: "L3 distribution",
    x: 420,
    y: 248,
    kind: "core",
    zone: "Trusted",
    detail: "Layer 3 distribution with per-VLAN SVIs. Uplinks are aggregated so a single fibre cut does not take the floor down.",
    facts: ["LACP uplinks", "Spanning-tree root", "DHCP relay to the server VLAN", "Port security on access ports"],
  },
  {
    id: "swa",
    label: "Access — users",
    model: "VLAN 10",
    x: 180,
    y: 360,
    kind: "access",
    zone: "VLAN 10",
    detail: "Staff workstations. The largest and least trusted internal segment, so it gets the tightest egress policy.",
    facts: ["802.1X where supported", "DHCP snooping enabled", "No route to the management VLAN"],
  },
  {
    id: "swb",
    label: "Access — servers",
    model: "VLAN 20",
    x: 420,
    y: 360,
    kind: "access",
    zone: "VLAN 20",
    detail: "Server segment. Reachable only on the ports the applications actually need.",
    facts: ["Static addressing", "Inbound filtered per service", "Backup traffic on a separate window"],
  },
  {
    id: "ap",
    label: "UniFi APs",
    model: "VLAN 30 / guest",
    x: 660,
    y: 360,
    kind: "access",
    zone: "VLAN 30",
    detail: "Wireless coverage with corporate and guest SSIDs. Guest traffic is isolated and sent straight out the firewall.",
    facts: ["Guest client isolation", "Corporate SSID on VLAN 10", "Band steering and min-RSSI tuned"],
  },
  {
    id: "pc",
    label: "Workstations",
    model: "Intune managed",
    x: 180,
    y: 462,
    kind: "endpoint",
    zone: "VLAN 10",
    detail: "Enrolled in Intune with compliance policies, and monitored by Carbon Black for endpoint detection.",
    facts: ["Disk encryption enforced", "Compliance gates conditional access", "EDR agent reporting to the console"],
  },
  {
    id: "srv",
    label: "srv-01",
    model: "AD DS · DNS · DHCP",
    x: 420,
    y: 462,
    kind: "endpoint",
    zone: "VLAN 20",
    detail: "Windows Server running directory, name resolution and addressing — the three services whose failure looks like 'the internet is down'.",
    facts: ["AD DS with a second domain controller", "DNS forwarders to a filtered resolver", "Runs on VMware with snapshots before change"],
  },
  {
    id: "wifi",
    label: "Mobile fleet",
    model: "MDM enrolled",
    x: 660,
    y: 462,
    kind: "endpoint",
    zone: "VLAN 30",
    detail: "Phones and tablets under mobile device management, kept off the corporate segment entirely.",
    facts: ["Remote wipe available", "App allowlist", "Certificate-based Wi-Fi auth"],
  },
  {
    id: "azure",
    label: "Azure",
    model: "IPsec tunnel",
    x: 706,
    y: 140,
    kind: "cloud",
    zone: "Cloud",
    detail: "Cloud workloads and identity. Entra ID governs who gets in; the tunnel governs what reaches the private subnets.",
    facts: ["Site-to-site IPsec", "Entra ID conditional access", "MFA enforced for admin roles"],
  },
  {
    id: "remote",
    label: "Remote staff",
    model: "SSL VPN",
    x: 134,
    y: 140,
    kind: "cloud",
    zone: "Remote",
    detail: "Staff dialling in from outside. They land in their own policy zone, not on the user VLAN.",
    facts: ["MFA required", "Split tunnel disabled", "Session logging retained"],
  },
];

type Link = { from: string; to: string; tunnel?: boolean };

const LINKS: Link[] = [
  { from: "wan", to: "fw" },
  { from: "fw", to: "core" },
  { from: "core", to: "swa" },
  { from: "core", to: "swb" },
  { from: "core", to: "ap" },
  { from: "swa", to: "pc" },
  { from: "swb", to: "srv" },
  { from: "ap", to: "wifi" },
  { from: "fw", to: "azure", tunnel: true },
  { from: "remote", to: "fw", tunnel: true },
];

const byId = (id: string) => DEVICES.find((d) => d.id === id)!;

const KIND_COLOR: Record<Device["kind"], string> = {
  edge: "#f0a33c",
  core: "#3fd0c9",
  access: "#3fd0c9",
  endpoint: "#6b8299",
  cloud: "#6b8299",
};

function path(a: Device, b: Device) {
  if (a.x === b.x || a.y === b.y) return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  const midY = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`;
}

export default function NetworkTopology() {
  const [selected, setSelected] = useState<string>("fw");
  const device = byId(selected);

  const connected = new Set(
    LINKS.filter((l) => l.from === selected || l.to === selected).flatMap((l) => [l.from, l.to]),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      {/* Diagram — desktop and tablet */}
      <div className="hidden rounded-md border border-line bg-rack/60 p-4 md:block">
        <svg viewBox="0 0 840 520" className="w-full" role="group" aria-label="Interactive network topology">
          {LINKS.map((link) => {
            const a = byId(link.from);
            const b = byId(link.to);
            const lit = link.from === selected || link.to === selected;
            return (
              <path
                key={`${link.from}-${link.to}`}
                d={path(a, b)}
                fill="none"
                stroke={lit ? "#3fd0c9" : "#1b2e40"}
                strokeWidth={lit ? 1.8 : 1.2}
                strokeDasharray={link.tunnel ? "5 4" : undefined}
                className="transition-[stroke] duration-300"
              />
            );
          })}

          {DEVICES.map((d) => {
            const isSelected = d.id === selected;
            const isConnected = connected.has(d.id);
            return (
              <g
                key={d.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${d.label}, ${d.model}`}
                onClick={() => setSelected(d.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(d.id);
                  }
                }}
                className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-aqua"
              >
                <rect
                  x={d.x - 66}
                  y={d.y - 22}
                  width={132}
                  height={44}
                  rx={3}
                  fill={isSelected ? "#122232" : "#0c1620"}
                  stroke={isSelected ? "#3fd0c9" : isConnected ? "#2a4358" : "#1b2e40"}
                  strokeWidth={isSelected ? 1.6 : 1}
                  className="transition-all duration-200"
                />
                <circle cx={d.x - 54} cy={d.y} r={3} fill={KIND_COLOR[d.kind]} opacity={isSelected ? 1 : 0.65} />
                <text x={d.x - 44} y={d.y - 3} className="pointer-events-none fill-signal font-mono" style={{ fontSize: 11.5 }}>
                  {d.label}
                </text>
                <text x={d.x - 44} y={d.y + 11} className="pointer-events-none fill-dim font-mono" style={{ fontSize: 8.5 }}>
                  {d.model}
                </text>
              </g>
            );
          })}
        </svg>

        <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[0.68rem] text-dim">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-px w-5 bg-line" aria-hidden /> switched
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-px w-5 border-t border-dashed border-line" aria-hidden /> encrypted tunnel
          </span>
          <span>select a device to inspect it</span>
        </p>
      </div>

      {/* Device picker — mobile */}
      <div className="md:hidden">
        <p className="font-mono text-xs text-dim">select a device</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelected(d.id)}
              aria-pressed={d.id === selected}
              className={`rounded-sm border px-3 py-2.5 text-left transition-colors ${
                d.id === selected ? "border-aqua/60 bg-raised" : "border-line bg-panel"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: KIND_COLOR[d.kind] }} />
                <span className="font-mono text-xs text-signal">{d.label}</span>
              </span>
              <span className="mt-1 block font-mono text-[0.65rem] text-dim">{d.model}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inspector */}
      <motion.div
        key={device.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-md border border-line bg-panel p-5 sm:p-6 lg:self-start"
      >
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR[device.kind] }} />
          <h4 className="font-mono text-sm text-signal">{device.label}</h4>
          <span className="ml-auto rounded-sm bg-rack px-2 py-0.5 font-mono text-[0.65rem] text-dim">
            {device.zone}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-dim">{device.detail}</p>

        <ul className="mt-5 space-y-2.5">
          {device.facts.map((fact) => (
            <li key={fact} className="flex gap-2.5 font-mono text-xs leading-relaxed text-signal">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-aqua" aria-hidden />
              {fact}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

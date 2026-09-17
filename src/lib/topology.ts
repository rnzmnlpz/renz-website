export type Device = {
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

export const DEVICES: Device[] = [
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
    detail:
      "Layer 3 distribution with per-VLAN SVIs. Uplinks are aggregated so a single fibre cut does not take the floor down.",
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
    detail:
      "Windows Server running directory, name resolution and addressing — the three services whose failure looks like “the internet is down”.",
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
    detail:
      "Cloud workloads and identity. Entra ID governs who gets in; the tunnel governs what reaches the private subnets.",
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

export const LINKS: { from: string; to: string; tunnel?: boolean }[] = [
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

export const KIND_COLOR: Record<Device["kind"], string> = {
  edge: "#f0a33c",
  core: "#3fd0c9",
  access: "#3fd0c9",
  endpoint: "#6b8299",
  cloud: "#6b8299",
};

export const byId = (id: string) => DEVICES.find((d) => d.id === id)!;

/** Orthogonal routing, the way a network diagram is normally drawn. */
export function linkPath(a: Device, b: Device) {
  if (a.x === b.x || a.y === b.y) return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  const midY = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`;
}

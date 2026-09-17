export type SubnetResult = {
  address: string;
  prefix: number;
  netmask: string;
  wildcard: string;
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  totalAddresses: number;
  usableHosts: number;
  scope: "Private" | "Public" | "Loopback" | "Link-local" | "Multicast" | "Reserved";
  binaryMask: string;
};

const OCTET = 256;

export function ipToInt(ip: string): number {
  return ip.split(".").reduce((acc, octet) => acc * OCTET + Number(octet), 0) >>> 0;
}

export function intToIp(value: number): string {
  const n = value >>> 0;
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

function classify(network: number): SubnetResult["scope"] {
  const first = (network >>> 24) & 255;
  const second = (network >>> 16) & 255;

  if (first === 127) return "Loopback";
  if (first === 169 && second === 254) return "Link-local";
  if (first >= 224 && first <= 239) return "Multicast";
  if (first >= 240) return "Reserved";
  if (first === 10) return "Private";
  if (first === 172 && second >= 16 && second <= 31) return "Private";
  if (first === 192 && second === 168) return "Private";
  return "Public";
}

/** Accepts "10.0.0.1/24" or "10.0.0.1 255.255.255.0". Returns null when invalid. */
export function parseSubnet(input: string): SubnetResult | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const [addressPart, maskPart] = trimmed.split(/[/\s]+/);
  if (!addressPart || maskPart === undefined) return null;

  if (!isValidIp(addressPart)) return null;

  let prefix: number;
  if (isValidIp(maskPart)) {
    const maskInt = ipToInt(maskPart);
    // A valid netmask is a run of 1s followed by a run of 0s.
    const inverted = ~maskInt >>> 0;
    if (((inverted + 1) & inverted) !== 0) return null;
    prefix = 32 - Math.log2(inverted + 1);
  } else {
    if (!/^\d{1,2}$/.test(maskPart)) return null;
    prefix = Number(maskPart);
    if (prefix < 0 || prefix > 32) return null;
  }

  const addressInt = ipToInt(addressPart);
  const maskInt = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (addressInt & maskInt) >>> 0;
  const broadcast = (network | (~maskInt >>> 0)) >>> 0;
  const totalAddresses = 2 ** (32 - prefix);

  // /31 is a point-to-point link (RFC 3021) and /32 is a single host: neither
  // reserves a network or broadcast address, so both addresses are usable.
  const usableHosts = prefix >= 31 ? totalAddresses : Math.max(totalAddresses - 2, 0);
  const firstHost = prefix >= 31 ? network : (network + 1) >>> 0;
  const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;

  return {
    address: addressPart,
    prefix,
    netmask: intToIp(maskInt),
    wildcard: intToIp(~maskInt >>> 0),
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    firstHost: intToIp(firstHost),
    lastHost: intToIp(lastHost),
    totalAddresses,
    usableHosts,
    scope: classify(network),
    binaryMask: toBinary(maskInt),
  };
}

export function isValidIp(value: string): boolean {
  const parts = value.split(".");
  if (parts.length !== 4) return false;
  return parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}

export function toBinary(value: number): string {
  const n = value >>> 0;
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]
    .map((octet) => octet.toString(2).padStart(8, "0"))
    .join(".");
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

export type Risk = "low" | "watch" | "high";

export type PortEntry = {
  port: string;
  proto: "TCP" | "UDP" | "TCP/UDP";
  service: string;
  category: "Web" | "Remote" | "Mail" | "Directory" | "Infrastructure" | "File" | "Database" | "VPN";
  risk: Risk;
  note: string;
};

export const ports: PortEntry[] = [
  { port: "20-21", proto: "TCP", service: "FTP", category: "File", risk: "high", note: "Credentials and payload both travel in clear text. Replace with SFTP or FTPS." },
  { port: "22", proto: "TCP", service: "SSH / SFTP", category: "Remote", risk: "watch", note: "Safe when key-based auth is enforced and password login is disabled. Never expose with default creds." },
  { port: "23", proto: "TCP", service: "Telnet", category: "Remote", risk: "high", note: "Plaintext remote shell. No reason to run it on a modern network — disable on every switch and router." },
  { port: "25", proto: "TCP", service: "SMTP", category: "Mail", risk: "watch", note: "Server-to-server mail relay. An open relay gets you blacklisted within hours." },
  { port: "53", proto: "TCP/UDP", service: "DNS", category: "Infrastructure", risk: "watch", note: "Recursive resolvers exposed to the internet get abused for amplification attacks. Also a common exfiltration channel." },
  { port: "67-68", proto: "UDP", service: "DHCP", category: "Infrastructure", risk: "watch", note: "Rogue DHCP servers redirect clients silently. Use DHCP snooping on access switches." },
  { port: "69", proto: "UDP", service: "TFTP", category: "File", risk: "high", note: "No authentication at all. Useful for config backups on an isolated VLAN, dangerous anywhere else." },
  { port: "80", proto: "TCP", service: "HTTP", category: "Web", risk: "watch", note: "Unencrypted. Acceptable only as a permanent redirect to 443." },
  { port: "110", proto: "TCP", service: "POP3", category: "Mail", risk: "high", note: "Plaintext mail retrieval. Use 995 or move users to modern auth." },
  { port: "123", proto: "UDP", service: "NTP", category: "Infrastructure", risk: "watch", note: "Time drift breaks Kerberos, certificates and log correlation. Also an amplification vector when left open." },
  { port: "135", proto: "TCP", service: "MSRPC", category: "Directory", risk: "high", note: "Windows RPC endpoint mapper. Must never cross the perimeter." },
  { port: "137-139", proto: "TCP/UDP", service: "NetBIOS", category: "File", risk: "high", note: "Legacy Windows naming and sessions. Leaks host information and enables relay attacks." },
  { port: "143", proto: "TCP", service: "IMAP", category: "Mail", risk: "watch", note: "Plaintext unless wrapped in TLS. Prefer 993." },
  { port: "161-162", proto: "UDP", service: "SNMP", category: "Infrastructure", risk: "high", note: "v1 and v2c send community strings in clear text. Use v3 with auth and privacy, and change 'public'." },
  { port: "389", proto: "TCP/UDP", service: "LDAP", category: "Directory", risk: "high", note: "Directory queries in clear text, including binds. Use LDAPS or StartTLS." },
  { port: "443", proto: "TCP", service: "HTTPS", category: "Web", risk: "low", note: "The default for everything user-facing. Watch certificate expiry and disable TLS below 1.2." },
  { port: "445", proto: "TCP", service: "SMB", category: "File", risk: "high", note: "The ransomware highway. Block at the edge without exception and segment internally." },
  { port: "500", proto: "UDP", service: "IKE / IPsec", category: "VPN", risk: "low", note: "Phase 1 negotiation for site-to-site tunnels. Pair with 4500 when NAT is in the path." },
  { port: "514", proto: "UDP", service: "Syslog", category: "Infrastructure", risk: "watch", note: "Unencrypted and unauthenticated by default. Ship to a collector over TCP/TLS where the platform allows." },
  { port: "587", proto: "TCP", service: "SMTP Submission", category: "Mail", risk: "low", note: "The correct port for authenticated client mail submission with STARTTLS." },
  { port: "636", proto: "TCP", service: "LDAPS", category: "Directory", risk: "low", note: "LDAP over TLS. The right answer whenever 389 is proposed." },
  { port: "993", proto: "TCP", service: "IMAPS", category: "Mail", risk: "low", note: "IMAP wrapped in TLS." },
  { port: "1194", proto: "UDP", service: "OpenVPN", category: "VPN", risk: "low", note: "Strong when certificate-based. Rate-limit and geo-filter the listener." },
  { port: "1433", proto: "TCP", service: "MSSQL", category: "Database", risk: "high", note: "Database engines belong on an internal segment, never on a public interface." },
  { port: "1723", proto: "TCP", service: "PPTP", category: "VPN", risk: "high", note: "Cryptographically broken. Migrate any remaining tunnels to IPsec or SSL VPN." },
  { port: "3306", proto: "TCP", service: "MySQL", category: "Database", risk: "high", note: "Same rule as MSSQL — bind to localhost or an internal VLAN only." },
  { port: "3389", proto: "TCP", service: "RDP", category: "Remote", risk: "high", note: "The single most brute-forced port on the internet. Put it behind VPN and require MFA." },
  { port: "4500", proto: "UDP", service: "IPsec NAT-T", category: "VPN", risk: "low", note: "Carries IPsec through NAT. Open alongside 500 for site-to-site links." },
  { port: "5060", proto: "TCP/UDP", service: "SIP", category: "Infrastructure", risk: "watch", note: "VoIP signalling. Unsecured PBXs get scanned and dialled for toll fraud." },
  { port: "5432", proto: "TCP", service: "PostgreSQL", category: "Database", risk: "high", note: "Restrict by host-based auth and keep it off the perimeter." },
  { port: "8080", proto: "TCP", service: "HTTP alt", category: "Web", risk: "watch", note: "Common for admin consoles and proxies. Frequently forgotten and left exposed." },
  { port: "8443", proto: "TCP", service: "HTTPS alt", category: "Web", risk: "watch", note: "Management interfaces on firewalls and controllers. Restrict to a management VLAN." },
];

export const riskLabel: Record<Risk, string> = {
  low: "Low",
  watch: "Harden",
  high: "High",
};

export const profile = {
  name: "Renz John M. Manlapaz",
  shortName: "Renz Manlapaz",
  initials: "RJM",
  role: "Network Engineer",
  location: "Valenzuela City, Metro Manila",
  workplace: "Makati City, Philippines",
  email: "renzmnlpz@gmail.com",
  phone: "+63 907 190 7081",
  linkedin: "https://www.linkedin.com/in/rjohn-manlapaz",
  github: "https://github.com/rnzmnlpz",
  summary:
    "I own networks end to end — LAN, WAN, VPN and the firewalls in front of them — across cloud and on-premises infrastructure. I keep them fast, locked down and ready to scale, then document the fixes so the same issue never costs anyone a second outage.",
} as const;

export type Role = {
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  points: string[];
};

export const roles: Role[] = [
  {
    title: "Network Engineer",
    company: "FEAREX Technologies Corporation",
    location: "Makati City, Philippines",
    start: "Sep 2026",
    end: "Present",
    current: true,
    points: [
      "Own the network end to end — LAN, VPN and firewalls — keeping it fast, locked down and ready to scale across cloud and on-premises tooling.",
      "Monitor performance and security in real time, resolve slowdowns and dropouts, and document every fix so issues stop repeating.",
      "Keep the applications and operating systems people depend on in sync with the network, so the infrastructure stays invisible to the user.",
      "Handle hardware failure across servers, switches and workstations, including vendors, warranties and the full equipment inventory.",
      "Provide Tier 2/3 support, maintain network diagrams and procedures, and roll out upgrades and new technologies.",
    ],
  },
  {
    title: "Network Engineer / SysAdmin",
    company: "LYNC Solutions Inc.",
    location: "Makati City, Philippines",
    start: "Sep 2025",
    end: "Aug 2026",
    points: [
      "Configured and maintained LAN, WAN, VLAN, VPN and firewall infrastructure, holding the line on performance, security and access control compliance.",
      "Worked hands-on across Cisco, Fortinet, MikroTik, Meraki and Ubiquiti UniFi firewalls, routers, switches and wireless access points.",
      "Administered Azure environments, managed accounts and access controls, and monitored systems for security, performance and availability.",
      "Delivered Tier 3 network and systems support for servers, workstations and applications, tracking complex connectivity issues through Jira.",
      "Ran penetration testing and red team exercises in a Kali Linux and VMware lab, surfacing vulnerabilities through manual and automated testing.",
    ],
  },
  {
    title: "Service Desk Analyst / M365 Administrator",
    company: "Club Assist",
    location: "Melbourne, Australia — Remote",
    start: "Dec 2024",
    end: "Aug 2025",
    points: [
      "Provided Level 2 end-user and endpoint support for desktops, laptops, mobile devices and enterprise applications.",
      "Administered Microsoft 365 — Exchange Online, Outlook, Teams, OneDrive and SharePoint — covering provisioning, access management and issue resolution.",
      "Ran incident management and endpoint security through FreshService, Azure AD, Intune, Mimecast, Carbon Black Cloud and SOTI MobiControl.",
      "Diagnosed complex hardware, software, networking, VPN and remote-access faults, then configured and maintained the endpoints behind them.",
      "Worked with cross-functional IT teams and third-party vendors to resolve escalated incidents and improve service delivery.",
    ],
  },
  {
    title: "Junior IT Specialist",
    company: "Sweet Dynamic Corporation",
    location: "Valenzuela City, Philippines",
    start: "Sep 2023",
    end: "Aug 2024",
    points: [
      "Monitored and blocked IP addresses across company devices and accounts using the TP-Link database.",
      "Troubleshot hardware and software across printers, LAN/Wi-Fi connectivity and basic network diagnostics.",
      "Handled Windows installation, system maintenance, routing, switching, WAN/LAN networking and IP port forwarding.",
      "Resolved support tickets for 100+ employees and wrote the documentation that kept answers reusable.",
    ],
  },
];

export type ToolGroup = {
  layer: string;
  caption: string;
  tools: { name: string; note: string }[];
};

/* Grouped by the layer each tool actually operates on, not by vendor. */
export const stack: ToolGroup[] = [
  {
    layer: "Perimeter",
    caption: "What traffic is allowed to become",
    tools: [
      { name: "Fortinet FortiGate", note: "NGFW policy, VPN termination, NSE 1–2" },
      { name: "Cisco", note: "Network defense, routing and switching" },
      { name: "MikroTik", note: "RouterOS edge routing and firewall rules" },
    ],
  },
  {
    layer: "Access & Wireless",
    caption: "Where people meet the network",
    tools: [
      { name: "Cisco Meraki", note: "Cloud-managed switching and APs" },
      { name: "Ubiquiti UniFi", note: "Controller, switching, wireless coverage" },
      { name: "VLAN / WAN / VPN", note: "Segmentation and site-to-site links" },
    ],
  },
  {
    layer: "Endpoint",
    caption: "The devices that carry the risk",
    tools: [
      { name: "Microsoft Intune", note: "Policy, compliance, device enrolment" },
      { name: "MDM — SOTI MobiControl", note: "Mobile fleet management" },
      { name: "VMware Carbon Black", note: "Endpoint detection and response" },
    ],
  },
  {
    layer: "Cloud & Server",
    caption: "Where the services actually live",
    tools: [
      { name: "Microsoft Azure", note: "Entra ID, access control, monitoring" },
      { name: "Windows Server", note: "AD DS, DNS, DHCP, file and print" },
      { name: "VMware", note: "Virtualization and isolated lab environments" },
    ],
  },
];

export const certifications = [
  { name: "Certified Cybersecurity Educator Professional", code: "CCEP", family: "Cybersecurity" },
  { name: "Certified Red Team Operations Management", code: "CRTOM", family: "Offensive" },
  { name: "NSE 1 Cybersecurity and Cloud Fundamentals", code: "8674710164RJ", family: "Fortinet" },
  { name: "NSE 2 Introduction to Next Generation Firewall", code: "NSE 2", family: "Fortinet" },
  { name: "Cisco Network Defense", code: "NetDef", family: "Cisco" },
  { name: "Cisco Endpoint Security", code: "EndSec", family: "Cisco" },
  { name: "Introduction to Cloud Infrastructure Technologies", code: "LFS151", family: "Linux Foundation" },
  { name: "Cybersecurity Essentials", code: "LFC108", family: "Linux Foundation" },
  { name: "Authentication and Authorization for Web-API", code: "LFEL1004", family: "Linux Foundation" },
];

export const education = [
  {
    degree: "BS Computer Engineering",
    detail: "Major in Computer Engineering Technology",
    school: "Technological University of the Philippines — Manila",
    start: "Aug 2020",
    end: "Aug 2024",
    note: 'Thesis: "Technological Advancements within the current Mechatronics Industry"',
  },
  {
    degree: "STEM Strand",
    detail: "Science, Technology, Engineering and Mathematics",
    school: "Our Lady of Fatima University — Valenzuela",
    start: "Apr 2018",
    end: "Apr 2020",
    note: "Senior high school",
  },
];

export const skills = [
  { group: "Networking", items: ["LAN / WAN", "VLAN segmentation", "VPN & site-to-site", "Routing & switching", "Firewall policy", "Port forwarding", "Network diagrams"] },
  { group: "Security", items: ["Penetration testing", "Red team exercises", "Endpoint detection & response", "Access control compliance", "Email security", "Vulnerability assessment"] },
  { group: "Systems & Cloud", items: ["Azure administration", "Microsoft 365", "Entra ID / Azure AD", "Windows Server", "Linux", "VMware", "Kali Linux"] },
  { group: "Practice", items: ["Tier 2/3 support", "Incident management (Jira)", "Runbook documentation", "Vendor & warranty handling", "Asset inventory", "JavaScript, HTML, CSS", "Power Automate", "AutoCAD"] },
];

export const languages = ["English", "Tagalog"];

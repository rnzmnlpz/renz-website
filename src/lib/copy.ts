/** Every user-facing heading and intro on the page. Components read from here
    so wording changes never require touching a component. */
export const sections = {
  stack: {
    title: "The kit, grouped by layer.",
    intro:
      "The platforms I work in daily, arranged by the layer they sit on rather than by vendor. A firewall and an access point fail in different ways and belong in different groups.",
  },
  lab: {
    title: "Four tools. Run them yourself.",
    intro:
      "The subnet maths is calculated in your browser, the topology is a network I would deploy, and the port table carries the advice I would give on each one.",
  },
  experience: {
    title: "Three years of being the person the network calls.",
    intro: "Each role added a layer: endpoints first, then identity and cloud, then the firewall itself.",
  },
  credentials: {
    title: "Certified on both sides of the firewall.",
    intro:
      "Red team operations alongside Fortinet and Cisco defence. Knowing how a network gets broken into is what makes the hardening specific.",
  },
  contact: {
    title: "Hiring for a network role?",
    intro:
      "I am open to network engineering and infrastructure security roles, on site in Metro Manila or remote. Tell me what your network looks like now and where it keeps hurting.",
  },
} as const;

export const labTabs = [
  {
    id: "subnet",
    label: "Subnet calculator",
    blurb: "IPv4 addressing calculated live, including the /31 and /32 cases.",
  },
  {
    id: "topology",
    label: "Topology",
    blurb: "A small-enterprise network, device by device. Select any node to see how it is configured.",
  },
  { id: "soc", label: "Security console", blurb: "The console I watch during an incident." },
  {
    id: "ports",
    label: "Port reference",
    blurb: "The ports that come up in hardening reviews, with the posture I would take on each.",
  },
] as const;

export type LabTabId = (typeof labTabs)[number]["id"];

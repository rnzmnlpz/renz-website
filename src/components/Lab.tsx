"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import SubnetCalculator from "./lab/SubnetCalculator";

/* Only the default tab ships eagerly; the rest load on first selection. */
const NetworkTopology = dynamic(() => import("./lab/NetworkTopology"));
const SocDashboard = dynamic(() => import("./lab/SocDashboard"));
const PortReference = dynamic(() => import("./lab/PortReference"));

const TABS = [
  { id: "subnet", label: "Subnet calculator", blurb: "IPv4 addressing calculated live, including the /31 and /32 cases." },
  { id: "topology", label: "Topology", blurb: "A small-enterprise network, device by device. Select any node to see how it is configured." },
  { id: "soc", label: "Security console", blurb: "The console I watch during an incident." },
  { id: "ports", label: "Port reference", blurb: "The ports that come up in hardening reviews, with the posture I would take on each." },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Lab() {
  const [active, setActive] = useState<TabId>("subnet");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const current = TABS.find((t) => t.id === active)!;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === active);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;

    e.preventDefault();
    const id = TABS[next].id;
    setActive(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <section id="lab" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:px-8 lg:py-32">
        <h2 className="max-w-[20ch] text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
          Four tools. Run them yourself.
        </h2>
        <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-dim">
          The subnet maths is calculated in your browser, the topology is a network I would deploy,
          and the port table carries the advice I would give on each one.
        </p>

        <div className="mt-16">
          <div
            role="tablist"
            aria-label="Lab tools"
            onKeyDown={onKeyDown}
            className="flex flex-wrap gap-x-7 gap-y-2 border-b border-line/60"
          >
            {TABS.map((tab) => {
              const selected = tab.id === active;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[tab.id] = el;
                  }}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(tab.id)}
                  className={`-mb-px border-b py-3 text-sm transition-colors ${
                    selected
                      ? "border-aqua text-aqua"
                      : "border-transparent text-dim hover:text-signal"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <p className="mt-6 max-w-[58ch] text-sm leading-relaxed text-dim">{current.blurb}</p>

          <div
            id={`panel-${active}`}
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            tabIndex={0}
            data-custom-focus
            className="mt-10 outline-none"
          >
            {active === "subnet" && <SubnetCalculator />}
            {active === "topology" && <NetworkTopology />}
            {active === "soc" && <SocDashboard />}
            {active === "ports" && <PortReference />}
          </div>
        </div>
      </div>
    </section>
  );
}

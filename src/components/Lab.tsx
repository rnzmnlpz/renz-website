"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import NetworkTopology from "./lab/NetworkTopology";
import PortReference from "./lab/PortReference";
import SocDashboard from "./lab/SocDashboard";
import SubnetCalculator from "./lab/SubnetCalculator";

const TABS = [
  { id: "subnet", label: "Subnet calculator", blurb: "Addressing maths, worked out live — including the /31 and /32 cases people get wrong." },
  { id: "topology", label: "Topology", blurb: "A small-enterprise network as I would actually build it. Select any device to see how it is configured and why." },
  { id: "soc", label: "Security console", blurb: "The view I work from: what is failing, what is compliant, and what the firewall is dropping." },
  { id: "ports", label: "Port reference", blurb: "The ports that come up in every hardening conversation, with the posture I would take on each." },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Lab() {
  const [active, setActive] = useState<TabId>("subnet");
  const reduce = useReducedMotion();
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
    <section id="lab" className="scroll-mt-20 border-b border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="flex items-center gap-3 font-mono text-xs text-dim">
          <span className="text-aqua">~/lab</span>
          <span className="h-px flex-1 bg-line" aria-hidden />
        </div>

        <h2 className="mt-5 max-w-[22ch] text-[clamp(1.75rem,4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-balance">
          Working tools, not screenshots.
        </h2>
        <p className="mt-4 max-w-[62ch] leading-relaxed text-dim">
          Anyone can list a vendor on a CV. These four run in your browser — use them, and the
          experience behind them speaks for itself.
        </p>

        <div className="mt-12">
          <div
            role="tablist"
            aria-label="Lab tools"
            onKeyDown={onKeyDown}
            className="flex flex-wrap gap-1 border-b border-line"
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
                  className={`relative px-4 py-3 font-mono text-sm transition-colors ${
                    selected ? "text-aqua" : "text-dim hover:text-signal"
                  }`}
                >
                  {tab.label}
                  {selected && (
                    <motion.span
                      layoutId="lab-tab-underline"
                      className="absolute inset-x-0 -bottom-px h-px bg-aqua"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-5 max-w-[62ch] text-sm leading-relaxed text-dim">{current.blurb}</p>

          <div className="mt-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                id={`panel-${active}`}
                role="tabpanel"
                aria-labelledby={`tab-${active}`}
                tabIndex={0}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                data-custom-focus
                className="outline-none"
              >
                {active === "subnet" && <SubnetCalculator />}
                {active === "topology" && <NetworkTopology />}
                {active === "soc" && <SocDashboard />}
                {active === "ports" && <PortReference />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

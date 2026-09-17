"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { labTabs, sections, type LabTabId } from "@/lib/copy";
import SubnetCalculator from "./lab/SubnetCalculator";

/* Only the default tab ships eagerly; the rest load on first selection. */
const NetworkTopology = dynamic(() => import("./lab/NetworkTopology"));
const SocDashboard = dynamic(() => import("./lab/SocDashboard"));
const PortReference = dynamic(() => import("./lab/PortReference"));

const isTabId = (value: string | null): value is LabTabId =>
  labTabs.some((t) => t.id === value);

/* The open tool lives in the URL so it can be linked and shared. Reading it
   through useSyncExternalStore keeps the prerender static (server always sees
   the default) and picks up back/forward navigation for free. */
function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function getSnapshot(): LabTabId {
  const tool = new URLSearchParams(window.location.search).get("tool");
  return isTabId(tool) ? tool : "subnet";
}

const getServerSnapshot = (): LabTabId => "subnet";

export default function Lab() {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const current = labTabs.find((t) => t.id === active)!;

  /* The indicator is positioned by writing to the node directly. Holding it in
     state would re-render the whole panel on every resize for no benefit. */
  useEffect(() => {
    const place = () => {
      const button = tabRefs.current[active];
      const bar = indicatorRef.current;
      if (!button || !bar) return;
      bar.style.transform = `translateX(${button.offsetLeft}px)`;
      bar.style.width = `${button.offsetWidth}px`;
    };

    place();
    window.addEventListener("resize", place, { passive: true });
    return () => window.removeEventListener("resize", place);
  }, [active]);

  const select = (id: LabTabId) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tool", id);
    window.history.replaceState(null, "", url);
    // replaceState does not fire popstate, so nudge the store ourselves.
    window.dispatchEvent(new Event("popstate"));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = labTabs.findIndex((t) => t.id === active);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % labTabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + labTabs.length) % labTabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = labTabs.length - 1;
    else return;

    e.preventDefault();
    const id = labTabs[next].id;
    select(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <section id="lab" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:px-8 lg:py-32">
        <h2 className="max-w-[20ch] text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
          {sections.lab.title}
        </h2>
        <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-dim">{sections.lab.intro}</p>

        <div className="mt-16">
          <div
            role="tablist"
            aria-label="Lab tools"
            onKeyDown={onKeyDown}
            className="relative flex flex-wrap gap-x-7 gap-y-2 border-b border-line/60"
          >
            <span
              ref={indicatorRef}
              aria-hidden
              className="absolute bottom-0 left-0 h-px bg-aqua transition-[transform,width] duration-[var(--t-state)] ease-[var(--ease-out-expo)]"
            />
            {labTabs.map((tab) => {
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
                  onClick={() => select(tab.id)}
                  className={`press py-3 text-sm ${
                    selected ? "text-aqua" : "text-dim hover:text-signal"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <p key={`blurb-${active}`} className="slide-in mt-6 max-w-[58ch] text-sm leading-relaxed text-dim">
            {current.blurb}
          </p>

          <div
            id={`panel-${active}`}
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            tabIndex={0}
            className="mt-10 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua"
          >
            {/* Keyed so switching tools replays the entrance. */}
            <div key={active} className="slide-in">
              {active === "subnet" && <SubnetCalculator />}
              {active === "topology" && <NetworkTopology />}
              {active === "soc" && <SocDashboard />}
              {active === "ports" && <PortReference />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

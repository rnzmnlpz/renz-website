"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import portrait from "@/images/profile.webp";
import portraitFull from "@/images/profile-full.webp";
import { profile } from "@/lib/profile";

/* Native <dialog> rather than a hand-rolled overlay: showModal() gives focus
   trapping, Escape to close, inert background and top-layer stacking from the
   platform. This is a true modal, unlike the mobile nav, which is a disclosure
   and must not trap focus. */
export default function ProfileAvatar() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const show = useCallback(() => {
    ref.current?.showModal();
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    ref.current?.close();
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`View photo of ${profile.shortName}`}
        className="press block rounded-full ring-1 ring-line hover:ring-aqua"
      >
        <Image
          src={portrait}
          alt=""
          width={32}
          height={32}
          priority
          className="h-8 w-8 rounded-full object-cover"
        />
      </button>

      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        /* A click landing on the dialog itself is a click on the backdrop area,
           since the content sits in the inner figure. */
        onClick={(e) => {
          if (e.target === ref.current) hide();
        }}
        aria-label={`${profile.name}, ${profile.role}`}
        /* m-auto restores the centring a native dialog does by default —
           Tailwind's preflight zeroes the margin, which left the dialog pinned
           to the top-left and covering clicks meant for the backdrop. */
        className="m-auto max-w-[90vw] bg-transparent p-6 backdrop:bg-rack/80 backdrop:backdrop-blur-sm"
      >
        <figure className="relative w-[min(22rem,80vw)]">
          <Image
            src={portraitFull}
            alt={`${profile.name}, ${profile.role}`}
            sizes="(max-width: 480px) 80vw, 22rem"
            className="w-full rounded-md ring-1 ring-line"
          />

          <figcaption className="mt-4 text-center">
            <p className="text-signal">{profile.name}</p>
            <p className="mt-1 font-mono text-xs text-faint">
              {profile.role} · {profile.location}
            </p>
          </figcaption>

          <button
            type="button"
            onClick={hide}
            aria-label="Close"
            className="press absolute -right-2 -top-2 grid h-11 w-11 place-items-center rounded-full bg-panel text-dim ring-1 ring-line hover:text-aqua hover:ring-aqua"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </figure>
      </dialog>
    </>
  );
}

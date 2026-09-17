import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "No route to host",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center px-6 py-24 sm:px-8">
      <p className="font-mono text-xs text-aqua">404</p>

      <h1 className="mt-6 max-w-[16ch] text-[clamp(2rem,6vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
        No route to host.
      </h1>

      <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-dim">
        That page does not exist. The link may be out of date, or the address may have a typo in it.
      </p>

      <div className="mt-10">
        <Link
          href="/"
          className="rounded-sm bg-signal px-5 py-3 text-sm font-medium text-rack transition-opacity hover:opacity-85"
        >
          Back to the homepage
        </Link>
      </div>
    </main>
  );
}

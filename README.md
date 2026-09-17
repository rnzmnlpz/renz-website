# renz-website

Portfolio for Renz John M. Manlapaz — network engineer working across Cisco, Fortinet,
MikroTik, Meraki and UniFi, with Azure, Intune and endpoint security.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Motion. Statically rendered, no backend.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Layout

```
src/
  app/            layout, page, theme tokens in globals.css
  components/
    lab/          the four interactive tools
  lib/
    profile.ts    all résumé content — edit here, not in components
    subnet.ts     IPv4 subnet maths
    ports.ts      port reference data
```

Content lives in `src/lib/profile.ts`. Changing a job, certification or tool means editing
that one file; the components read from it.

## The lab

Four tools that run entirely in the browser:

- **Subnet calculator** — IPv4 addressing, including the `/31` (RFC 3021) and `/32` cases
- **Topology** — an interactive small-enterprise network, device by device
- **Security console** — a simulated SOC view, clearly labelled as simulated
- **Port reference** — searchable ports with a hardening posture for each

## Deploying

Import the repository on Vercel. The defaults are correct for Next.js — no configuration
needed. Update `metadataBase` in `src/app/layout.tsx` once the final domain is known.

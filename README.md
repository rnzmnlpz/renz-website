# renz-net

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

Pushes to `main` deploy to production automatically; every other branch gets a preview.

The canonical URL is resolved at build time in `src/lib/site.ts` from the environment
Vercel injects, so **nothing needs editing when the domain changes**. Adding a custom
domain in the Vercel dashboard updates `VERCEL_PROJECT_PRODUCTION_URL`, and the metadata,
OG image URLs, sitemap and `robots.txt` follow it. To override (a domain fronted by a
proxy, say), set `NEXT_PUBLIC_SITE_URL`.

Preview deployments return `Disallow: /` and `noindex`, so they never compete with
production in search results.

Security headers are set in `next.config.ts`. The CSP deliberately allows `'unsafe-inline'`
for scripts: a nonce-based policy needs middleware on every request, which would opt the
whole site out of static prerendering. The site takes no user input and loads no
third-party scripts, so the trade favours staying static. The directives still block
external script origins, framing, base-tag injection and plugins.

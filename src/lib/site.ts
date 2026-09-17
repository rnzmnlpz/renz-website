/** Canonical origin, resolved from the environment Vercel injects at build time.
 *
 * Production builds use the project's production domain, so social previews and
 * the sitemap always point at the real site. Preview builds use their own
 * deployment URL, so a preview's OG image resolves against that preview rather
 * than production. Local development falls back to the dev server.
 *
 * Hardcoding this is the usual source of broken OG images after a domain
 * change — the URL moves and the metadata does not.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;

  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

/** Preview and development builds stay out of search results. */
export const isIndexable = process.env.VERCEL_ENV === "production";

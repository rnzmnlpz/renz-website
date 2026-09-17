import type { NextConfig } from "next";

/* A nonce-based CSP would require middleware on every request, which opts the
   page out of static prerendering. This site is fully static, takes no user
   input and loads no third-party scripts, so it keeps the prerender and
   accepts 'unsafe-inline' for the framework's hydration and style tags. The
   directives still block external script origins, framing, base-tag injection
   and plugins. */
/* Vercel serves analytics same-origin under /_vercel/ in production but from
   va.vercel-scripts.com in development and on preview builds, and Speed
   Insights reports to vitals.vercel-insights.com. Both are named explicitly:
   without them the CSP silently blocks the scripts and the dashboards stay
   empty with no error anywhere except the browser console. */
const vercelAnalytics = "https://va.vercel-scripts.com";
const vercelVitals = "https://vitals.vercel-insights.com";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${vercelAnalytics}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${vercelAnalytics} ${vercelVitals}`,
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // Nothing useful to an attacker, and one less header on every response.
  poweredByHeader: false,
  reactStrictMode: true,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

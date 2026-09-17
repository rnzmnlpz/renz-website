import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must not compete with production in search results.
  if (!isIndexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

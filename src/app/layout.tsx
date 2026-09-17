import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { certifications, profile, stack } from "@/lib/profile";
import { isIndexable, siteUrl } from "@/lib/site";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const description =
  "Network engineer in Metro Manila working across Cisco, Fortinet, MikroTik, Meraki and UniFi, with Azure, Intune and endpoint security. Red team certified.";

/* Derived from the same data the page renders, so the two cannot drift. */
const tools = stack.flatMap((group) => group.tools.map((tool) => tool.name));

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description,
  email: `mailto:${profile.email}`,
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Valenzuela City",
    addressRegion: "Metro Manila",
    addressCountry: "PH",
  },
  sameAs: [profile.linkedin, profile.github],
  knowsAbout: tools,
  hasCredential: certifications.map((cert) => ({
    "@type": "EducationalOccupationalCredential",
    name: cert.name,
    credentialCategory: "certificate",
  })),
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Technological University of the Philippines — Manila",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: {
    default: `${profile.shortName} — Network Engineer`,
    template: `%s — ${profile.shortName}`,
  },
  description,
  applicationName: profile.shortName,
  keywords: [
    "network engineer",
    "cybersecurity",
    "Cisco",
    "Fortinet",
    "MikroTik",
    "Meraki",
    "Ubiquiti UniFi",
    "Azure",
    "Microsoft Intune",
    "VMware",
    "Philippines",
  ],
  authors: [{ name: profile.name, url: profile.linkedin }],
  creator: profile.name,
  openGraph: {
    type: "profile",
    url: siteUrl,
    title: `${profile.name} — Network Engineer`,
    description,
    siteName: profile.shortName,
    locale: "en_PH",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Network Engineer`,
    description,
  },
  // Preview deployments are excluded so they never outrank production.
  robots: isIndexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#060d14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Belt and braces with the (scripting: enabled) guard in globals.css:
            nothing that animates in may stay hidden without JavaScript. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}.word>span{transform:none!important}`}</style>
        </noscript>
      </head>
      <body className={`${plexSans.variable} ${plexMono.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-aqua focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-medium focus:text-rack"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

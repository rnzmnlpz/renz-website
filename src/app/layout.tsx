import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { profile } from "@/lib/profile";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://renzmanlapaz.vercel.app"),
  title: {
    default: `${profile.shortName} — Network Engineer`,
    template: `%s — ${profile.shortName}`,
  },
  description,
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
  openGraph: {
    type: "profile",
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
  robots: { index: true, follow: true },
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
      <body className={`${plexSans.variable} ${plexMono.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-aqua focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-medium focus:text-rack"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

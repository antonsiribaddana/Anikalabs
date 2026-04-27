import type { Metadata } from "next";
import { Manrope, Spline_Sans_Mono, Inter, IBM_Plex_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransitionProvider from "@/components/PageTransitionProvider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const splineSansMono = Spline_Sans_Mono({
  variable: "--font-spline",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const SITE_URL = "https://anikalabs.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Anika Labs — We Build Digital Systems That Convert",
    template: "%s — Anika Labs",
  },
  description:
    "Anika Labs designs websites, brand identities, and digital systems built to guide people, remove confusion, and turn attention into action.",
  applicationName: "Anika Labs",
  keywords: [
    "web design",
    "brand identity",
    "digital systems",
    "UX design",
    "UI design",
    "web development",
    "design studio",
    "Anika Labs",
  ],
  authors: [{ name: "Anika Labs", url: SITE_URL }],
  creator: "Anika Labs",
  publisher: "Anika Labs",
  category: "Design Studio",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Anika Labs",
    title: "Anika Labs — We Build Digital Systems That Convert",
    description:
      "Websites, brand identities, and digital systems built to guide people, remove confusion, and turn attention into action.",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Anika Labs — We Build Digital Systems That Convert",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anika Labs — We Build Digital Systems That Convert",
    description:
      "Websites, brand identities, and digital systems built to guide people, remove confusion, and turn attention into action.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${splineSansMono.variable} ${GeistSans.variable} ${inter.variable} ${ibmPlexMono.variable} antialiased`}>
      <body className="bg-[#02021e] text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: "Anika Labs",
                url: SITE_URL,
                logo: `${SITE_URL}/icon-512.png`,
                description:
                  "Anika Labs designs websites, brand identities, and digital systems built to guide people, remove confusion, and turn attention into action.",
                slogan: "We Build Digital Systems That Convert",
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: SITE_URL,
                name: "Anika Labs",
                description:
                  "Websites, brand identities, and digital systems built to convert.",
                publisher: { "@id": `${SITE_URL}/#organization` },
                inLanguage: "en-US",
              },
            ]),
          }}
        />
        <SmoothScroll />
        <PageTransitionProvider>
          <Navbar />
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  );
}

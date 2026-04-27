import type { Metadata } from "next";
import Hero from "@/components/Hero";
import HorizontalCards from "@/components/HorizontalCards";
import WhatWeDo from "@/components/WhatWeDo";
import Services from "@/components/Services";
import ProcessManifesto from "@/components/ProcessManifesto";
import Work from "@/components/Work";
import Results from "@/components/Results";
import About from "@/components/About";
import Footer from "@/components/Footer";

const SITE_URL = "https://anikalabs.com";

export const metadata: Metadata = {
  title: "Anika Labs — We Build Digital Systems That Convert",
  description:
    "Design studio building websites, brand identities, and digital systems that guide people, remove confusion, and turn attention into action.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Anika Labs — We Build Digital Systems That Convert",
    description:
      "Design studio building websites, brand identities, and digital systems that convert.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#service`,
  name: "Anika Labs",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  description:
    "Design studio building websites, brand identities, and digital systems that convert.",
  areaServed: "Worldwide",
  serviceType: ["Web Design", "Web Development", "Brand Identity", "UX/UI Design", "SEO"],
  provider: { "@id": `${SITE_URL}/#organization` },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Design" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brand Identity" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Development" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO" } },
    ],
  },
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <h1 className="sr-only">Anika Labs — We Build Digital Systems That Convert</h1>
      <Hero />
      <HorizontalCards />
      <WhatWeDo />
      <section id="work" aria-label="Selected work"><Work /></section>
      <section id="services" aria-label="Services"><Services /></section>
      <ProcessManifesto />
      <Results />
      <section id="about-us" aria-label="About Anika Labs"><About /></section>
      <Footer />
    </main>
  );
}

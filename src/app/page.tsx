import Hero from "@/components/Hero";
import HorizontalCards from "@/components/HorizontalCards";
import WhatWeDo from "@/components/WhatWeDo";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Results from "@/components/Results";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <HorizontalCards />
      <WhatWeDo />
      <Work />
      <Services />
      <Results />
      <About />
      <Footer />
    </main>
  );
}

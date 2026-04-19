import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact Us — Anika Labs",
  description: "Tell us about your project and we'll get back to you within one business day.",
};

export default function ContactUsPage() {
  return (
    <main style={{ background: "#02021e", minHeight: "100vh" }}>
      <ContactUs />
      <Footer />
    </main>
  );
}

import ContactUs from "@/components/ContactUs";

export const metadata = {
  title: "Contact Us — Anika Labs",
  description: "Tell us about your project and we'll get back to you within one business day.",
};

export default function ContactUsPage() {
  return (
    <main style={{ background: "#fff", minHeight: "100vh" }}>
      <ContactUs />
    </main>
  );
}

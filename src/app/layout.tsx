import type { Metadata } from "next";
import { Manrope, Spline_Sans_Mono, Inter, IBM_Plex_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";

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

export const metadata: Metadata = {
  title: "Anika Labs — We Build Digital Systems That Convert",
  description:
    "Websites, brand identities, and digital systems built to guide people, remove confusion, and turn attention into action.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${splineSansMono.variable} ${GeistSans.variable} ${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#02021e] text-white">
        <SmoothScroll />
        <Navbar />
        {children}
      </body>
    </html>
  );
}

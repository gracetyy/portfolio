import type { Metadata, Viewport } from "next";
import { inter, museoModerno } from "./fonts";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Grace Yuen | Portfolio",
  description:
    "Year 3 Computer Science @ HKU - Developer / Builder / Problem Solver",
  keywords: ["portfolio", "developer", "computer science", "HKU", "Grace Yuen"],
  authors: [{ name: "Grace Yuen" }],
  creator: "Grace Yuen",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://graceyuen.dev",
    title: "Grace Yuen | Portfolio",
    description:
      "Year 3 Computer Science @ HKU - Developer / Builder / Problem Solver",
    siteName: "Grace Yuen Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grace Yuen | Portfolio",
    description:
      "Year 3 Computer Science @ HKU - Developer / Builder / Problem Solver",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050511",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${museoModerno.variable}`}>
      <body className={`${inter.className} bg-navy antialiased`}>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}

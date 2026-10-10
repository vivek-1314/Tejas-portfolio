import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "../components/customCursor";
import SmoothScroll from "../components/Smoothscroll";
import JsonLd from "@/components/JsonLd";
import { siteMetadata, viewport as siteViewport } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO: title, description, keywords, social previews (all defined in lib/seo.ts)
export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* SEO: structured data (who you are + your profiles) */}
        <JsonLd />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
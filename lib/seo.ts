// Put this file at: lib/seo.ts  (next to your components folder, so "@/lib/seo" works)
import type { Metadata, Viewport } from "next";

// !!! CHANGE THIS to your real domain (or set NEXT_PUBLIC_SITE_URL in .env / Vercel).
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://tejas-portfolio-henna.vercel.app"
).replace(/\/$/, "");

export const NAME = "Tejas Yadav";
export const TAGLINE = "Sound, stories & the spaces in between.";

export const TITLE = "Tejas Yadav | Sound Designer, Sound Engineer & Music Producer";
export const DESCRIPTION =
    "Tejas Yadav is a sound designer, sound engineer and music producer from Bhopal, India, creating sound for films, animation and storytelling.";

// every profile that is really you: Google uses these to connect the dots
export const SOCIAL_LINKS = [
    "https://www.linkedin.com/in/tejas-yadav-348862381",
    "https://www.youtube.com/@dehleez246",
    "https://www.instagram.com/tejasmusicx",
    "https://www.instagram.com/tsaudio.sfx",
    "https://linktr.ee/tejasyadav246",
];

export const KEYWORDS = [
    "Tejas Yadav",
    "Tejas Yadav sound designer",
    "Tejas Yadav sound engineer",
    "Tejas Yadav music producer",
    "Tejas Yadav singer songwriter",
    "Tejas Yadav Bhopal",
    "Tejas Yadav Kuku",
    "sound designer India",
    "sound designer Bhopal",
    "sound engineer India",
    "music producer India",
    "audio post-production",
    "Foley and SFX",
    "re-sound design",
    "sound for picture",
    "film sound design",
    "narrative audio",
    "dehleez",
];

export const siteMetadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: TITLE,
        template: "%s | Tejas Yadav",
    },
    description: DESCRIPTION,
    applicationName: NAME,
    authors: [{ name: NAME, url: SITE_URL }],
    creator: NAME,
    publisher: NAME,
    keywords: KEYWORDS,
    category: "portfolio",
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        url: SITE_URL,
        siteName: "Tejas Yadav | Sound Designer",
        title: TITLE,
        description: DESCRIPTION,
        locale: "en_IN",
        // the image comes from app/opengraph-image.tsx automatically
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
    },
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
    // after adding the site to Google Search Console, paste the code here:
    // verification: { google: "YOUR_GOOGLE_VERIFICATION_CODE" },
};

export const viewport: Viewport = {
    themeColor: "#f8f7f4",
    width: "device-width",
    initialScale: 1,
};

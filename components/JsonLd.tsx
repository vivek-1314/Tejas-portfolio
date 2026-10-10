// Put this file at: components/JsonLd.tsx
// Structured data: tells Google who you are (a Person), what you do, where you are and
// which profiles belong to you. This is what helps a "Tejas Yadav sound designer" search
// connect your website, LinkedIn, YouTube and Instagram into one identity.
import { DESCRIPTION, NAME, SITE_URL, SOCIAL_LINKS, TAGLINE } from "@/lib/seo";

const graph = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": `${SITE_URL}/#person`,
            name: NAME,
            alternateName: ["Tejas", "Tejas Yadav Sound Designer", "Dehleez"],
            url: SITE_URL,
            description: DESCRIPTION,
            slogan: TAGLINE,
            jobTitle: [
                "Sound Designer",
                "Sound Engineer",
                "Music Producer",
                "Singer-Songwriter",
            ],
            worksFor: { "@type": "Organization", name: "Kuku" },
            alumniOf: { "@type": "CollegeOrUniversity", name: "LNCT" },
            address: {
                "@type": "PostalAddress",
                addressLocality: "Bhopal",
                addressCountry: "IN",
            },
            knowsAbout: [
                "Sound design",
                "Audio post-production",
                "Music production",
                "Mixing and mastering",
                "Foley and SFX",
                "Sound for picture",
                "Songwriting",
                "Vocal production",
                "Narrative audio",
                "Game audio",
            ],
            sameAs: SOCIAL_LINKS,
        },
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: "Tejas Yadav | Sound Designer",
            description: DESCRIPTION,
            inLanguage: "en",
            publisher: { "@id": `${SITE_URL}/#person` },
        },
        {
            "@type": "ProfilePage",
            "@id": `${SITE_URL}/#profile`,
            url: SITE_URL,
            name: "Tejas Yadav | Sound Designer, Sound Engineer & Music Producer",
            isPartOf: { "@id": `${SITE_URL}/#website` },
            mainEntity: { "@id": `${SITE_URL}/#person` },
        },
    ],
};

export default function JsonLd() {
    return (
        <script
            type="application/ld+json"
            // "<" is escaped so the JSON can never close the script tag early
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
            }}
        />
    );
}

"use client";

import { useState } from "react";
import { motion } from "motion/react";

const ACCENT = "#E53935";
const EASE = [0.22, 1, 0.36, 1] as const;

type Item = {
    title: string;
    href?: string; // no link yet -> shown as plain text
    meta?: string; // small extra line, e.g. "47K+ Views"
    platform?: string; // overrides the platform detected from the link
};

type Group = {
    name: string;
    items: Item[];
};

const groups: Group[] = [
    {
        name: "Sound Design Work",
        items: [
            { title: "iPhone Commercial Re-Sound Design", href: "https://lnkd.in/p/dV2HSdjB" },
            { title: "Spiderman Scene Re-Sound Design", href: "https://www.instagram.com/reel/Db_sNB1Raxd" },
            { title: "IT Horror Scene Re-Sound Design", href: "https://www.instagram.com/reel/DWagQv1iI6d" },
            { title: "Battle Scene Re-Sound Design", href: "https://www.instagram.com/reel/DV_v5KxDJfa" },
            { title: "Foley Sound Design - Thriller BGM", href: "https://www.youtube.com/shorts/H8p3SHFla1w" },
            { title: "AI Story Animation Scene Sound Design", href: "https://www.youtube.com/watch?v=RIwS9jLCWc8" },
            { title: "Flowers English Video (using Elvenlabs)", href: "https://www.youtube.com/shorts/h4QpqpWecgs" },
            { title: "Sound Design Krishna Episode", href: "https://www.youtube.com/watch?v=ZXs_R0NcUOU" },
        ],
    },
    {
        name: "Podcast Editing",
        items: [
            { title: "Speech Editing in Adobe Audition", href: "https://youtu.be/u-aneZFEomo?si=TxYWQH4PRUnuqLzQ" },
            { title: "Podcast Editing Workflow", href: "https://youtu.be/lD2vCWE7zr4?si=GnuAdXsffKnSHum5" },
        ],
    },
    {
        name: "Short Film Score",
        items: [
            { title: "Laal Rang | Experimental Short Film", href: "https://www.youtube.com/watch?v=r3q0GrDuhnc" },
            { title: "Tandav Short Film Track", href: "https://www.instagram.com/reel/DUkZb-4DAgJ" },
        ],
    },
    {
        name: "Music Production & Mix",
        items: [
            {
                title: "CHEEKH - Music Production & Mix",
                href: "https://youtu.be/8wjQPXZBXq4?si=5-FqJgr7fjtpoz7w",
                meta: "47K+ Views",
            },
        ],
    },
    {
        name: "Music Releases",
        items: [
            { title: "Until Then - Official Lyric Video", href: "https://youtu.be/cKDa-pyXSnk" },
            // no link was given for this one: add `href` when you have the Spotify URL
            { title: "Tere Naino Se", meta: "Vedank Baghele, Tejas", platform: "Spotify" },
            { title: "High on Caffeine and Cupcakes (Lyric Video)", href: "https://youtu.be/SQD30j_NpP0" },
            { title: "Tere Bina (Official Video)", href: "https://youtu.be/Cbw9NfVBqhw" },
            { title: "Tu Itna Bata (Official Music Video)", href: "https://youtu.be/z21kps1M8R8" },
        ],
    },
];

function getPlatform(item: Item) {
    if (item.platform) return item.platform;
    const h = item.href ?? "";
    if (h.includes("instagram.com")) return "Instagram";
    if (h.includes("youtube.com") || h.includes("youtu.be")) return "YouTube";
    if (h.includes("linkedin.com") || h.includes("lnkd.in")) return "LinkedIn";
    if (h.includes("spotify.com")) return "Spotify";
    return "";
}

// words rise out of a mask, one after another
function RiseWords({ text }: { text: string }) {
    return (
        <>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {text.split(" ").map((word, i) => (
                    <span
                        key={`${word}-${i}`}
                        className="mr-[0.25em] -mb-[0.15em] inline-block overflow-hidden pb-[0.15em] align-top"
                    >
                        <motion.span
                            className="inline-block will-change-transform"
                            initial={{ y: "110%" }}
                            whileInView={{ y: "0%" }}
                            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                            transition={{ duration: 0.8, delay: i * 0.05, ease: EASE }}
                        >
                            {word}
                        </motion.span>
                    </span>
                ))}
            </span>
        </>
    );
}

function WorkGroup({ group }: { group: Group }) {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div className="relative grid gap-x-16 gap-y-6 pb-[clamp(3rem,6vw,6rem)] lg:grid-cols-[minmax(220px,0.35fr)_1fr]">
            {/* group rule draws in from the left */}
            <motion.div
                aria-hidden="true"
                className="absolute left-0 top-0 h-[1.5px] w-full origin-left bg-[#0A0A0A]/15"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE }}
            />

            {/* group name stays in view while its list scrolls (desktop) */}
            <div className="pt-8 lg:sticky lg:top-24 lg:self-start">
                <motion.h3
                    className="text-[clamp(1.5rem,2.6vw,1.8rem)] font-medium leading-tight tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                >
                    {group.name}
                </motion.h3>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#7a746f]">
                    <span style={{ color: ACCENT }}>
                        {String(group.items.length).padStart(2, "0")}
                    </span>{" "}
                    {group.items.length === 1 ? "project" : "projects"}
                </p>
            </div>

            <ul className="pt-2 lg:pt-4" onMouseLeave={() => setHovered(null)}>
                {group.items.map((item, i) => {
                    const isHovered = hovered === i;
                    const isDimmed = hovered !== null && !isHovered;
                    const platform = getPlatform(item);

                    const row = (
                        <>
                            <span className="w-8 shrink-0 text-xs tabular-nums text-[#7a746f] sm:w-10">
                                {String(i + 1).padStart(2, "0")}
                            </span>

                            <motion.span
                                className="min-w-0 flex-1 text-[clamp(1rem,1.3vw,1.375rem)] font-medium leading-snug"
                                animate={{
                                    x: isHovered ? 12 : 0,
                                    color: isHovered ? ACCENT : "#0A0A0A",
                                }}
                                transition={{ duration: 0.4, ease: EASE }}
                            >
                                {item.title}
                                {item.meta && (
                                    <span className="mt-1 block text-[0.8em] font-normal text-[#7a746f]">
                                        {item.meta}
                                    </span>
                                )}
                            </motion.span>

                            {platform && (
                                <span className="hidden shrink-0 text-xs uppercase tracking-[0.14em] text-[#7a746f] sm:block">
                                    {platform}
                                </span>
                            )}

                            {item.href && (
                                <motion.svg
                                    aria-hidden="true"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.4"
                                    className="h-4 w-4 shrink-0"
                                    animate={{ rotate: isHovered ? -45 : 0 }}
                                    transition={{ duration: 0.3, ease: EASE }}
                                >
                                    <path d="M2 8h11M9 4l4 4-4 4" />
                                </motion.svg>
                            )}
                        </>
                    );

                    const rowClass =
                        "flex items-center gap-3 border-b border-[#0A0A0A]/10 py-4 sm:gap-4 lg:py-5";

                    return (
                        <motion.li
                            key={item.title}
                            onMouseEnter={() => setHovered(i)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                            transition={{ duration: 0.6, delay: Math.min(i * 0.05, 0.3), ease: EASE }}
                        >
                            {/* separate layer so the hover dimming doesn't fight the reveal */}
                            <motion.div
                                animate={{ opacity: isDimmed ? 0.4 : 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {item.href ? (
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={rowClass}
                                    >
                                        {row}
                                    </a>
                                ) : (
                                    <div className={rowClass}>{row}</div>
                                )}
                            </motion.div>
                        </motion.li>
                    );
                })}
            </ul>
        </div>
    );
}

export default function Work() {
    return (
        <section className="w-full whitespace-normal bg-[#f8f7f4] px-[clamp(1.5rem,5vw,5.5rem)] py-[clamp(4rem,9vw,9rem)] text-[#0A0A0A]">
            <div className="mx-auto w-full max-w-[1500px]">
                <h2 className="mb-[clamp(2.5rem,5vw,5rem)] text-[clamp(2rem,4vw,4rem)] font-medium leading-none tracking-tight">
                    <RiseWords text="Work / Projects" />
                </h2>

                {groups.map((group) => (
                    <WorkGroup key={group.name} group={group} />
                ))}
            </div>
        </section>
    );
}
"use client";

import { motion } from "motion/react";

const ACCENT = "#E53935";
const EASE = [0.22, 1, 0.36, 1] as const;

type Release = {
    title: string;
    type: string;
    href: string;
    // YouTube thumbnail. To use your own file, download it from Drive into
    // /public/images/music/ and set image: "/images/music/<name>.jpg"
    image: string;
    description: string;
    credits: string;
    extra?: { label: string; href: string };
};

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

const releases: Release[] = [
    {
        title: "You Are My Home",
        type: "Original Song",
        href: "https://youtu.be/tBusoK94XXg?si=D0Ci2MfUiwlOQj8o",
        image: thumb("tBusoK94XXg"),
        description:
            "An original song written and performed by Tejas Yadav. Produced and engineered by Tejas Yadav, with the music visualization edited by him.",
        credits:
            "Written, performed, produced and engineered by Tejas Yadav. Music visualization edited by Tejas Yadav.",
    },
    {
        title: "Smile",
        type: "Original Release",
        href: "https://www.youtube.com/watch?v=UYTj1Cnr2BY",
        image: thumb("UYTj1Cnr2BY"),
        description:
            "An original music release written, produced and performed by Tejas Yadav, with mixing and mastering handled by Tejas Yadav and recording by Marvin Mathew (college senior).",
        credits:
            "Written, produced and performed by Tejas Yadav. Mixed and mastered by Tejas Yadav. Recorded by Marvin Mathew.",
        extra: {
            label: "Watch the music breakdown",
            href: "https://youtu.be/VVlPoevCCCI?si=As3veYO9JRYc8QM_",
        },
    },
    {
        title: "Tere Bina",
        type: "Original Release",
        href: "https://www.youtube.com/watch?v=Cbw9NfVBqhw",
        image: thumb("Cbw9NfVBqhw"),
        description:
            "An original music release written, composed, performed, mixed and mastered by Tejas Yadav, showcasing his approach to songwriting, vocal performance and music production.",
        credits: "Written, composed, performed, mixed and mastered by Tejas Yadav.",
    },
];

const ALL_MUSIC_URL = "https://www.youtube.com/@dehleez246/videos";
const BREAKDOWN_URL = "https://youtu.be/VVlPoevCCCI?si=As3veYO9JRYc8QM_";

function Arrow() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover/btn:-rotate-45"
        >
            <path d="M2 8h11M9 4l4 4-4 4" />
        </svg>
    );
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

const rise = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -10% 0px" },
    transition: { duration: 0.8, delay, ease: EASE },
});

export default function Music() {
    return (
        <section className="w-full whitespace-normal bg-[#f8f7f4] px-[clamp(1.5rem,5vw,5.5rem)] py-[clamp(3rem,6vw,6rem)] text-[#0A0A0A]">
            <div className="mx-auto w-full max-w-[1500px]">
                {/* heading */}
                <h2 className="text-[clamp(2rem,4vw,4rem)] font-medium leading-none tracking-tight">
                    <RiseWords text="Music" />
                </h2>
                <motion.p
                    {...rise(0.1)}
                    className="mt-5 max-w-[55ch] text-[clamp(1rem,1.3vw,1.375rem)] leading-relaxed text-[#483A35]"
                >
                    Original songs, music releases, lyric videos and official music videos.
                    These are the strongest releases, written, performed and produced by me.
                </motion.p>

                {/* featured releases */}
                <ul className="mt-[clamp(2rem,4vw,3.5rem)] space-y-[clamp(2.5rem,5vw,5rem)]">
                    {releases.map((release, i) => {
                        const imageRight = i % 2 === 1;

                        return (
                            <li
                                key={release.title}
                                className="grid items-center gap-6 lg:grid-cols-12 lg:gap-10"
                            >
                                {/* thumbnail: wipes open from the left, plays on click */}
                                <motion.div
                                    className={`lg:col-span-6 ${imageRight ? "lg:order-2" : ""}`}
                                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                                    whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                                    transition={{ duration: 1.1, ease: EASE }}
                                >
                                    <a
                                        href={release.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Watch ${release.title} on YouTube`}
                                        className="group relative block aspect-video overflow-hidden bg-neutral-200"
                                    >
                                        <img
                                            src={release.image}
                                            alt={`${release.title} cover`}
                                            loading="lazy"
                                            draggable={false}
                                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                                        />
                                        <span className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
                                        <span
                                            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                                            style={{ backgroundColor: ACCENT }}
                                        >
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-5 w-5">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </span>
                                    </a>
                                </motion.div>

                                {/* text */}
                                <div className="lg:col-span-6">
                                    <motion.p
                                        {...rise(0.05)}
                                        className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#7a746f]"
                                    >
                                        <span style={{ color: ACCENT }}>
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span>{release.type}</span>
                                    </motion.p>

                                    <h3 className="text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium leading-[1.05] tracking-tight">
                                        <RiseWords text={release.title} />
                                    </h3>

                                    <motion.p
                                        {...rise(0.15)}
                                        className="mt-4 text-[clamp(0.95rem,1.1vw,1.2rem)] leading-relaxed text-[#483A35]"
                                    >
                                        {release.description}
                                    </motion.p>

                                    <motion.div
                                        {...rise(0.25)}
                                        className="mt-5 border-t border-[#0A0A0A]/15 pt-3"
                                    >
                                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#7a746f]">
                                            Credits
                                        </p>
                                        <p className="mt-2 text-[15px] leading-relaxed">
                                            {release.credits}
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        {...rise(0.3)}
                                        className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3"
                                    >
                                        <a
                                            href={release.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/btn inline-flex items-center gap-3 border border-[#0A0A0A] px-[15px] py-[9px] text-[15px] font-medium transition-colors duration-300 hover:bg-[#0A0A0A] hover:text-white"
                                        >
                                            Watch on YouTube
                                            <Arrow />
                                        </a>

                                        {release.extra && (
                                            <a
                                                href={release.extra.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[15px] underline underline-offset-4 transition-colors duration-300 hover:text-[#E53935]"
                                            >
                                                {release.extra.label}
                                            </a>
                                        )}
                                    </motion.div>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {/* all music + breakdown */}
                <motion.div
                    {...rise()}
                    className="mt-[clamp(3rem,5vw,5rem)] flex flex-col gap-4 border-t border-[#0A0A0A]/15 pt-8 sm:flex-row sm:flex-wrap sm:items-center"
                >
                    <a
                        href={ALL_MUSIC_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn inline-flex items-center justify-between gap-3 border border-[#0A0A0A] bg-[#0A0A0A] px-5 py-3 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-transparent hover:text-[#0A0A0A]"
                    >
                        Explore All Music
                        <Arrow />
                    </a>

                    <a
                        href={BREAKDOWN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn inline-flex items-center justify-between gap-3 border border-[#0A0A0A]/30 px-5 py-3 text-[15px] font-medium transition-colors duration-300 hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white"
                    >
                        Watch Music Breakdown of &lsquo;Smile&rsquo;
                        <Arrow />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
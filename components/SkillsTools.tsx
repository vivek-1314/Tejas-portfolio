"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";

const ACCENT = "#E53935";
const EASE = [0.22, 1, 0.36, 1] as const;

// how long the cursor must rest on a skill before it becomes active (ms).
// stops fast sweeps from triggering a re-render per row.
const HOVER_INTENT = 60;

const skills = [
    {
        name: "Sound Design",
        desc: "Creating immersive soundscapes using sound effects, ambience, Foley, and carefully layered audio to enhance visual storytelling.",
    },
    {
        name: "Music Production",
        desc: "Producing and arranging music, developing creative ideas, and shaping sounds to create a cohesive musical experience.",
    },
    {
        name: "Mixing & Mastering",
        desc: "Balancing audio elements, refining tonal clarity and dynamics, and preparing polished, release-ready audio.",
    },
    {
        name: "Songwriting",
        desc: "Writing lyrics, developing melodies, and expressing ideas and emotions through original songs.",
    },
    {
        name: "Audio Post-Production",
        desc: "Editing, cleaning, synchronizing, and refining audio for films, animations, podcasts, and other audiovisual content.",
    },
    {
        name: "Vocal Production",
        desc: "Recording, editing, tuning, and processing vocals to achieve a clear, expressive, and polished sound.",
    },
    {
        name: "Video Editing",
        desc: "Editing visual content, synchronizing audio with visuals, and creating engaging music videos, visualizers, and short-form content.",
    },
    {
        name: "Singing & Vocal Performance",
        desc: "Performing and recording vocals with an emphasis on emotional expression, delivery, and musical interpretation.",
    },
];

const tools = [
    {
        category: "Music Production & Audio Workstations",
        items: ["FL Studio", "Adobe Audition", "Audacity"],
    },
    {
        category: "Mixing & Mastering Plugins",
        items: ["FabFilter Pro-Q 3", "FabFilter Plugins", "iZotope Ozone", "iZotope RX", "oeksound soothe2"],
    },
    {
        category: "Video Editing & Visual Content",
        items: ["DaVinci Resolve", "Adobe Photoshop"],
    },
    {
        category: "AI-Assisted Creative Tools",
        items: ["ElevenLabs", "Suno AI"],
    },
];

const allTools = tools.flatMap((t) => t.items);

// small seeded random, so every skill gets its own (stable) waveform shape
function rng(seed: number) {
    let t = seed;
    return () => {
        t += 0x6d2b79f5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

// The bars keep moving using pure CSS keyframes (transform only), so they run
// off the main thread and never fight with hover / scroll work.
const Waveform = memo(function Waveform({ seed, bars = 56 }: { seed: number; bars?: number }) {
    const data = useMemo(() => {
        const r = rng(seed * 9973);
        return Array.from({ length: bars }, (_, i) => {
            const envelope = 0.3 + 0.7 * Math.sin((Math.PI * i) / (bars - 1));
            const duration = 0.7 + r() * 0.9;
            return {
                low: 0.1 + r() * 0.25,
                high: (0.45 + r() * 0.55) * envelope,
                duration,
                // negative delay = already mid-cycle on mount, no staggered start needed
                offset: -r() * duration,
            };
        });
    }, [seed, bars]);

    return (
        <div aria-hidden="true" className="flex h-full w-full items-center gap-[3px]">
            {data.map((bar, i) => (
                <span
                    key={i}
                    className="wave-bar block h-full max-w-[6px] flex-1 rounded-full"
                    style={
                        {
                            backgroundColor: i % 7 === 0 ? ACCENT : "#0A0A0A",
                            "--lo": bar.low,
                            "--hi": bar.high,
                            animationDuration: `${bar.duration}s`,
                            animationDelay: `${bar.offset}s`,
                        } as CSSProperties
                    }
                />
            ))}
        </div>
    );
});

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

export default function SkillsTools() {
    const [active, setActive] = useState(0);
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pad = (n: number) => String(n).padStart(2, "0");

    const clearHover = useCallback(() => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
            hoverTimer.current = null;
        }
    }, []);

    // hover intent: only switch once the cursor settles on a row
    const intentTo = useCallback(
        (i: number) => {
            clearHover();
            hoverTimer.current = setTimeout(() => setActive(i), HOVER_INTENT);
        },
        [clearHover],
    );

    // click / keyboard focus switch right away
    const activateNow = useCallback(
        (i: number) => {
            clearHover();
            setActive(i);
        },
        [clearHover],
    );

    useEffect(() => clearHover, [clearHover]);

    return (
        <section className="w-full whitespace-normal overflow-x-clip bg-[#f8f7f4] px-[clamp(1.5rem,5vw,5.5rem)] py-[clamp(3rem,6vw,6rem)] text-[#0A0A0A]">
            {/* compositor-only animations (transform), shared by the waveform and the marquee */}
            <style>{`
                @keyframes wave {
                    0%, 100% { transform: scaleY(var(--lo)); }
                    50% { transform: scaleY(var(--hi)); }
                }
                @keyframes marquee {
                    from { transform: translate3d(0, 0, 0); }
                    to { transform: translate3d(-50%, 0, 0); }
                }
                .wave-bar {
                    transform-origin: center;
                    animation-name: wave;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                    will-change: transform;
                }
                .marquee-track {
                    animation: marquee 40s linear infinite;
                    will-change: transform;
                }
                @media (prefers-reduced-motion: reduce) {
                    .wave-bar, .marquee-track { animation: none; }
                }
            `}</style>

            <div className="mx-auto w-full max-w-[1500px]">
                <h2 className="text-[clamp(2rem,4vw,4rem)] font-medium leading-none tracking-tight">
                    <RiseWords text="Skills / Tools" />
                </h2>

                {/* ---------- SKILLS: pick a track, hear it "play" ---------- */}
                <div className="mt-[clamp(2rem,4vw,3.5rem)] grid gap-x-12 lg:grid-cols-[1.1fr_1fr]">
                    <ul>
                        {skills.map((skill, i) => {
                            const isActive = active === i;

                            return (
                                <motion.li key={skill.name} {...rise(Math.min(i * 0.05, 0.3))}>
                                    <button
                                        type="button"
                                        onMouseEnter={() => intentTo(i)}
                                        onMouseLeave={clearHover}
                                        onFocus={() => activateNow(i)}
                                        onClick={() => activateNow(i)}
                                        aria-expanded={isActive}
                                        className="relative flex w-full items-baseline gap-4 border-b border-[#0A0A0A]/10 py-3 text-left lg:py-3.5"
                                    >
                                        <span
                                            className="w-8 shrink-0 text-xs tabular-nums transition-colors duration-300"
                                            style={{ color: isActive ? ACCENT : "#7a746f" }}
                                        >
                                            {pad(i + 1)}
                                        </span>

                                        <motion.span
                                            className="text-[clamp(1.25rem,2.2vw,1.9rem)] font-medium leading-tight tracking-tight will-change-transform"
                                            animate={{
                                                x: isActive ? 16 : 0,
                                                opacity: isActive ? 1 : 0.4,
                                            }}
                                            transition={{ duration: 0.35, ease: EASE }}
                                        >
                                            {skill.name}
                                        </motion.span>

                                        {/* red line that slides from row to row */}
                                        {isActive && (
                                            <motion.span
                                                layoutId="skill-line"
                                                className="absolute inset-x-0 -bottom-px h-[1.5px]"
                                                style={{ backgroundColor: ACCENT }}
                                                transition={{ duration: 0.35, ease: EASE }}
                                            />
                                        )}
                                    </button>

                                    {/* phones: the description opens right under the tapped skill */}
                                    <AnimatePresence initial={false}>
                                        {isActive && (
                                            <motion.div
                                                className="overflow-hidden lg:hidden"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.45, ease: EASE }}
                                            >
                                                <p className="pb-4 pl-12 pt-3 text-[clamp(1rem,1.3vw,1.375rem)] leading-relaxed text-[#483A35]">
                                                    {skill.desc}
                                                </p>
                                                <div className="mb-4 ml-12 h-14">
                                                    <Waveform seed={i + 1} bars={36} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.li>
                            );
                        })}
                    </ul>

                    {/* desktop: "now playing" panel that follows the hovered skill */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24">
                            {/* quick, opacity-only swap so fast hovering never queues up long exits */}
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={active}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.22, ease: EASE }}
                                >
                                    <p className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#7a746f]">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span
                                                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                                                style={{ backgroundColor: ACCENT }}
                                            />
                                            <span
                                                className="relative inline-flex h-2.5 w-2.5 rounded-full"
                                                style={{ backgroundColor: ACCENT }}
                                            />
                                        </span>
                                        Now playing · {pad(active + 1)} / {pad(skills.length)}
                                    </p>

                                    <p className="mt-6 text-[clamp(1rem,1.3vw,1.375rem)] leading-relaxed text-[#483A35]">
                                        {skills[active].desc}
                                    </p>

                                    <div className="mt-8 h-24 border-t border-[#0A0A0A]/15 pt-6">
                                        <Waveform seed={active + 1} />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* ---------- TOOLS ---------- */}
                <div className="mt-[clamp(3.5rem,6vw,6rem)]">
                    <h3 className="text-[clamp(1.5rem,2.6vw,1.8rem)] font-medium tracking-tight">
                        <RiseWords text="Tools & Software" />
                    </h3>

                    <div className="mt-8">
                        {tools.map((group) => (
                            <div
                                key={group.category}
                                className="relative grid gap-x-16 gap-y-4 py-6 lg:grid-cols-[minmax(240px,0.4fr)_1fr]"
                            >
                                {/* rule draws in from the left */}
                                <motion.div
                                    aria-hidden="true"
                                    className="absolute left-0 top-0 h-[1.5px] w-full origin-left bg-[#0A0A0A]/15"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, ease: EASE }}
                                />

                                <motion.p
                                    {...rise()}
                                    className="text-[clamp(1rem,1.3vw,1.375rem)] font-medium leading-snug"
                                >
                                    {group.category}
                                </motion.p>

                                <ul className="flex flex-wrap gap-3">
                                    {group.items.map((item, i) => (
                                        <motion.li
                                            key={item}
                                            initial={{ opacity: 0, scale: 0.85, y: 16 }}
                                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20,
                                                delay: 0.1 + i * 0.08,
                                            }}
                                            whileHover={{ y: -4 }}
                                            className="cursor-default border border-[#b3b1ab] px-4 py-2 text-[clamp(0.9rem,1vw,1.05rem)] text-[#161c2b] transition-colors duration-300 hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white"
                                        >
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <div aria-hidden="true" className="h-[1.5px] w-full bg-[#0A0A0A]/15" />
                    </div>
                </div>
            </div>

            {/* endless scrolling strip of every tool, as outlined type (CSS animation, not JS) */}
            <div
                aria-hidden="true"
                className="mt-[clamp(3rem,5vw,5rem)] -mx-[clamp(1.5rem,5vw,5.5rem)] overflow-hidden"
            >
                <div className="marquee-track flex w-max">
                    {[0, 1].map((copy) => (
                        <div key={copy} className="flex shrink-0 items-center whitespace-nowrap">
                            {allTools.map((tool) => (
                                <span
                                    key={tool}
                                    className="flex items-center text-[clamp(2rem,4vw,3.75rem)] font-medium leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_#0A0A0A]"
                                >
                                    {tool}
                                    <span
                                        className="mx-[clamp(1.25rem,2.4vw,2.25rem)] inline-block h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: ACCENT }}
                                    />
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
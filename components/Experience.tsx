"use client";

import { useState } from "react";
import { motion } from "motion/react";

const ACCENT = "#E53935";
const EASE = [0.22, 1, 0.36, 1] as const;

type Job = {
    title: string;
    role?: string;
    start: string;
    end: string; // "Present" shows a pulsing dot
};

const jobs: Job[] = [
    {
        title: "Kuku",
        role: "AI Sound Engineer",
        start: "2026",
        end: "Present",
    },
    {
        title: "Independent Sound Engineer & Music Producer",
        start: "2022",
        end: "Present",
    },
];

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

export default function Experience() {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <section className="w-full whitespace-normal bg-[#f8f7f4] px-[clamp(1.5rem,5vw,5.5rem)] py-[clamp(4rem,9vw,9rem)] text-[#0A0A0A]">
            <div className="mx-auto w-full max-w-[1500px]">
                <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#7a746f] ">
                    Experience
                </p>
                <h2 className="text-[clamp(2rem,4vw,4rem)]  font-medium leading-[0.95] tracking-tight">
                    <RiseWords text="Experience" />
                </h2>

                {/* leaving the list resets the dimming */}
                <ul
                    className="mt-[clamp(3rem,6vw,6rem)]"
                    onMouseLeave={() => setHovered(null)}
                >
                    {jobs.map((job, i) => {
                        const isHovered = hovered === i;
                        const isDimmed = hovered !== null && !isHovered;

                        return (
                            <motion.li
                                key={job.title}
                                onMouseEnter={() => setHovered(i)}
                                animate={{ opacity: isDimmed ? 0.4 : 1 }}
                                transition={{ duration: 0.3 }}
                                className="relative"
                            >
                                {/* top rule draws in from the left */}
                                <motion.div
                                    aria-hidden="true"
                                    className="h-[1.5px] w-full origin-left bg-[#0A0A0A]/15"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: i * 0.1, ease: EASE }}
                                />

                                <motion.div
                                    className="flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-10"
                                    initial={{ opacity: 0, y: 28 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                                    transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: EASE }}
                                >
                                    <div className="min-w-0">
                                        {/* title slides right and turns red on hover */}
                                        <motion.h3
                                            className="text-[clamp(1.5rem,2.6vw,1.8rem)] font-medium leading-[1.05] tracking-tight"
                                            animate={{
                                                x: isHovered ? 16 : 0,
                                                color: isHovered ? ACCENT : "#0A0A0A",
                                            }}
                                            transition={{ duration: 0.45, ease: EASE }}
                                        >
                                            {job.title}
                                        </motion.h3>

                                        {job.role && (
                                            <p className="mt-2 text-[clamp(1rem,1.3vw,1.375rem)] text-[#483A35]">
                                                {job.role}
                                            </p>
                                        )}
                                    </div>

                                    {/* years, with a pulsing dot for ongoing roles */}
                                    <p className="flex shrink-0 items-center gap-3 text-[clamp(1rem,1.3vw,1.375rem)] tabular-nums">
                                        <span>{job.start}</span>
                                        <span aria-hidden="true" className="h-px w-6 bg-[#0A0A0A]/40" />
                                        <span className="flex items-center gap-2">
                                            {job.end}
                                            {job.end === "Present" && (
                                                <span
                                                    aria-hidden="true"
                                                    className="relative flex h-2.5 w-2.5"
                                                >
                                                    <span
                                                        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                                                        style={{ backgroundColor: ACCENT }}
                                                    />
                                                    <span
                                                        className="relative inline-flex h-2.5 w-2.5 rounded-full"
                                                        style={{ backgroundColor: ACCENT }}
                                                    />
                                                </span>
                                            )}
                                        </span>
                                    </p>
                                </motion.div>
                            </motion.li>
                        );
                    })}
                </ul>

                {/* closing rule */}
                <motion.div
                    aria-hidden="true"
                    className="h-[1.5px] w-full origin-left bg-[#0A0A0A]/15"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: EASE }}
                />
            </div>
        </section>
    );
}
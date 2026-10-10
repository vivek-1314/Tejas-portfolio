"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";

const ACCENT = "#E53935";
const EASE = [0.22, 1, 0.36, 1] as const;

type Chapter = {
    tag: string;
    question: string;
    answer: string;
    path: string[];
};

const chapters: Chapter[] = [
    {
        tag: "2022 · The beginning",
        question:
            "How did I discover interest in sound, and what made me want to pursue it seriously?",
        answer:
            "My journey into sound began in 2022 through singing and creating cover songs. I started by recording and sharing my covers, which gradually led me to explore music production, mixing and mastering. As I became more involved in music, watching films and television made me increasingly aware of how sound shapes visual storytelling.",
        path: [
            "2022 · Singing & covers",
            "Music production",
            "Mixing & mastering",
            "Audiovisual sound design",
        ],
    },
    {
        tag: "The shift · Sound meets picture",
        question:
            "How did my work evolve from music production into sound design and storytelling?",
        answer:
            "My transition into sound design grew naturally from my work in music. Watching films, particularly Indian and South Indian cinema, made me increasingly fascinated by how sound can shape atmosphere, emotion and storytelling. I began experimenting with re-sound design and creating sound for visual scenes, which gradually led me to explore SFX, ambience, Foley and sound for pictures. ",
        path: [
            "Film & South Indian cinema",
            "Re-sound design",
            "SFX · Ambience · Foley",
            "Micro-dramas & audio storytelling",
        ],
    },
    {
        tag: "What's next · Interactive sound",
        question: "What I want to explore through sound in the future, and why?",
        answer:
            "Looking ahead, I want to explore the technological and interactive possibilities of sound, particularly in game audio and other interactive media. I am fascinated by how sound can respond to characters, environments and player interaction rather than follow a fixed timeline. I am currently developing my understanding of audio implementation through online courses and independent learning, and I want to further explore how sound can shape perception, emotion and storytelling in interactive experiences. ",
        path: [
            "Game audio",
            "Interactive media",
            "Audio implementation",
            "Writing & singing my own music",
        ],
    },
];

// words rise out of a mask, one after another, when scrolled into view
function RiseWords({
    text,
    className = "",
    delay = 0,
}: {
    text: string;
    className?: string;
    delay?: number;
}) {
    return (
        <span className={className}>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {text.split(" ").map((word, i) => (
                    <span
                        key={`${word}-${i}`}
                        className="mr-[0.25em] inline-block overflow-hidden pb-[0.15em] align-top -mb-[0.15em]"
                    >
                        <motion.span
                            className="inline-block will-change-transform"
                            initial={{ y: "110%" }}
                            whileInView={{ y: "0%" }}
                            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                            transition={{ duration: 0.8, delay: delay + i * 0.04, ease: EASE }}
                        >
                            {word}
                        </motion.span>
                    </span>
                ))}
            </span>
        </span>
    );
}

// the journey steps appear one by one, joined by red arrows
function Path({ steps }: { steps: string[] }) {
    return (
        <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
            {steps.map((step, i) => (
                <motion.li
                    key={step}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                    transition={{ duration: 0.6, delay: i * 0.14, ease: EASE }}
                >
                    <span className="border border-[#b3b1ab] px-4 py-2 text-[14px] text-[#161c2b]">
                        {step}
                    </span>
                    {i < steps.length - 1 && (
                        <span aria-hidden="true" style={{ color: ACCENT }}>
                            →
                        </span>
                    )}
                </motion.li>
            ))}
        </ol>
    );
}

export default function StoryJourney() {
    const listRef = useRef<HTMLOListElement>(null);

    // the red line fills down the timeline as you scroll
    const { scrollYProgress } = useScroll({
        target: listRef,
        offset: ["start 60%", "end 60%"],
    });
    const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

    return (
        <section id="story" className="w-full whitespace-normal bg-[#f8f7f4] px-[clamp(1.5rem,5vw,5.5rem)] py-[clamp(4rem,9vw,9rem)] text-[#0A0A0A]">
            <div className="mx-auto w-full max-w-[1500px]">
                <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#7a746f]">
                    Story
                </p>
                <h2 className="text-[clamp(2rem,4vw,4rem)]  font-medium leading-[0.95] tracking-tight">
                    <RiseWords text="My Story / Journey" />
                </h2>

                <ol ref={listRef} className="relative mt-[clamp(3rem,7vw,7rem)]">
                    {/* timeline rail + red progress line */}
                    <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-[7px] top-0 w-px bg-[#0A0A0A]/15"
                    />
                    <motion.span
                        aria-hidden="true"
                        className="absolute left-[7px] top-0 h-full w-px origin-top"
                        style={{ scaleY: fill, backgroundColor: ACCENT }}
                    />

                    {chapters.map((chapter, i) => (
                        <li
                            key={chapter.tag}
                            className="relative pb-[clamp(4rem,8vw,8rem)] pl-10 last:pb-0 lg:pl-24"
                        >
                            {/* dot: turns red once the line reaches it */}
                            <motion.span
                                aria-hidden="true"
                                className="absolute left-0 top-[0.35rem] h-[15px] w-[15px] rounded-full border-[1.5px]"
                                initial={{
                                    backgroundColor: "#f8f7f4",
                                    borderColor: "rgba(10,10,10,0.3)",
                                    scale: 1,
                                }}
                                whileInView={{
                                    backgroundColor: ACCENT,
                                    borderColor: ACCENT,
                                    scale: 1.25,
                                }}
                                viewport={{ once: true, margin: "0px 0px -45% 0px" }}
                                transition={{ duration: 0.4, ease: EASE }}
                            />

                            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
                                {/* left: number, tag, question */}
                                <div>
                                    <p className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#7a746f]">
                                        <span style={{ color: ACCENT }}>
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span>{chapter.tag}</span>
                                    </p>
                                    <h3 className="text-[clamp(1.5rem,2.6vw,1.8rem)] font-medium leading-[1.1] tracking-tight">
                                        <RiseWords text={chapter.question} />
                                    </h3>
                                </div>

                                {/* right: answer + journey steps */}
                                <div>
                                    <motion.p
                                        className="text-[clamp(1rem,1.15vw,1rem)] leading-relaxed text-[#483A35]"
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                                        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
                                    >
                                        {chapter.answer}
                                    </motion.p>

                                    <Path steps={chapter.path} />
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
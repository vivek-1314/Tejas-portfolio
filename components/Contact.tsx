"use client";

import { useState } from "react";
import { motion } from "motion/react";

const ACCENT = "#E53935";
const EASE = [0.22, 1, 0.36, 1] as const;

const EMAIL = "tejasyadav246@gmail.com";
const LINKTREE = "https://linktr.ee/tejasyadav246";

type LinkItem = { label: string; handle: string; href: string };

// grouped the way they appear on the Linktree
const groups: { title: string; links: LinkItem[] }[] = [
    {
        title: "Professional",
        links: [
            { label: "Email", handle: EMAIL, href: `mailto:${EMAIL}` },
            {
                label: "LinkedIn",
                handle: "tejas-yadav",
                href: "https://www.linkedin.com/in/tejas-yadav-348862381",
            },
        ],
    },
    {
        title: "Music & Social",
        links: [
            {
                label: "YouTube",
                handle: "@dehleez246",
                href: "https://www.youtube.com/@dehleez246",
            },
            {
                label: "Instagram · Artist / Music",
                handle: "@tejasmusicx",
                href: "https://www.instagram.com/tejasmusicx",
            },
            {
                label: "Instagram · SFX & Sound Design",
                handle: "@tsaudio.sfx",
                href: "https://www.instagram.com/tsaudio.sfx",
            },
        ],
    },
];

function Arrow() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-rotate-45"
        >
            <path d="M2 8h11M9 4l4 4-4 4" />
        </svg>
    );
}

// words rise out of a mask, one after another
function RiseWords({ text, delay = 0 }: { text: string; delay?: number }) {
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
                            transition={{ duration: 0.9, delay: delay + i * 0.07, ease: EASE }}
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

// a Linktree-style button: black fill wipes up from the bottom on hover
function LinkButton({ item, delay }: { item: LinkItem; delay: number }) {
    const isExternal = item.href.startsWith("http");

    return (
        <motion.a
            {...rise(delay)}
            href={item.href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="group relative flex w-full items-center justify-between gap-4 overflow-hidden border border-[#0A0A0A]/25 px-5 py-4 transition-colors duration-500 hover:border-[#0A0A0A] hover:text-white sm:px-6 sm:py-5"
        >
            <span
                aria-hidden="true"
                className="absolute inset-0 translate-y-full bg-[#0A0A0A] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
            />
            <span className="relative z-10 min-w-0">
                <span className="block text-[clamp(1.1rem,1.8vw,1.5rem)] font-medium leading-tight">
                    {item.label}
                </span>
                <span className="mt-1 block truncate text-[clamp(0.9rem,1.05vw,1.1rem)] opacity-60">
                    {item.handle}
                </span>
            </span>
            <span className="relative z-10">
                <Arrow />
            </span>
        </motion.a>
    );
}

export default function Contact() {
    const [copied, setCopied] = useState(false);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // clipboard blocked: the mailto link still works
        }
    };

    return (
        <section className="w-full whitespace-normal overflow-x-clip bg-[#f8f7f4] px-[clamp(1.5rem,5vw,5.5rem)] pb-8 pt-[clamp(4rem,8vw,8rem)] text-[#0A0A0A]">
            <div className="mx-auto w-full max-w-[1500px]">
                <motion.p
                    {...rise()}
                    className="mb-6 text-xs uppercase tracking-[0.2em] text-[#7a746f]"
                >
                    Contact
                </motion.p>

                <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
                    {/* the closing line */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <h2 className="text-[clamp(2.25rem,5vw,5rem)] font-medium leading-[1] tracking-tight">
                            <RiseWords text="Let's make something worth hearing." />
                        </h2>

                        <motion.button
                            {...rise(0.3)}
                            type="button"
                            onClick={copyEmail}
                            className="mt-8 inline-flex items-center gap-3 text-[clamp(1rem,1.3vw,1.375rem)] underline underline-offset-4 transition-colors duration-300 hover:text-[#E53935]"
                        >
                            {EMAIL}
                            <span
                                className="border px-2 py-0.5 text-[11px] uppercase tracking-[0.14em] no-underline"
                                style={{
                                    borderColor: copied ? ACCENT : "rgba(10,10,10,0.25)",
                                    color: copied ? ACCENT : undefined,
                                }}
                            >
                                {copied ? "Copied" : "Copy"}
                            </span>
                        </motion.button>
                    </div>

                    {/* Linktree-style list */}
                    <div className="space-y-10">
                        {groups.map((group, g) => (
                            <div key={group.title}>
                                <motion.p
                                    {...rise(g * 0.1)}
                                    className="mb-4 text-xs uppercase tracking-[0.18em] text-[#7a746f]"
                                >
                                    {group.title}
                                </motion.p>
                                <div className="space-y-3">
                                    {group.links.map((item, i) => (
                                        <LinkButton
                                            key={item.label}
                                            item={item}
                                            delay={0.1 + i * 0.08}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* all links, on the Linktree */}
                        <motion.a
                            {...rise(0.1)}
                            href={LINKTREE}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex w-full items-center justify-between gap-4 border border-[#0A0A0A] bg-[#0A0A0A] px-5 py-4 text-white transition-colors duration-300 hover:border-[#E53935] hover:bg-[#E53935] sm:px-6 sm:py-5"
                        >
                            <span>
                                <span className="block text-[clamp(1.1rem,1.8vw,1.5rem)] font-medium leading-tight">
                                    All my links
                                </span>
                                <span className="mt-1 block text-[clamp(0.9rem,1.05vw,1.1rem)] opacity-70">
                                    linktr.ee/tejasyadav246
                                </span>
                            </span>
                            <Arrow />
                        </motion.a>
                    </div>
                </div>

                {/* footer */}
                <motion.div
                    {...rise()}
                    className="mt-[clamp(4rem,8vw,8rem)] flex flex-wrap items-center justify-between gap-3 border-t border-[#0A0A0A]/15 pt-6 text-xs uppercase tracking-[0.14em] text-[#7a746f]"
                >
                    <span>© 2026 Tejas Yadav</span>
                    <span>dehleez.studio</span>
                </motion.div>

                {/* credit, very end of the page */}
                <p
                    className="mt-4 text-center text-[0.7rem] uppercase tracking-[0.14em] text-black"
                >
                    Built and managed by Vivek
                </p>

            </div>
        </section>
    );
}
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
    KeyboardEvent as ReactKeyboardEvent,
    PointerEvent as ReactPointerEvent,
} from "react";
import { motion } from "motion/react";

const ACCENT = "#E53935";
const EASE = [0.22, 1, 0.36, 1] as const;
const BARS = 72;

type Story = {
    title: string;
    /** original audio, before sound design */
    before: string;
    /** final, sound-designed audio */
    after: string;
    description?: string;
    /** optional chips, e.g. what was added in the sound design */
    layers?: string[];
};

// TODO: replace with your real Kuku FM projects.
// Put the audio files in /public/audio/kuku-fm/ and keep the paths below in sync.
// Add as many projects as you like; the list on the left builds itself.
const stories: Story[] = [
    {
        title: "Audio Storytelling · 01",
        before: "/audio/before-audio.mp3",
        after: "/audio/after-audio.mp3",
    },
];

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function fmt(s: number) {
    if (!Number.isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
}

// small seeded random, so each project gets its own (stable) waveform shape
function rng(seed: number) {
    let t = seed;
    return () => {
        t += 0x6d2b79f5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

// Two stylised shapes of the same clip: "before" is thin and sparse (just the voice),
// "after" is fuller (voice + the layers added in sound design). Switching morphs one
// into the other. (It's an illustration, not the real audio data.)
function makeShapes(seed: number) {
    const r = rng(seed * 7919);
    const before: number[] = [];
    const after: number[] = [];

    for (let i = 0; i < BARS; i++) {
        const phrase = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.37 + seed));
        const b = clamp(0.08 + phrase * (0.25 + r() * 0.3), 0.08, 0.6);
        const body = 0.5 + 0.5 * Math.abs(Math.sin(i * 0.21 + seed * 2));
        const a = clamp(b + 0.12 + r() * 0.3 * body, 0.15, 1);
        before.push(b);
        after.push(a);
    }

    return { before, after };
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

function Bars({
    heights,
    color,
    className = "",
}: {
    heights: number[];
    color: string;
    className?: string;
}) {
    return (
        <div
            aria-hidden="true"
            className={`flex items-center justify-between gap-[2px] ${className}`}
        >
            {heights.map((h, i) => (
                <span
                    key={i}
                    className="block h-full max-w-[5px] flex-1 rounded-full transition-[transform,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                    style={{
                        backgroundColor: color,
                        transform: `scaleY(${h})`,
                        transitionDelay: `${i * 7}ms`,
                    }}
                />
            ))}
        </div>
    );
}

type Side = "before" | "after";

// A/B player. Both versions play at the same time, perfectly in sync; the switch only
// decides which one you hear. So flipping between them is instant and lands on exactly
// the same moment of the story.
function BeforeAfterPlayer({ story, seed }: { story: Story; seed: number }) {
    const beforeRef = useRef<HTMLAudioElement>(null);
    const afterRef = useRef<HTMLAudioElement>(null);
    const fillRef = useRef<HTMLDivElement>(null);
    const timeRef = useRef<HTMLSpanElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const fadeFrame = useRef(0);
    const dragging = useRef(false);

    const [side, setSide] = useState<Side>("before");
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState(false);

    const sideRef = useRef<Side>("before");
    const shapes = useMemo(() => makeShapes(seed), [seed]);
    const heights = side === "before" ? shapes.before : shapes.after;

    // update the progress fill and the clock without re-rendering React every frame
    const paint = useCallback(() => {
        const a = (sideRef.current === "before" ? beforeRef : afterRef).current;
        const d = a && Number.isFinite(a.duration) ? a.duration : 0;
        const t = a ? a.currentTime : 0;
        const p = d ? clamp(t / d, 0, 1) : 0;

        if (fillRef.current) fillRef.current.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
        if (timeRef.current) timeRef.current.textContent = `${fmt(t)} / ${fmt(d)}`;
        if (sliderRef.current) sliderRef.current.setAttribute("aria-valuenow", String(Math.round(p * 100)));
    }, []);

    // while playing: move the fill smoothly and keep the two tracks locked together
    useEffect(() => {
        if (!playing) return;

        let raf = 0;
        const tick = () => {
            const b = beforeRef.current;
            const a = afterRef.current;

            if (a && b) {
                const lead = sideRef.current === "before" ? b : a;
                const follow = lead === b ? a : b;
                if (Math.abs(lead.currentTime - follow.currentTime) > 0.15) {
                    follow.currentTime = lead.currentTime;
                }
            }

            paint();
            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [playing, paint]);

    // switching versions: a very short crossfade so the swap never clicks.
    // (muted is set too, because iOS ignores the volume property)
    useEffect(() => {
        sideRef.current = side;

        const b = beforeRef.current;
        const a = afterRef.current;
        if (!a || !b) return;

        const from = { b: b.volume, a: a.volume };
        const to = { b: side === "before" ? 1 : 0, a: side === "after" ? 1 : 0 };
        const incoming = side === "before" ? b : a;
        const outgoing = side === "before" ? a : b;
        const start = performance.now();
        const length = 90;

        incoming.muted = false;
        cancelAnimationFrame(fadeFrame.current);

        const step = (now: number) => {
            const k = clamp((now - start) / length, 0, 1);
            b.volume = from.b + (to.b - from.b) * k;
            a.volume = from.a + (to.a - from.a) * k;

            if (k < 1) {
                fadeFrame.current = requestAnimationFrame(step);
            } else {
                outgoing.muted = true;
            }
        };

        fadeFrame.current = requestAnimationFrame(step);
        paint();

        return () => cancelAnimationFrame(fadeFrame.current);
    }, [side, paint]);

    // stop everything when this player goes away (e.g. another project is picked)
    useEffect(() => {
        const b = beforeRef.current;
        const a = afterRef.current;

        return () => {
            b?.pause();
            a?.pause();
        };
    }, []);

    const readDuration = () => {
        const d = Math.max(
            Number.isFinite(beforeRef.current?.duration ?? NaN) ? beforeRef.current!.duration : 0,
            Number.isFinite(afterRef.current?.duration ?? NaN) ? afterRef.current!.duration : 0
        );
        setDuration(d);
        paint();
    };

    const togglePlay = async () => {
        const b = beforeRef.current;
        const a = afterRef.current;
        if (!a || !b) return;

        if (playing) {
            a.pause();
            b.pause();
            setPlaying(false);
            return;
        }

        try {
            const lead = sideRef.current === "before" ? b : a;
            const follow = lead === b ? a : b;
            follow.currentTime = lead.currentTime;
            await Promise.all([b.play(), a.play()]);
            setPlaying(true);
        } catch {
            setError(true);
        }
    };

    const finish = () => {
        const b = beforeRef.current;
        const a = afterRef.current;
        a?.pause();
        b?.pause();
        if (a) a.currentTime = 0;
        if (b) b.currentTime = 0;
        setPlaying(false);
        paint();
    };

    const seekTo = (ratio: number) => {
        const b = beforeRef.current;
        const a = afterRef.current;
        if (!duration || !a || !b) return;

        const t = clamp(ratio, 0, 1) * duration;
        a.currentTime = t;
        b.currentTime = t;
        paint();
    };

    const seekFromPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        seekTo((e.clientX - rect.left) / rect.width);
    };

    const onSliderKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
        const a = (sideRef.current === "before" ? beforeRef : afterRef).current;
        if (!a || !duration) return;

        if (e.key === "ArrowRight") seekTo((a.currentTime + 5) / duration);
        else if (e.key === "ArrowLeft") seekTo((a.currentTime - 5) / duration);
        else if (e.key === "Home") seekTo(0);
        else if (e.key === "End") seekTo(1);
        else return;

        e.preventDefault();
    };

    const isAfter = side === "after";

    return (
        <div className="relative border border-[#0A0A0A]/15 bg-white/40">
            {/* top strip: black for the original, red for the sound-designed version */}
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px] transition-colors duration-500"
                style={{ backgroundColor: isAfter ? ACCENT : "#0A0A0A" }}
            />

            <div className="p-5 sm:p-7 lg:p-9">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#7a746f]">Now comparing</p>
                <h3 className="mt-2 text-[clamp(1.4rem,2.2vw,2.2rem)] font-medium leading-tight tracking-tight">
                    {story.title}
                </h3>

                {story.description && (
                    <p className="mt-3 max-w-[60ch] text-[clamp(0.9rem,1vw,1.05rem)] leading-relaxed text-[#483A35]">
                        {story.description}
                    </p>
                )}

                {/* the switch */}
                <div
                    role="group"
                    aria-label="Choose which version to hear"
                    className="relative mt-6 grid max-w-[520px] grid-cols-2 border border-[#0A0A0A]/20 p-1"
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-y-1 left-1 w-[calc(50%_-_4px)] transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                        style={{
                            transform: isAfter ? "translateX(100%)" : "translateX(0)",
                            backgroundColor: isAfter ? ACCENT : "#0A0A0A",
                        }}
                    />
                    {(
                        [
                            ["before", "Before", "Original audio"],
                            ["after", "After", "Sound-designed"],
                        ] as const
                    ).map(([value, label, sub]) => {
                        const on = side === value;

                        return (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={on}
                                onClick={() => setSide(value)}
                                className={`relative z-10 px-4 py-3 text-left transition-colors duration-300 sm:px-5 ${on ? "text-white" : "text-[#0A0A0A]"
                                    }`}
                            >
                                <span className="block text-[clamp(1rem,1.4vw,1.35rem)] font-medium leading-none tracking-tight">
                                    {label}
                                </span>
                                <span
                                    className={`mt-1 block text-[10px] uppercase tracking-[0.14em] transition-opacity duration-300 ${on ? "opacity-80" : "opacity-50"
                                        }`}
                                >
                                    {sub}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* waveform: click or drag to scrub */}
                <div
                    ref={sliderRef}
                    role="slider"
                    tabIndex={0}
                    aria-label="Seek through the audio"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={0}
                    onPointerDown={(e) => {
                        dragging.current = true;
                        e.currentTarget.setPointerCapture(e.pointerId);
                        seekFromPointer(e);
                    }}
                    onPointerMove={(e) => {
                        if (dragging.current) seekFromPointer(e);
                    }}
                    onPointerUp={() => {
                        dragging.current = false;
                    }}
                    onPointerCancel={() => {
                        dragging.current = false;
                    }}
                    onKeyDown={onSliderKey}
                    className="relative mt-8 h-24 w-full cursor-pointer touch-pan-y select-none sm:h-28 lg:h-32"
                >
                    <Bars
                        heights={heights}
                        color="rgba(10,10,10,0.15)"
                        className="absolute inset-0"
                    />
                    <div
                        ref={fillRef}
                        className="absolute inset-0"
                        style={{ clipPath: "inset(0 100% 0 0)" }}
                    >
                        <Bars
                            heights={heights}
                            color={isAfter ? ACCENT : "#0A0A0A"}
                            className="absolute inset-0"
                        />
                    </div>
                </div>

                {/* controls */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={togglePlay}
                            disabled={error}
                            aria-label={playing ? "Pause" : "Play"}
                            className="grid h-14 w-14 place-items-center rounded-full bg-[#0A0A0A] text-white transition-colors duration-300 hover:bg-[#E53935] disabled:opacity-40 sm:h-16 sm:w-16"
                        >
                            {playing ? (
                                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <rect x="6" y="5" width="4" height="14" />
                                    <rect x="14" y="5" width="4" height="14" />
                                </svg>
                            ) : (
                                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 translate-x-[1px]">
                                    <path d="M7 4.5v15l13-7.5z" />
                                </svg>
                            )}
                        </button>
                        <span ref={timeRef} className="text-sm tabular-nums text-[#483A35]">
                            0:00 / 0:00
                        </span>
                    </div>

                    <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-[#7a746f]">
                        <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
                            {[0, 0.25, 0.5].map((d) => (
                                <span
                                    key={d}
                                    className={`ab-meter block h-full w-[2px] ${playing ? "" : "[animation-play-state:paused]"
                                        }`}
                                    style={{
                                        backgroundColor: isAfter ? ACCENT : "#0A0A0A",
                                        animationDelay: `${d}s`,
                                    }}
                                />
                            ))}
                        </span>
                        Now hearing · {isAfter ? "Sound-designed" : "Original audio"}
                    </p>
                </div>

                {error && (
                    <p role="status" className="mt-4 text-sm text-[#7a746f]">
                        This audio isn&apos;t available right now.
                    </p>
                )}

                {story.layers && story.layers.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                        {story.layers.map((layer) => (
                            <li
                                key={layer}
                                className="border border-[#b3b1ab] px-3 py-1.5 text-[12px] text-[#161c2b]"
                            >
                                {layer}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* the two versions: always loaded together, always in sync */}
            <audio
                ref={beforeRef}
                src={story.before}
                preload="metadata"
                onLoadedMetadata={readDuration}
                onError={() => setError(true)}
                onEnded={() => sideRef.current === "before" && finish()}
            />
            <audio
                ref={afterRef}
                src={story.after}
                preload="metadata"
                muted
                onLoadedMetadata={readDuration}
                onError={() => setError(true)}
                onEnded={() => sideRef.current === "after" && finish()}
            />
        </div>
    );
}

export default function AudioStories() {
    const [current, setCurrent] = useState(0);
    const story = stories[current];

    return (
        <section className="w-full mt-15 whitespace-normal overflow-x-clip bg-[#f8f7f4] px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(3rem,6vw,6rem)] text-[#0A0A0A]">
            <style>{`
                @keyframes ab-meter {
                    0%, 100% { transform: scaleY(0.25); }
                    50% { transform: scaleY(1); }
                }
                .ab-meter {
                    transform-origin: bottom;
                    animation: ab-meter 0.9s ease-in-out infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .ab-meter { animation: none; transform: scaleY(0.6); }
                }
            `}</style>

            <div className="mx-auto w-full max-w-[1500px]">
                <h2 className="text-[clamp(2rem,4vw,4rem)] font-medium leading-none tracking-tight">
                    <RiseWords text="Audio Storytelling & Sound Design" />
                </h2>

                <motion.p
                    {...rise(0.15)}
                    className="mt-6 max-w-[62ch] text-[clamp(1rem,1.3vw,1.375rem)] leading-relaxed text-[#483A35]"
                >
                    A before-and-after showcase of audio storytelling project, highlighting my sound-design process and the transformation
                    from original audio to the final sound-designed version.
                </motion.p>

                <motion.div
                    {...rise(0.25)}
                    className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#7a746f]"
                >
                    <span>Role</span>
                    <span aria-hidden="true" className="h-px w-8 bg-[#0A0A0A]/25" />
                    <span className="text-[#0A0A0A]">Sound Designer</span>
                </motion.div>

                <div className="mt-[clamp(2rem,4vw,3.5rem)] grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.6fr)]">
                    {/* project list: name on the left, player box on the right */}
                    <ul className="self-start">
                        {stories.map((s, i) => {
                            const on = i === current;

                            return (
                                <li key={s.title}>
                                    <button
                                        type="button"
                                        onClick={() => setCurrent(i)}
                                        aria-current={on}
                                        className="relative flex w-full items-baseline gap-4 border-b border-[#0A0A0A]/10 py-4 text-left"
                                    >
                                        <span
                                            className="w-8 shrink-0 text-xs tabular-nums transition-colors duration-300"
                                            style={{ color: on ? ACCENT : "#7a746f" }}
                                        >
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span
                                            className={`text-[clamp(1.1rem,1.8vw,1.6rem)] font-medium leading-tight tracking-tight transition-[opacity,transform] duration-300 ${on ? "translate-x-2 opacity-100" : "opacity-40"
                                                }`}
                                        >
                                            {s.title}
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className={`absolute inset-x-0 -bottom-px h-[1.5px] origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "scale-x-100" : "scale-x-0"
                                                }`}
                                            style={{ backgroundColor: ACCENT }}
                                        />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {/* the player: remounts per project, which also stops the previous audio */}
                    <div>
                        <BeforeAfterPlayer key={story.title} story={story} seed={current + 1} />
                    </div>
                </div>
            </div>
        </section>
    );
}
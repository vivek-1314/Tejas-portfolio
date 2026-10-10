"use client";

import { useMemo, useRef, useState, type MouseEvent } from "react";
import { motion } from "motion/react";

const ACCENT = "#E53935";
const EASE = [0.22, 1, 0.36, 1] as const;
const BARS = 28;

// small seeded random so the waveform looks the same on every load
function rng(seed: number) {
    let t = seed;
    return () => {
        t += 0x6d2b79f5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

const fmt = (s: number) => {
    if (!Number.isFinite(s) || s < 0) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

export default function WelcomeNote({
    src = "/audio/welcome-note.wav",
    show = true,
    delay = 0.7,
}: {
    src?: string;
    show?: boolean;
    delay?: number;
}) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [started, setStarted] = useState(false);
    const [progress, setProgress] = useState(0); // 0 -> 1
    const [duration, setDuration] = useState(0);

    // static bar heights: no per-bar animation, so it stays very light
    const heights = useMemo(() => {
        const r = rng(2026);
        return Array.from({ length: BARS }, (_, i) => {
            const envelope = 0.35 + 0.65 * Math.sin((Math.PI * (i + 1)) / (BARS + 1));
            return Math.max(0.2, (0.3 + r() * 0.7) * envelope);
        });
    }, []);

    const toggle = async () => {
        const a = audioRef.current;
        if (!a) return;
        if (a.paused) {
            try {
                await a.play(); // sound only after a click (browsers block autoplay)
                setPlaying(true);
                setStarted(true);
            } catch {
                // file missing or blocked
            }
        } else {
            a.pause();
            setPlaying(false);
        }
    };

    // click the waveform to jump to that point
    const seek = (e: MouseEvent<HTMLDivElement>) => {
        const a = audioRef.current;
        if (!a || !a.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        a.currentTime = ratio * a.duration;
        setProgress(ratio);
    };

    const label = playing ? "Playing" : started ? "Play again" : "Welcome note";

    // the same bars drawn twice: grey underneath, red on top, revealed by clip-path
    const barRow = (color: string) => (
        <div className="flex h-full items-center gap-[2px]">
            {heights.map((h, i) => (
                <span
                    key={i}
                    className="block flex-1 rounded-full"
                    style={{ height: `${h * 100}%`, backgroundColor: color }}
                />
            ))}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay, ease: EASE }}
            className="mt-15 w-full max-w-[300px]"
        >
            <div className="flex items-center gap-3 border border-[#b3b1ab] px-3 py-2 font-archivo text-[11px] tracking-[0.02em] text-[#161c2b]">
                {/* play / pause */}
                <button
                    type="button"
                    onClick={toggle}
                    aria-label={playing ? "Pause welcome note" : "Play welcome note"}
                    className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: ACCENT }}
                >
                    {/* one soft ring until it has been played once */}
                    {!started && (
                        <span
                            className="absolute inset-0 animate-ping rounded-full opacity-30"
                            style={{ backgroundColor: ACCENT }}
                        />
                    )}
                    <svg viewBox="0 0 24 24" fill="currentColor" className="relative h-3.5 w-3.5">
                        {playing ? (
                            <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
                        ) : (
                            <path d="M9 5v14l11-7z" />
                        )}
                    </svg>
                </button>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em]">
                        <span>{label}</span>
                        <span className="tabular-nums text-[#7a746f]">
                            {fmt(progress * duration)} / {fmt(duration)}
                        </span>
                    </div>

                    {/* waveform: click to seek */}
                    <div
                        role="slider"
                        aria-label="Seek welcome note"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(progress * 100)}
                        onClick={seek}
                        className="relative mt-1.5 h-5 cursor-pointer"
                    >
                        {barRow("rgba(22,28,43,0.22)")}
                        <div
                            className="absolute inset-0"
                            style={{
                                clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
                                transition: "clip-path 250ms linear",
                            }}
                        >
                            {barRow(ACCENT)}
                        </div>
                    </div>
                </div>
            </div>

            <audio
                ref={audioRef}
                src={src}
                preload="metadata"
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onTimeUpdate={(e) => {
                    const a = e.currentTarget;
                    if (a.duration) setProgress(a.currentTime / a.duration);
                }}
                onEnded={() => {
                    setPlaying(false);
                    setProgress(0);
                }}
            />
        </motion.div>
    );
}
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import AnimatedLetters from "@/components/AnimatedLetters";

const images = [
    "/images/intro/studio-1.avif",
    "/images/intro/studio-2.avif",
    "/images/intro/studio-3.avif",
    "/images/intro/studio-4.avif",
    "/images/intro/studio-5.avif",
    "/images/intro/studio-6.avif",
    "/images/intro/studio-7.avif",
    "/images/intro/studio-8.avif",
    "/images/intro/studio-9.avif",
];

type Props = {
    onComplete: () => void;
};

const LINE = 1.15; // image height, in em
const IMAGE_SCALE = 1.2;
const DEFAULT_ASPECT = 1.5; // used for sizing until the images have loaded

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// Font size for the whole intro. It is based on the screen width, but the share of the
// screen the text takes is larger on phones (so it doesn't look tiny) and eases down
// to the original look on laptops and desktops. It is then capped so that the whole
// "DEH [image] LEEZ" line always fits inside the screen, and never gets too tall for
// short landscape screens.
function computeFontSize(w: number, h: number, maxAspect: number) {
    const t = clamp((w - 480) / (1024 - 480), 0, 1);
    const byWidth = w * (0.115 - 0.025 * t);

    // total line width is roughly: letters (~5.8em, incl. the split-apart shift) + image
    const fit = (w * 0.94) / (5.8 + maxAspect * LINE * IMAGE_SCALE);
    const byHeight = h * 0.3;

    return Math.round(clamp(Math.min(byWidth, fit, byHeight), 30, 128));
}

export default function IntroAnimation({ onComplete }: Props) {
    const [imageIndex, setImageIndex] = useState(0);
    const [stage, setStage] = useState(0);
    const [aspects, setAspects] = useState<number[]>([]);
    const [viewport, setViewport] = useState({ w: 1280, h: 800 });
    // true while the intro is playing: the page behind it can't be scrolled
    const [locked, setLocked] = useState(true);
    // smooth-scroll instance (undefined if smooth scrolling is off, e.g. reduced motion)
    const lenis = useLenis();

    // keep the latest callback in a ref so the timeline below runs exactly once,
    // even if the parent passes a new function on every render
    const onCompleteRef = useRef(onComplete);
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    // Track the screen size (also covers phone rotation).
    useEffect(() => {
        let frame = 0;

        const update = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                setViewport({ w: window.innerWidth, h: window.innerHeight });
            });
        };

        setViewport({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener("resize", update);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", update);
        };
    }, []);

    // Preload the images once and remember each one's aspect ratio.
    // (widths are derived from this below, so resizing never reloads anything)
    useEffect(() => {
        let cancelled = false;
        let loaded = 0;
        const result: number[] = new Array(images.length).fill(0);

        const done = () => {
            loaded += 1;
            if (loaded === images.length && !cancelled) setAspects([...result]);
        };

        images.forEach((src, index) => {
            const img = new Image();

            img.onload = () => {
                if (img.naturalHeight > 0) {
                    result[index] = img.naturalWidth / img.naturalHeight;
                }
                done();
            };
            img.onerror = done;
            img.src = src;
        });

        return () => {
            cancelled = true;
        };
    }, []);

    const maxAspect = useMemo(
        () => Math.max(DEFAULT_ASPECT, ...aspects),
        [aspects]
    );

    const fontSize = useMemo(
        () => computeFontSize(viewport.w, viewport.h, maxAspect),
        [viewport.w, viewport.h, maxAspect]
    );

    const imageWidths = useMemo(
        () => aspects.map((a) => a * fontSize * LINE * IMAGE_SCALE),
        [aspects, fontSize]
    );

    // Scroll lock: nothing behind the intro can be scrolled until it is finished.
    // Covers mouse wheel, touch, keyboard, and the Lenis smooth-scroll instance.
    useEffect(() => {
        if (!locked) return;

        const html = document.documentElement;
        const previousOverflow = html.style.overflow;

        window.scrollTo(0, 0);
        html.style.overflow = "hidden";
        lenis?.stop();

        const prevent = (e: Event) => e.preventDefault();
        const blockedKeys = [" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"];
        const preventKeys = (e: KeyboardEvent) => {
            if (blockedKeys.includes(e.key)) e.preventDefault();
        };

        window.addEventListener("wheel", prevent, { passive: false });
        window.addEventListener("touchmove", prevent, { passive: false });
        window.addEventListener("keydown", preventKeys);

        return () => {
            html.style.overflow = previousOverflow;
            lenis?.start();
            window.removeEventListener("wheel", prevent);
            window.removeEventListener("touchmove", prevent);
            window.removeEventListener("keydown", preventKeys);
        };
    }, [locked, lenis]);

    // Animation timeline:
    // Stage 0: letters enter.
    // Stage 1: words separate.
    // Stage 2: image appears and cycles.
    // Stage 3: intro fades out.
    useEffect(() => {
        const splitTimer = window.setTimeout(() => setStage(1), 1500);
        const imageTimer = window.setTimeout(() => setStage(2), 2400);
        const fadeTimer = window.setTimeout(() => setStage(3), 6500);
        const completeTimer = window.setTimeout(() => {
            // unlock right away; the parent's fade-out then plays over a scrollable page
            setLocked(false);
            onCompleteRef.current();
        }, 7200);

        return () => {
            window.clearTimeout(splitTimer);
            window.clearTimeout(imageTimer);
            window.clearTimeout(fadeTimer);
            window.clearTimeout(completeTimer);
        };
    }, []);

    // Cycle images only after the words have separated.
    useEffect(() => {
        if (stage !== 2) return;

        const interval = window.setInterval(() => {
            setImageIndex((current) => (current + 1) % images.length);
        }, 280);

        return () => window.clearInterval(interval);
    }, [stage]);

    const currentWidth =
        imageWidths[imageIndex] || fontSize * 0.9 * IMAGE_SCALE;

    return (
        <motion.div
            aria-hidden="true"
            style={{ touchAction: "none", overscrollBehavior: "contain" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#f8f7f4] text-neutral-900"
            initial={{ opacity: 1 }}
            animate={{ opacity: stage === 3 ? 0 : 1 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
        >
            <div
                className="intro-title intro-font-3 !tracking-[0.1rem] font-medium flex items-center whitespace-nowrap leading-none"
                style={{ fontSize }}
            >
                {/* Left word: letters enter first, then move left. */}
                <motion.span
                    className="inline-flex shrink-0"
                    animate={{
                        x: stage >= 1 ? -fontSize * 0.30 : 0,
                    }}
                    transition={{
                        duration: 0.25,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                >
                    <AnimatedLetters
                        text="DEH"
                        show={true}
                        staggerDelay={0.12}
                        className=""
                        size="inherit"
                    />
                </motion.span>

                {/* Image stays hidden until the words have separated. */}
                <motion.span
                    className="relative block shrink-0 overflow-hidden will-change-[width]"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{
                        width: stage >= 2 ? currentWidth : 0,
                        opacity: stage >= 2 ? 1 : 0,
                    }}
                    transition={{
                        // one smooth, quick ease-out: fast start, soft landing
                        width: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
                        // fades in a touch after the width starts moving, so it never pops
                        opacity: { duration: 0.22, delay: stage >= 2 ? 0.04 : 0, ease: "easeOut" },
                    }}
                    style={{ height: `${LINE * IMAGE_SCALE}em` }}
                >
                    {images.map((src, index) => (
                        <img
                            key={src}
                            src={src}
                            alt=""
                            draggable={false}
                            // centered, so the image is revealed from the middle outward
                            className="absolute left-1/2 top-0 h-full max-w-none -translate-x-1/2 object-cover"
                            style={{
                                width: imageWidths[index] || currentWidth,
                                opacity: stage >= 2 && imageIndex === index ? 1 : 0,
                                transition: "opacity 180ms cubic-bezier(0.22, 1, 0.36, 1)",
                            }}
                        />
                    ))}
                </motion.span>

                {/* Right word: enters after a slight delay, then moves right. */}
                <motion.span
                    className="inline-flex shrink-0"
                    animate={{
                        x: stage >= 1 ? fontSize * 0.30 : 0,
                    }}
                    transition={{
                        duration: 0.25,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                >
                    <AnimatedLetters
                        text="LEEZ"
                        show={true}
                        startDelay={0.25}
                        staggerDelay={0.12}
                        className=""
                        size="inherit"
                    />
                </motion.span>
            </div>

            {/* Tagline appears with the word separation. */}
            <motion.p
                className="absolute bottom-[calc(9%+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 whitespace-nowrap text-[clamp(10px,0.9vw,14px)] tracking-[0.2em]"
                initial={{ opacity: 0, y: 8 }}
                animate={{
                    opacity: stage >= 1 && stage < 3 ? 1 : 0,
                    y: stage >= 1 ? 0 : 8,
                }}
                transition={{ duration: 0.4 }}
            >
                SOUND · STORY · SPACE
            </motion.p>
        </motion.div>
    );
}
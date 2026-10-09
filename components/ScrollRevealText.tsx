"use client";

import { useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    type MotionValue,
} from "motion/react";

type ScrollRevealTextProps = {
    text: string;
    /** how long the pinned scroll lasts, in screen heights (more = slower reveal) */
    scrollLength?: number;
    fromColor?: string;
    toColor?: string;
    className?: string;
    imageSrc?: string;
    imageAlt?: string;
};

type CharProps = {
    char: string;
    index: number;
    total: number;
    progress: MotionValue<number>;
    fromColor: string;
    toColor: string;
};

function Char({ char, index, total, progress, fromColor, toColor }: CharProps) {
    // chars fill in order across the first 85% of the scroll; the last part just
    // holds the finished (all black) text, then the page is released
    const start = (index / total) * 0.82;
    const redEnd = start + 0.035;
    const blackEnd = start + 0.09;
    const color = useTransform(
        progress,
        [start, redEnd, blackEnd],
        [fromColor, "#E53935", toColor]
    );

    return <motion.span style={{ color }}>{char}</motion.span>;
}

export default function ScrollRevealText({
    text,
    scrollLength = 7,
    fromColor = "#c9c7c1",
    toColor = "#0A0A0A",
    className = "",
    imageSrc = "/images/intro/hero-portrait-1.avif",
    imageAlt = "",
}: ScrollRevealTextProps) {
    const ref = useRef<HTMLDivElement>(null);

    // 0 when the section reaches the top (pins), 1 when the pin is released
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });

    const words = text.split(" ");
    const total = text.replace(/ /g, "").length;
    let charIndex = 0;

    return (
        // tall wrapper = the scroll distance while the text is pinned
        <div ref={ref} className="relative" style={{ height: `${scrollLength * 100}vh` }}>
            {/* sticky stage: exactly one screen tall so the pin releases the moment the
                reveal is done (no extra "stuck" scrolling) */}
            <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#f8f7f4]">
                {/* IMAGE: right s ide on desktop, bottom on phones. The edge that touches the
                    text is faded out with a mask, so it melts into the page background
                    instead of having a hard line between image and text. The bottom edge
                    fades too (two masks combined with mask-composite: intersect). */}
                <div
                    className="absolute inset-x-0 bottom-0 h-[58%] md:inset-y-0 md:right-[-4.25rem] md:left-auto md:h-full md:w-[58vw]
                    [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_40%,black_72%,transparent_100%)]
                    [mask-image:linear-gradient(to_bottom,transparent_0%,black_40%,black_72%,transparent_100%)]
                    md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_55%),linear-gradient(to_bottom,transparent_0%,black_10%,black_70%,transparent_100%)]
                    md:[mask-image:linear-gradient(to_right,transparent_0%,black_55%),linear-gradient(to_bottom,transparent_0%,black_10%,black_70%,transparent_100%)]
                    md:[-webkit-mask-composite:source-in]
                    md:[mask-composite:intersect]"
                >
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        className="h-full w-full object-cover object-center"
                    />
                </div>


                {/* TEXT: left side on desktop, top on phones, above the image */}
                <div className="relative z-10 md:px-18 px-5 mx-auto flex h-full w-full items-start pt-[12svh] md:items-center md:pt-0">
                    {/* flex-wrap + whitespace-normal: wraps even if a parent (like the
                        intro-title class) sets white-space: nowrap, which is inherited */}
                    <p
                        className={`flex w-full flex-wrap gap-x-[0.25em] whitespace-normal text-left text-[clamp(1.6rem,6.4vw,2.5rem)] md:text-[clamp(1.75rem,min(3.2vw,6svh),4.75rem)] font-medium leading-[1.15] tracking-tight md:max-w-[46%] ${className}`}
                    >
                        {words.map((word, wordIndex) => (
                            <span
                                key={`${word}-${wordIndex}`}
                                className="inline-block whitespace-nowrap"
                            >
                                {word.split("").map((char) => {
                                    const i = charIndex++;
                                    return (
                                        <Char
                                            key={i}
                                            char={char}
                                            index={i}
                                            total={total}
                                            progress={scrollYProgress}
                                            fromColor={fromColor}
                                            toColor={toColor}
                                        />
                                    );
                                })}
                            </span>
                        ))}
                    </p>
                </div>
            </div>
        </div>
    );
}
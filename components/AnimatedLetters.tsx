"use client";

import { motion } from "motion/react";

type AnimatedLettersProps = {
    text: string;
    show: boolean;
    startDelay?: number;
    staggerDelay?: number;
    className?: string;
    /**
     * Font size of the letters. Defaults to the original 6.5rem so existing usages
     * look the same. Pass "inherit" to let the letters follow the parent's font size
     * (needed for responsive sizing, e.g. the intro animation).
     */
    size?: string;
};

export default function AnimatedLetters({
    text,
    show,
    startDelay = 0,
    staggerDelay = 0.045,
    className = "text-sm",
    size = "6.5rem",
}: AnimatedLettersProps) {
    return (
        <span className={`inline-flex ${className}`}>
            {text.split("").map((char, index) => (
                // each letter gets its own mask so it rises out of a clean edge
                <span
                    key={`${char}-${index}`}
                    className="-mx-[0.06em] block overflow-hidden px-[0.06em]"
                >
                    <motion.span
                        className="block will-change-transform font-[800]"
                        style={{ fontSize: size }}
                        initial={{ y: "110%", opacity: 0 }}
                        animate={{
                            y: show ? "0%" : "110%",
                            opacity: show ? 1 : 0,
                        }}
                        transition={{
                            duration: 0.8,
                            delay: startDelay + index * staggerDelay,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}
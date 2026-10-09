"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";

// Smooth, inertia-based scrolling for the whole page.
// Skipped for people who prefer reduced motion.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setEnabled(!mq.matches);
        const onChange = () => setEnabled(!mq.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    if (!enabled) return <>{children}</>;

    return (
        <ReactLenis
            root
            options={{
                lerp: 0.1, // lower = floatier, higher = snappier
                wheelMultiplier: 1,
                smoothWheel: true,
            }}
        >
            {children}
        </ReactLenis>
    );
}
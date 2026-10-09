"use client";

import { useEffect, useRef, useState } from "react";

// Only real desktop setups get the custom cursor: a precise pointer (mouse / trackpad),
// hover support, and a wide enough screen. Phones, tablets and small windows keep the
// normal system behaviour.
const QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

export default function CustomCursor() {
    const [enabled, setEnabled] = useState(false);
    const cursorRef = useRef<HTMLImageElement>(null);

    // turn the cursor on / off as the screen or input device changes
    useEffect(() => {
        const mq = window.matchMedia(QUERY);
        const update = () => setEnabled(mq.matches);

        update();
        mq.addEventListener("change", update);

        return () => mq.removeEventListener("change", update);
    }, []);

    // follow the mouse without re-rendering React on every move
    useEffect(() => {
        if (!enabled) return;

        const el = cursorRef.current;
        if (!el) return;

        const root = document.documentElement;
        let frame = 0;
        let x = -100;
        let y = -100;

        const render = () => {
            frame = 0;
            el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        };

        const move = (e: MouseEvent) => {
            x = e.clientX;
            y = e.clientY;
            el.style.opacity = "1";
            if (!frame) frame = requestAnimationFrame(render);
        };

        const leave = () => {
            el.style.opacity = "0";
        };
        const enter = () => {
            el.style.opacity = "1";
        };

        window.addEventListener("mousemove", move, { passive: true });
        root.addEventListener("mouseleave", leave);
        root.addEventListener("mouseenter", enter);

        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener("mousemove", move);
            root.removeEventListener("mouseleave", leave);
            root.removeEventListener("mouseenter", enter);
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <>
            <style jsx global>{`
                html,
                body,
                body * {
                    cursor: none !important;
                }
            `}</style>

            <img
                ref={cursorRef}
                src="/images/cursor.png"
                alt=""
                aria-hidden="true"
                draggable={false}
                className="pointer-events-none fixed left-0 top-0 z-[99999] select-none will-change-transform"
                style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "contain",
                    opacity: 0,
                    transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
                }}
            />
        </>
    );
}
"use client";

import { useEffect, useRef, useState } from "react";

const MAIN_IMAGE = "/images/intro/hero-portrait-3.png";

const TRAIL_IMAGES = [
  "/images/trail/trail-1.webp",
  "/images/trail/trail-2.webp",
  "/images/trail/trail-3.webp",
  "/images/trail/trail-4.webp",
  "/images/trail/trail-5.webp",
  "/images/trail/trail-6.webp",
];

type TrailItem = {
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
};

export default function HeroPortrait() {
  const frameRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const imageIndex = useRef(0);
  const nextId = useRef(0);
  const [trail, setTrail] = useState<TrailItem[]>([]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let lastSpawn = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function handlePointerEnter(event: PointerEvent) {
      const rect = frame!.getBoundingClientRect();
      lastPosition.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;

      const rect = frame!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const dx = x - lastPosition.current.x;
      const dy = y - lastPosition.current.y;
      const distance = Math.hypot(dx, dy);
      const now = performance.now();

      // Require a little movement and a short interval between images.
      if (distance < 65 || now - lastSpawn < 110) return;

      lastPosition.current = { x, y };
      lastSpawn = now;

      const item: TrailItem = {
        id: nextId.current++,
        src: TRAIL_IMAGES[imageIndex.current % TRAIL_IMAGES.length],
        x,
        y,
        rotation: (Math.random() - 0.5) * 8,
      };

      imageIndex.current++;

      setTrail((current) => [...current.slice(-4), item]);

      const timer = setTimeout(() => {
        setTrail((current) =>
          current.filter((image) => image.id !== item.id)
        );
      }, 650);

      timers.push(timer);
    }

    frame.addEventListener("pointerenter", handlePointerEnter);
    frame.addEventListener("pointermove", handlePointerMove);

    return () => {
      frame.removeEventListener("pointerenter", handlePointerEnter);
      frame.removeEventListener("pointermove", handlePointerMove);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className="relative h-full w-full overflow-hidden bg-neutral-200"
    >
      <img
        src={MAIN_IMAGE}
        alt="Portrait"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {trail.map((item) => (
        <div
          key={item.id}
          className="pointer-events-none absolute z-10 overflow-hidden rounded-md"
          style={{
            left: item.x,
            top: item.y,
            width: "55px",
            height: "72px",
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
            animation: "trailFade 650ms ease-out forwards",
          }}
        >
          <img
            src={item.src}
            alt=""
            draggable={false}
            className="h-full w-full object-contain"
            style={{
              animation:
                "trailReveal 280ms cubic-bezier(0.2, 0.7, 0.2, 1) both",
            }}
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes trailReveal {
          from {
            clip-path: inset(0 100% 0 0);
            opacity: 0.6;
          }
          to {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }

        @keyframes trailFade {
          0% {
            opacity: 0;
            scale: 0.94;
          }
          15% {
            opacity: 1;
            scale: 1;
          }
          60% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            scale: 1.03;
          }
        }
      `}</style>
    </div>
  );
}
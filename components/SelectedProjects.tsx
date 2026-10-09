"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

type Project = {
    title: string;
    category: string;
    href: string;
    image: string;
    role: string;
    timeline: string;
    year: string;
    team: string;
};

const projects: Project[] = [
    {
        title: "iPhone Ad",
        category: "Commercial · Sound Design",
        href: "https://www.linkedin.com/posts/tejas-yadav-348862381_sounddesign-audiopostproduction-foley-ugcPost-7496525482079961088-ZEux/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAF5G5WgBbTf-A1RTMyP_PwXmNe-3g-ZVUdk",
        image: "/images/selected-project/selected-1.jpg",
        role: "Sound Designer",
        timeline: "Not specified",
        year: "2026",
        team: "Individual Project",
    },
    {
        title: "AI Story Animation",
        category: "Narrative Sound Design",
        href: "https://www.youtube.com/watch?v=ZXs_R0NcUOU",
        image: "/images/selected-project/selected-2.gif",
        role: "Sound Designer",
        timeline: "Not specified",
        year: "2026",
        team: "Durlabh Darshan Assignment",
    },
    {
        title: "Foley Sound Design",
        category: "Thriller Soundscape",
        href: "https://lnkd.in/p/duThyTA6",
        image: "/images/selected-project/selected-3.jpg",
        role: "Sound Designer & Music Producer",
        timeline: "Not specified",
        year: "2026",
        team: "Experimental Project",
    },
];

const ACCENT = "#E53935";
const RULE = "bg-[#0A0A0A]/15";

// your links go to LinkedIn / YouTube, so the button says what will actually happen
function getButtonLabel(href: string) {
    if (href.includes("youtube.com") || href.includes("youtu.be")) return "Watch Video";
    if (href.includes("linkedin.com") || href.includes("lnkd.in")) return "View Post";
    return "Jump To Project";
}

// Typewriter text: when the row becomes active the letters are written one by one,
// each appearing in red and then settling to black.
function TypewriterText({
    text,
    active,
    startDelay = 0.08,
    step = 0.05,
}: {
    text: string;
    active: boolean;
    startDelay?: number;
    step?: number;
}) {
    const reduceMotion = useReducedMotion();

    // inactive (or reduced motion): plain static text
    if (!active || reduceMotion) return <>{text}</>;

    const words = text.split(" ");
    let index = 0;

    return (
        <>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {words.map((word, w) => (
                    <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
                        {word.split("").map((char) => {
                            const delay = startDelay + index++ * step;
                            return (
                                <motion.span
                                    key={index}
                                    className="inline-block"
                                    // hidden + red until its turn, then red -> black
                                    initial={{ opacity: 0, color: ACCENT }}
                                    animate={{ opacity: 1, color: [ACCENT, ACCENT, "#0A0A0A"] }}
                                    transition={{
                                        opacity: { duration: 0.01, delay },
                                        color: {
                                            duration: 0.6,
                                            delay,
                                            times: [0, 0.4, 1],
                                            ease: "easeOut",
                                        },
                                    }}
                                >
                                    {char}
                                </motion.span>
                            );
                        })}
                        {w < words.length - 1 ? "\u00A0" : null}
                    </span>
                ))}
            </span>
        </>
    );
}

export default function SelectedProjects() {
    const [active, setActive] = useState(0);

    return (
        <section
            // fluid side padding + top margin (was fixed px-17 / mt-25), same as the other sections
            className="mt-[clamp(3rem,8vw,6.25rem)] w-full overflow-x-clip bg-[#f8f7f4] px-[clamp(1.25rem,5vw,5.5rem)] text-[#0A0A0A]"
            // image width scales with the screen; row heights are derived from it
            style={{ "--img-w": "clamp(260px,24vw,480px)" } as CSSProperties}
        >
            <div className="mx-auto w-full max-w-[1500px]">
                <h2 className="text-[clamp(2rem,4vw,4rem)] font-medium tracking-tight">
                    Selected Projects
                </h2>

                <div aria-hidden="true" className={`mt-6 h-[1.5px] w-full sm:mt-8 ${RULE}`} />

                {/* Desktop (lg+): fixed-height column sized for 3 projects. The hovered row grows,
                    the others shrink. Phones & tablets: simple stack, every project fully visible. */}
                <ul className="lg:flex lg:h-[clamp(520px,40vw,800px)] lg:flex-col">
                    {projects.map((project, i) => {
                        const isActive = i === active;
                        const isExternal = project.href.startsWith("http");

                        // "Not specified" is placeholder text, so those fields are hidden
                        const details = [
                            ["Role", project.role],
                            ["Timeline", project.timeline],
                            ["Year", project.year],
                            ["Team", project.team],
                        ].filter(([, value]) => value && value !== "Not specified");

                        return (
                            <li
                                key={project.title}
                                onMouseEnter={() => setActive(i)}
                                onFocus={() => setActive(i)}
                                className={`lg:relative lg:flex lg:flex-1 lg:flex-col lg:overflow-hidden lg:transition-[min-height] lg:duration-500 lg:ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive
                                        ? "lg:min-h-[calc(var(--img-w)_*_0.667_+_48px)]"
                                        : "lg:min-h-[clamp(96px,7.8vw,150px)]"
                                    }`}
                            >
                                <Link
                                    href={project.href}
                                    target={isExternal ? "_blank" : undefined}
                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                    aria-label={`${project.title} - ${project.category}`}
                                    className="group block py-6 sm:py-8 lg:py-6"
                                >
                                    {/* phones: stacked · tablets: text left / image right · desktop: fixed image column */}
                                    <div className="grid grid-cols-1 items-start md:grid-cols-[1fr_minmax(0,38%)] md:gap-x-8 lg:grid-cols-[1fr_var(--img-w)] lg:gap-x-10">
                                        {/* Title + button */}
                                        <div className="min-w-0">
                                            <div className="flex flex-col items-start gap-y-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-6">
                                                <h3
                                                    className={`break-words text-[clamp(1.75rem,3.2vw,3.25rem)] font-medium leading-tight tracking-tight transition-[color,opacity] duration-300 ${isActive
                                                            ? "lg:text-[#E53935] lg:opacity-100"
                                                            : "lg:opacity-45"
                                                        }`}
                                                >
                                                    {project.title}
                                                </h3>

                                                <span
                                                    className={`group/btn inline-flex shrink-0 items-center gap-3 border px-[15px] py-[9px] text-[15px] font-medium leading-normal transition-[background-color,color,border-color,opacity] duration-300 hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white ${isActive
                                                            ? "border-[#0A0A0A]"
                                                            : "border-[#0A0A0A] lg:border-[#0A0A0A]/25 lg:opacity-45"
                                                        }`}
                                                >
                                                    {getButtonLabel(project.href)}
                                                    <svg
                                                        aria-hidden="true"
                                                        viewBox="0 0 16 16"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.4"
                                                        className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover/btn:-rotate-45"
                                                    >
                                                        <path d="M2 8h11M9 4l4 4-4 4" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Cover image: always visible below lg, fades in on the active row at lg+ */}
                                        <div
                                            className={`opacity-100 transition-opacity duration-500 md:col-start-2 ${isActive ? "" : "lg:opacity-0"
                                                }`}
                                        >
                                            <div className="group/cover relative mt-5 aspect-[16/10] w-full overflow-hidden bg-neutral-200 md:mt-0 md:aspect-[3/2]">
                                                <img
                                                    src={project.image}
                                                    alt={`${project.title} - ${project.category}`}
                                                    loading="lazy"
                                                    draggable={false}
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                />

                                                {/* hover overlay with chips (desktop) */}
                                                <div
                                                    className="absolute inset-0 hidden flex-col justify-end opacity-0 transition-opacity duration-300 group-hover/cover:opacity-100 lg:flex"
                                                    style={{
                                                        backgroundImage:
                                                            "linear-gradient(180deg, rgba(4,4,4,0) 19%, rgba(4,4,4,0.94) 100%)",
                                                    }}
                                                >
                                                    <div className="flex translate-y-1.5 flex-wrap gap-[7px] p-[14px] transition-transform duration-300 group-hover/cover:translate-y-0">
                                                        <span className="border border-white/20 bg-white/10 p-[9px] text-xs capitalize leading-none text-white">
                                                            {project.title}
                                                        </span>
                                                        <span className="max-w-full truncate border border-white/20 bg-white/10 p-[9px] text-xs capitalize leading-none text-white">
                                                            {project.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details: only on desktop, fade in on the active row */}
                                    <dl
                                        aria-hidden="true"
                                        className={`pointer-events-none hidden lg:absolute lg:bottom-6 lg:left-0 lg:flex lg:max-w-[calc(100%_-_var(--img-w)_-_60px)] lg:flex-wrap lg:gap-x-12 lg:gap-y-2 lg:transition-[opacity,transform] lg:duration-500 ${isActive
                                                ? "lg:translate-y-0 lg:opacity-100"
                                                : "lg:translate-y-1.5 lg:opacity-0"
                                            }`}
                                    >
                                        {details.map(([label, value], fieldIndex) => (
                                            <div key={label}>
                                                <dt className="text-[11px] uppercase tracking-[0.12em] text-[#7a746f]">
                                                    {label}
                                                </dt>
                                                <dd className="mt-1 text-[15px]">
                                                    {/* written one field after the other */}
                                                    <TypewriterText
                                                        text={value}
                                                        active={isActive}
                                                        startDelay={0.25 + fieldIndex * 0.2}
                                                        step={0.03}
                                                    />
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </Link>

                                {/* row divider */}
                                <div
                                    aria-hidden="true"
                                    className={`h-[1.5px] w-full ${RULE} lg:absolute lg:inset-x-0 lg:bottom-0`}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
"use client";

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";

type Note = {
    /** short label shown on the tab */
    tab: string;
    /** full heading shown above the text */
    title: string;
    text: string;
};

type Project = {
    title: string;
    category: string;
    href: string;
    image: string;
    year?: string;
    team?: string;
    notes: Note[];
};

const projects: Project[] = [
    {
        title: "iPhone Ad",
        category: "Commercial · Sound Design",
        href: "https://www.linkedin.com/posts/tejas-yadav-348862381_sounddesign-audiopostproduction-foley-ugcPost-7496525482079961088-ZEux/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAF5G5WgBbTf-A1RTMyP_PwXmNe-3g-ZVUdk",
        image: "/images/selected-project/selected-1.jpg",
        year: "2026",
        team: "Individual Project",
        notes: [
            {
                tab: "Overview",
                title: "Project Overview",
                text: "A complete sound redesign of an iPhone commercial, reimagining its sonic identity through carefully selected sound effects, precise synchronization and detailed audio placement.",
            },
            {
                tab: "Role",
                title: "My Role",
                text: "Sound Designer",
            },
            {
                tab: "Approach",
                title: "Sound Design Approach",
                text: "Crafted and synchronized sound effects to complement the product visuals, enhance transitions and create a cohesive, polished commercial soundscape.",
            },
            {
                tab: "Tools",
                title: "Tools Used",
                text: "FL Studio",
            },
        ],
    },
    {
        title: "AI Story Animation",
        category: "Narrative Sound Design",
        href: "https://www.youtube.com/watch?v=ZXs_R0NcUOU",
        image: "/images/selected-project/selected-2.jpg",
        year: "2026",
        team: "Durlabh Darshan Assignment",
        notes: [
            {
                tab: "Context",
                title: "Project Context",
                text: "Sound design assignment for Durlabh Darshan.",
            },
            {
                tab: "Overview",
                title: "Project Overview",
                text: "Designed the soundscape for a Krishna-themed animated scene as part of an assignment for Durlabh Darshan, shaping the audiovisual experience through carefully layered sound and music.",
            },
            {
                tab: "Role",
                title: "My Role",
                text: "Sound Designer",
            },
            {
                tab: "Approach",
                title: "Sound Design Approach",
                text: "Created and synchronized sound elements to complement the visuals, establish atmosphere and enhance the emotional and narrative impact of the scene.",
            },
            {
                tab: "Tools",
                title: "Tools Used",
                text: "FL Studio",
            },
        ],
    },
    {
        title: "Foley Sound Design",
        category: "Thriller Soundscape",
        href: "https://lnkd.in/p/duThyTA6",
        image: "/images/selected-project/selected-3.jpg",
        year: "2026",
        team: "Experimental Project",
        notes: [
            {
                tab: "Context",
                title: "Project Context",
                text: "An experimental sound design project exploring original recordings and cinematic sound creation.",
            },
            {
                tab: "Overview",
                title: "Project Overview",
                text: "Recorded original sounds using a mobile device and incorporated them into a thriller-inspired instrumental composition, transforming everyday recordings into elements of a cinematic soundscape.",
            },
            {
                tab: "Role",
                title: "My Role",
                text: "Sound Designer & Music Producer",
            },
            {
                tab: "Approach",
                title: "Sound Design Approach",
                text: "Experimented with recorded sounds and layered them with musical elements to create tension, atmosphere and a dark cinematic mood.",
            },
            {
                tab: "Tools",
                title: "Tools Used",
                text: "FL Studio · Mobile Audio Recording",
            },
        ],
    },
    {
        title: "Laal Rang",
        category: "Music Composition",
        href: "https://www.youtube.com/watch?v=r3q0GrDuhnc",
        image: "/images/selected-project/selected-4.jpg",
        team: "Short Film",
        notes: [
            {
                tab: "Overview",
                title: "Project Overview",
                text: "Composed and produced the background score for Laal Rang, an experimental short film portraying domestic violence through a child's perspective. The music supports the film's emotional narrative, highlighting the contrast between the innocence of childhood and the painful realities of abuse.",
            },
            {
                tab: "Role",
                title: "My Role",
                text: "Background Score Composer & Producer",
            },
        ],
    },
    {
        title: "CHEEKH",
        category: "Film Music · Production & Mixing",
        href: "https://youtu.be/8wjQPXZBXq4?si=Rb_WufvRkY-UpB4T",
        image: "/images/selected-project/selected-5.jpg",
        team: "Short Film",
        notes: [
            {
                tab: "Scope",
                title: "Scope",
                text: "Background Music & Track Production",
            },
            {
                tab: "Overview",
                title: "Project Overview",
                text: "Produced “Na Boli Mai” for CHEEKH, a socially conscious short film addressing sexual violence, victim-blaming, and the stigma survivors face within families and society. The track has surpassed 47,000 views on YouTube, contributing to the film’s emotionally driven storytelling.",
            },
            {
                tab: "Role",
                title: "My Role",
                text: "Music Producer — “Na Boli Mai”",
            },
        ],
    },
];

const ACCENT = "#E53935";
const RULE = "bg-[#0A0A0A]/15";

// how long the cursor must rest on a row before it opens (ms): fast sweeps over
// the list no longer trigger a resize + panel animation for every row they cross
const HOVER_INTENT = 80;

const pad = (n: number) => String(n).padStart(2, "0");

// your links go to LinkedIn / YouTube, so the button says what will actually happen
function getButtonLabel(href: string) {
    if (href.includes("youtube.com") || href.includes("youtu.be")) return "Watch Video";
    if (href.includes("linkedin.com") || href.includes("lnkd.in")) return "View Post";
    return "Jump To Project";
}

// "Liner notes": a small mixer-channel-style panel. Each note is a channel; the active
// channel gets a level meter and a red playhead, and its text rises in.
// Built only with CSS transforms / opacity (no JS animation), so it stays light.
// On desktop it fades up when the row is hovered; on phones and tablets it is always
// open (tap a channel to switch).
function ProjectNotesBase({ project, isActive }: { project: Project; isActive: boolean }) {
    const [tab, setTab] = useState(0);
    const note = project.notes[tab];

    return (
        <aside
            aria-label={`${project.title} notes`}
            className={`relative z-10 mb-6 border border-[#0A0A0A]/15 bg-[#f8f7f4] lg:absolute lg:bottom-6 lg:left-0 lg:mb-0 lg:w-[calc(100%_-_var(--img-w)_-_40px)] lg:transition-[opacity,transform,visibility] lg:duration-300 lg:ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive
                    ? "lg:visible lg:translate-y-0 lg:opacity-100"
                    : "lg:invisible lg:translate-y-2 lg:opacity-0"
                }`}
        >
            {/* header */}
            <div className="flex items-center justify-between gap-4 border-b border-[#0A0A0A]/10 px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-[#7a746f]">
                <span className="flex items-center gap-2">
                    <span
                        aria-hidden="true"
                        className="inline-flex h-2 w-2 rounded-full"
                        style={{ backgroundColor: ACCENT }}
                    />
                    Liner notes
                </span>
                <span className="truncate">
                    {[project.year, project.team].filter(Boolean).join(" · ")}
                </span>
            </div>

            {/* channels */}
            <div role="tablist" className="flex flex-wrap gap-x-5 gap-y-1 px-4 pt-3">
                {project.notes.map((n, i) => {
                    const on = i === tab;

                    return (
                        <button
                            key={n.tab}
                            type="button"
                            role="tab"
                            aria-selected={on}
                            onMouseEnter={() => setTab(i)}
                            onFocus={() => setTab(i)}
                            onClick={() => setTab(i)}
                            className={`relative flex items-center gap-2 pb-2 text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${on ? "text-[#0A0A0A]" : "text-[#7a746f]"
                                }`}
                        >
                            <span className={`tabular-nums ${on ? "text-[#E53935]" : ""}`}>
                                {pad(i + 1)}
                            </span>
                            {n.tab}

                            {/* level meter on the active channel (paused while the row is closed) */}
                            {on && (
                                <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
                                    {[0, 0.25, 0.5].map((d) => (
                                        <span
                                            key={d}
                                            className={`meter-bar block h-full w-[2px] ${isActive ? "" : "[animation-play-state:paused]"
                                                }`}
                                            style={{ backgroundColor: ACCENT, animationDelay: `${d}s` }}
                                        />
                                    ))}
                                </span>
                            )}

                            {/* red playhead underline */}
                            <span
                                aria-hidden="true"
                                className={`absolute inset-x-0 -bottom-px h-[1.5px] origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "scale-x-100" : "scale-x-0"
                                    }`}
                                style={{ backgroundColor: ACCENT }}
                            />
                        </button>
                    );
                })}
            </div>
            <div aria-hidden="true" className="mx-4 h-px bg-[#0A0A0A]/10" />

            {/* text: one element, one CSS animation. The key replays it on every tab
                switch and every time the row opens. */}
            <div className="px-4 pb-4 pt-4 lg:min-h-[8.5rem]" aria-live="polite">
                <div key={`${tab}-${isActive}`} className="note-in">
                    <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                        {note.title}
                    </p>
                    <p className="mt-2 text-[clamp(0.875rem,0.95vw,1.0625rem)] leading-relaxed text-[#483A35]">
                        {note.text}
                    </p>
                </div>
            </div>
        </aside>
    );
}

const ProjectNotes = memo(ProjectNotesBase);

type RowProps = {
    project: Project;
    index: number;
    isActive: boolean;
    onIntent: (i: number) => void;
    onNow: (i: number) => void;
    onLeave: () => void;
};

// memoized: hovering only re-renders the row that closes and the row that opens,
// not the whole list
const ProjectRow = memo(function ProjectRow({
    project,
    index,
    isActive,
    onIntent,
    onNow,
    onLeave,
}: RowProps) {
    const isExternal = project.href.startsWith("http");

    return (
        <li
            onMouseEnter={() => onIntent(index)}
            onMouseLeave={onLeave}
            onFocus={() => onNow(index)}
            className={`lg:relative lg:flex lg:flex-none lg:flex-col lg:overflow-hidden lg:transition-[height] lg:duration-[400ms] lg:ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive
                    ? "lg:h-[clamp(400px,29vw,470px)]"
                    : "lg:h-[clamp(96px,7.8vw,150px)]"
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
                                className={`break-words text-[clamp(1.75rem,3.2vw,3.25rem)] font-medium leading-tight tracking-tight transition-[color,opacity] duration-300 ${isActive ? "lg:text-[#E53935] lg:opacity-100" : "lg:opacity-45"
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
                        className={`opacity-100 transition-opacity duration-300 md:col-start-2 ${isActive ? "" : "lg:opacity-0"
                            }`}
                    >
                        <div className="group/cover relative mt-5 aspect-[16/10] w-full overflow-hidden bg-neutral-200 md:mt-0 md:aspect-[3/2]">
                            <img
                                src={project.image}
                                alt={`${project.title} - ${project.category}`}
                                loading="lazy"
                                decoding="async"
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
            </Link>

            {/* notes panel: outside the link, because its tabs are buttons */}
            <ProjectNotes project={project} isActive={isActive} />

            {/* row divider */}
            <div
                aria-hidden="true"
                className={`h-[1.5px] w-full ${RULE} lg:absolute lg:inset-x-0 lg:bottom-0`}
            />
        </li>
    );
});

export default function SelectedProjects() {
    const [active, setActive] = useState(0);
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearHover = useCallback(() => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
            hoverTimer.current = null;
        }
    }, []);

    // hover intent: only open once the cursor settles on a row
    const intentTo = useCallback(
        (i: number) => {
            clearHover();
            hoverTimer.current = setTimeout(() => setActive(i), HOVER_INTENT);
        },
        [clearHover],
    );

    // keyboard focus opens right away
    const activateNow = useCallback(
        (i: number) => {
            clearHover();
            setActive(i);
        },
        [clearHover],
    );

    useEffect(() => clearHover, [clearHover]);

    return (
        <section
            // fluid side padding + top margin (was fixed px-17 / mt-25), same as the other sections
            className="mt-[clamp(3rem,8vw,6.25rem)] w-full whitespace-normal overflow-x-clip bg-[#f8f7f4] px-[clamp(1.25rem,5vw,5.5rem)] text-[#0A0A0A]"
            // image width scales with the screen; row heights are derived from it
            style={{ "--img-w": "clamp(260px,24vw,480px)" } as CSSProperties}
        >
            {/* notes panel animations: transform + opacity only, so they run on the GPU */}
            <style>{`
                @keyframes meter {
                    0%, 100% { transform: scaleY(0.25); }
                    50% { transform: scaleY(1); }
                }
                @keyframes note-in {
                    from { opacity: 0; transform: translate3d(0, 8px, 0); }
                    to { opacity: 1; transform: translate3d(0, 0, 0); }
                }
                .meter-bar {
                    transform-origin: bottom;
                    animation: meter 0.9s ease-in-out infinite;
                }
                .note-in > * {
                    animation: note-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
                }
                .note-in > *:nth-child(2) {
                    animation-delay: 0.06s;
                }
                @media (prefers-reduced-motion: reduce) {
                    .meter-bar { animation: none; transform: scaleY(0.6); }
                    .note-in > * { animation: none; }
                }
            `}</style>

            <div className="mx-auto w-full max-w-[1500px]">
                <h2 className="text-[clamp(2rem,4vw,4rem)] font-medium tracking-tight">
                    Selected Projects
                </h2>

                <div aria-hidden="true" className={`mt-6 h-[1.5px] w-full sm:mt-8 ${RULE}`} />

                {/* Desktop (lg+): fixed-height column sized for 3 projects. The hovered row grows
                    and opens its notes panel, the others shrink. Phones & tablets: simple stack,
                    every project fully visible with its notes open. */}
                <ul className="lg:flex lg:flex-col">
                    {projects.map((project, i) => (
                        <ProjectRow
                            key={project.title}
                            project={project}
                            index={i}
                            isActive={i === active}
                            onIntent={intentTo}
                            onNow={activateNow}
                            onLeave={clearHover}
                        />
                    ))}
                </ul>
            </div>
        </section>
    );
}